import logging

import requests
from django.conf import settings

logger = logging.getLogger(__name__)


def _get_bot_api_base_url():
    base_url = getattr(settings, 'BOT_API_BASE_URL', '').strip()
    if base_url:
        return base_url.rstrip('/')
    bot_url = (settings.BOT_API_URL or '').strip()
    if bot_url.endswith('/api/order/create'):
        return bot_url.rsplit('/api/order/create', 1)[0]
    if bot_url.endswith('/api/order/create/'):
        return bot_url.rsplit('/api/order/create/', 1)[0]
    return bot_url.rstrip('/')


def check_discord_membership(discord_id):
    if not discord_id:
        return False
    base_url = _get_bot_api_base_url()
    if not base_url or not settings.BOT_API_SECRET:
        logger.warning('BOT_API_BASE_URL/BOT_API_URL or BOT_API_SECRET is missing; cannot check membership')
        return None

    try:
        response = requests.post(
            f"{base_url}/api/order/check-membership",
            json={'discord_id': discord_id},
            headers={'X-API-Key': settings.BOT_API_SECRET},
            timeout=10,
        )
        if response.ok:
            data = response.json()
            return bool(data.get('is_member'))
        logger.warning('Membership check failed: %s %s', response.status_code, response.text)
    except requests.RequestException as exc:
        logger.warning('Membership check failed: %s', exc)
    return None


def send_order_ticket(order, order_items):
    discord_id = getattr(getattr(order.user, 'profile', None), 'discord_id', None)
    discord_tag = getattr(getattr(order.user, 'profile', None), 'discord_username', None)
    if not discord_id:
        logger.info('No discord_id for user %s; skipping ticket', order.user_id)
        return None
    if not settings.BOT_API_URL or not settings.BOT_API_SECRET:
        logger.warning('BOT_API_URL or BOT_API_SECRET is missing; skipping ticket')
        return None

    site_url = (getattr(settings, 'SITE_URL', '') or '').rstrip('/')

    def _build_image_url(image_field):
        if not image_field:
            return None
        try:
            url = image_field.url
        except ValueError:
            return None
        if site_url and url.startswith('/'):
            return f"{site_url}{url}"
        return url

    payload = {
        'discord_id': discord_id,
        'discord_tag': discord_tag,
        'order_id': order.order_id,
        'website_username': order.user.username,
        'name': f"{order.user.first_name} {order.user.last_name}".strip(),
        'email': order.user.email,
        'payment_method': order.payment_method,
        'status': 'Pending',
        'total_price': str(order.total_price),
        'items': [
            {
                'name': item.product.name,
                'quantity': item.quantity,
                'price': str(item.price),
                'image_url': _build_image_url(getattr(item.product, 'image', None)),
            }
            for item in order_items
        ],
    }

    try:
        response = requests.post(
            settings.BOT_API_URL,
            json=payload,
            headers={'X-API-Key': settings.BOT_API_SECRET},
            timeout=10,
        )
        if response.ok:
            data = response.json()
            return data.get('channel_id')
        logger.warning('Bot ticket request failed: %s %s', response.status_code, response.text)
    except requests.RequestException as exc:
        logger.warning('Bot ticket request failed: %s', exc)

    return None
