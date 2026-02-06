"""
Discord OAuth2 authentication backend for Django.
"""
import logging

import requests
from django.contrib.auth.models import User
from django.conf import settings
from .models import UserProfile

logger = logging.getLogger(__name__)


class DiscordOAuthBackend:
    """
    Custom authentication backend for Discord OAuth2.
    Handles Discord user authentication and profile creation.
    """
    
    DISCORD_API_URL = "https://discord.com/api/v10"
    DISCORD_OAUTH_AUTHORIZE_URL = "https://discord.com/oauth2/authorize"
    DISCORD_OAUTH_TOKEN_URL = f"{DISCORD_API_URL}/oauth2/token"
    
    @staticmethod
    def get_auth_url(state=None):
        """Generate Discord OAuth authorization URL."""
        params = {
            'client_id': settings.DISCORD_CLIENT_ID,
            'redirect_uri': settings.DISCORD_REDIRECT_URI,
            'response_type': 'code',
            'scope': 'identify email',
        }
        if state:
            params['state'] = state
        
        query_string = '&'.join(f"{k}={v}" for k, v in params.items())
        return f"{DiscordOAuthBackend.DISCORD_OAUTH_AUTHORIZE_URL}?{query_string}"
    
    @staticmethod
    def exchange_code_for_token(code):
        """Exchange authorization code for access token."""
        data = {
            'client_id': settings.DISCORD_CLIENT_ID,
            'client_secret': settings.DISCORD_CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': settings.DISCORD_REDIRECT_URI,
            'scope': 'identify email',
        }
        
        response = requests.post(DiscordOAuthBackend.DISCORD_OAUTH_TOKEN_URL, data=data)
        response.raise_for_status()
        return response.json()
    
    @staticmethod
    def get_user_info(access_token):
        """Fetch user information from Discord API."""
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        
        response = requests.get(f"{DiscordOAuthBackend.DISCORD_API_URL}/users/@me", headers=headers)
        response.raise_for_status()
        return response.json()
    
    @staticmethod
    def authenticate(code):
        """
        Authenticate user with Discord OAuth code.
        Returns the authenticated user or None.
        """
        try:
            # Exchange code for access token
            token_data = DiscordOAuthBackend.exchange_code_for_token(code)
            access_token = token_data.get('access_token')
            
            if not access_token:
                return None
            
            # Get user info from Discord
            user_info = DiscordOAuthBackend.get_user_info(access_token)
            discord_id = user_info.get('id')
            discord_username = user_info.get('username')
            email = user_info.get('email')
            avatar = user_info.get('avatar')
            
            if not discord_id:
                return None
            
            # Build Discord avatar URL if avatar exists
            avatar_url = None
            if avatar:
                avatar_url = f"https://cdn.discordapp.com/avatars/{discord_id}/{avatar}.png"
            
            # Try to get existing user by discord_id
            try:
                profile = UserProfile.objects.get(discord_id=discord_id)
                user = profile.user
                # Update Discord info
                profile.discord_username = discord_username
                profile.discord_avatar_url = avatar_url
                profile.save()
                return user
            except UserProfile.DoesNotExist:
                pass
            
            # Try to get user by email
            if email:
                try:
                    user = User.objects.get(email=email)
                    # Create profile for existing user
                    profile, _ = UserProfile.objects.get_or_create(user=user)
                    profile.discord_id = discord_id
                    profile.discord_username = discord_username
                    profile.discord_avatar_url = avatar_url
                    profile.save()
                    return user
                except User.DoesNotExist:
                    pass
            
            # Create new user
            # Use discord_username as username, but ensure uniqueness
            username = discord_username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{discord_username}{counter}"
                counter += 1
            
            user = User.objects.create_user(
                username=username,
                email=email or f"{discord_id}@discord.local",
                first_name=discord_username[:30] if discord_username else ""
            )
            
            # Create user profile
            profile = UserProfile.objects.create(
                user=user,
                discord_id=discord_id,
                discord_username=discord_username,
                discord_avatar_url=avatar_url
            )
            
            return user
            
        except requests.RequestException as e:
            logger.warning('Discord OAuth error: %s', e)
            return None
        except Exception as e:
            logger.exception('Unexpected error during Discord OAuth: %s', e)
            return None
