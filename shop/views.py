import logging
import json
import re

from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Sum, F
from django.http import JsonResponse, HttpResponseBadRequest
from django.db.models import Count, Q
from django.conf import settings
from .models import Product, Order, OrderItem, UserProfile
from .models import Wishlist, Review
from .models import ReviewLike
from .discord_integration import send_order_ticket, check_discord_membership
from django.db.models import Avg, Count
from decimal import Decimal
import uuid
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from datetime import timedelta, datetime

logger = logging.getLogger(__name__)


def _discord_api_authorized(request):
    api_key = request.headers.get('x-api-key') or request.headers.get('X-API-Key')
    return bool(settings.BOT_API_SECRET) and api_key == settings.BOT_API_SECRET


def _parse_json_payload(request):
    try:
        return json.loads(request.body.decode('utf-8'))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None


# ═══════════════════════════════════════════════════════════════════════════
# AUTHENTICATION VIEWS
# ═══════════════════════════════════════════════════════════════════════════

def register_view(request):
    """Handle user registration"""
    if request.user.is_authenticated:
        return redirect('shop:shop_list')
    
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        password1 = request.POST.get('password1', '')
        password2 = request.POST.get('password2', '')

        # Validation
        if not username or not email or not password1:
            messages.error(request, 'All fields are required')
            return render(request, 'shop/register.html')

        if password1 != password2:
            messages.error(request, 'Passwords do not match')
            return render(request, 'shop/register.html')

        if len(password1) < 8:
            messages.error(request, 'Password must be at least 8 characters')
            return render(request, 'shop/register.html')

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already taken')
            return render(request, 'shop/register.html')

        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already registered')
            return render(request, 'shop/register.html')

        # Create user
        user = User.objects.create_user(username=username, email=email, password=password1)
        login(request, user)
        messages.success(request, f'Welcome {username}! Account created successfully.')
        return redirect('shop:shop_list')

    return render(request, 'shop/register.html')


def login_view(request):
    """Handle user login"""
    if request.user.is_authenticated:
        return redirect('shop:shop_list')

    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')

        if not username or not password:
            messages.error(request, 'Username and password are required')
            return render(request, 'shop/login.html')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            messages.success(request, f'Welcome back, {username}!')
            return redirect(request.GET.get('next', 'shop:shop_list'))
        else:
            messages.error(request, 'Invalid username or password')
            return render(request, 'shop/login.html')

    return render(request, 'shop/login.html')


def logout_view(request):
    """Handle user logout"""
    logout(request)
    messages.success(request, 'Logged out successfully')
    return redirect('shop:shop_list')


# ═══════════════════════════════════════════════════════════════════════════
# CART VIEWS
# ═══════════════════════════════════════════════════════════════════════════

def get_cart(request):
    """Retrieve cart from session"""
    if 'cart' not in request.session:
        request.session['cart'] = {}
    return request.session['cart']


def save_cart(request, cart):
    """Save cart to session"""
    request.session['cart'] = cart
    request.session.modified = True


def shop_list(request):
    """Display all active products"""
    products = Product.objects.filter(is_active=True)
    return render(request, 'shop/shop.html', {'products': products})


def cart_view(request):
    """Display shopping cart"""
    cart = get_cart(request)
    
    # Build cart items with product data
    cart_items = []
    total_price = Decimal('0.00')
    
    for product_id_str, quantity in cart.items():
        product = get_object_or_404(Product, id=int(product_id_str))
        item_subtotal = product.price * quantity
        total_price += item_subtotal
        
        cart_items.append({
            'product': product,
            'quantity': quantity,
            'subtotal': item_subtotal
        })

    context = {
        'cart_items': cart_items,
        'total_price': total_price,
        'item_count': sum(q for q in cart.values()),
    }
    return render(request, 'shop/cart.html', context)


def add_to_cart(request, product_id):
    """Add product to cart"""
    product = get_object_or_404(Product, id=product_id, is_active=True)
    
    cart = get_cart(request)
    product_id_str = str(product_id)
    
    if product_id_str in cart:
        cart[product_id_str] += 1
    else:
        cart[product_id_str] = 1
    
    save_cart(request, cart)
    messages.success(request, f'{product.name} added to cart')
    
    # Return to shop or previous page
    return redirect(request.GET.get('next', 'shop:shop_list'))


def remove_from_cart(request, product_id):
    """Remove product from cart"""
    cart = get_cart(request)
    product_id_str = str(product_id)
    
    if product_id_str in cart:
        product = get_object_or_404(Product, id=product_id)
        del cart[product_id_str]
        save_cart(request, cart)
        messages.success(request, f'{product.name} removed from cart')
    
    return redirect('shop:cart')


def update_cart(request, product_id):
    """Update product quantity in cart"""
    if request.method != 'POST':
        return redirect('shop:cart')
    
    cart = get_cart(request)
    product_id_str = str(product_id)
    quantity = request.POST.get('quantity', '0')
    
    try:
        quantity = int(quantity)
        if quantity < 0:
            quantity = 0
    except ValueError:
        quantity = 0

    if quantity == 0:
        if product_id_str in cart:
            del cart[product_id_str]
    else:
        cart[product_id_str] = quantity

    save_cart(request, cart)
    return redirect('shop:cart')


# ═══════════════════════════════════════════════════════════════════════════
# CHECKOUT & ORDER VIEWS
# ═══════════════════════════════════════════════════════════════════════════

@login_required(login_url='shop:login')
def checkout_view(request):
    """Checkout - convert cart to order"""
    cart = get_cart(request)
    
    if not cart:
        messages.error(request, 'Your cart is empty')
        return redirect('shop:cart')

    if request.method == 'POST':
        logger.info('Checkout submitted by user %s', request.user.id)
        # Save buyer details onto the user profile
        request.user.first_name = request.POST.get('first_name', '').strip()
        request.user.last_name = request.POST.get('last_name', '').strip()
        request.user.email = request.POST.get('email', '').strip()
        request.user.save(update_fields=['first_name', 'last_name', 'email'])

        # Get payment method from form
        payment_method = request.POST.get('payment_method', '').strip().lower()
        
        # Validate payment method
        if payment_method != 'discord':
            messages.error(request, 'Please select Discord as the payment method to continue.')
            return redirect('shop:checkout')

        # Create the order, then redirect user to Discord for ticket creation
        
        # Calculate total
        total_price = Decimal('0.00')
        order_items_data = []

        for product_id_str, quantity in cart.items():
            product = get_object_or_404(Product, id=int(product_id_str))
            item_subtotal = product.price * quantity
            total_price += item_subtotal
            order_items_data.append({
                'product': product,
                'quantity': quantity,
                'price': product.price
            })

        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        discord_id_input = request.POST.get('discord_id', '').strip()
        if not profile.discord_id and discord_id_input:
            if not re.fullmatch(r'\d{17,20}', discord_id_input):
                messages.error(request, 'Please enter a valid Discord ID (17-20 digits).')
                return redirect('shop:checkout')
            profile.discord_id = discord_id_input
            profile.save(update_fields=['discord_id'])

        if not profile.discord_id:
            messages.warning(request, 'Connect your Discord account or enter your Discord ID to continue.')
            return redirect('shop:checkout')

        try:
            order = Order.objects.create(
                user=request.user,
                order_id=str(uuid.uuid4()),
                total_price=total_price,
                status='awaiting_discord',
                payment_method='discord',
                payment_status='awaiting_discord'
            )
            logger.info('Order created %s for user %s', order.order_id, request.user.id)

            # Create order items
            created_items = []
            for item in order_items_data:
                created_items.append(OrderItem.objects.create(
                    order=order,
                    product=item['product'],
                    quantity=item['quantity'],
                    price=item['price']
                ))

            # Clear cart
            request.session['cart'] = {}
            request.session.modified = True

            request.session['pending_order_id'] = order.order_id
            request.session.modified = True

            is_member = check_discord_membership(profile.discord_id)
            if is_member is False:
                logger.info('User %s not in Discord guild; redirecting to join flow', request.user.id)
                messages.info(request, 'Join our Discord server to open your ticket.')
                return redirect('shop:join_discord', order_id=order.order_id)
            if is_member is None:
                logger.warning('Membership check failed for user %s; attempting ticket creation anyway', request.user.id)
                channel_id = send_order_ticket(order, created_items)
                if channel_id:
                    order.discord_ticket_channel_id = channel_id
                    order.save(update_fields=['discord_ticket_channel_id'])
                    return redirect('shop:order_placed', order_id=order.order_id)
                messages.warning(request, 'We could not verify your Discord membership yet. Please try again.')
                return redirect('shop:join_discord', order_id=order.order_id)

            if not order.discord_ticket_channel_id:
                channel_id = send_order_ticket(order, created_items)
                if channel_id:
                    order.discord_ticket_channel_id = channel_id
                    order.save(update_fields=['discord_ticket_channel_id'])
                else:
                    logger.warning('Ticket creation failed for order %s', order.order_id)

            return redirect('shop:order_placed', order_id=order.order_id)
        
        except Exception as e:
            messages.error(request, f'Error creating order: {str(e)}')
            return redirect('shop:checkout')

    # GET request - show checkout page
    cart_items = []
    total_price = Decimal('0.00')
    
    for product_id_str, quantity in cart.items():
        product = get_object_or_404(Product, id=int(product_id_str))
        item_subtotal = product.price * quantity
        total_price += item_subtotal
        
        cart_items.append({
            'product': product,
            'quantity': quantity,
            'subtotal': item_subtotal
        })

    context = {
        'cart_items': cart_items,
        'total_price': total_price,
        'item_count': sum(q for q in cart.values()),
        'needs_discord_id': not bool(getattr(getattr(request.user, 'profile', None), 'discord_id', None)),
    }
    return render(request, 'shop/checkout.html', context)


@login_required(login_url='shop:login')
def order_placed_view(request, order_id):
    """Order placed page for Discord-only checkout"""
    order = get_object_or_404(Order, order_id=order_id, user=request.user)
    if request.session.get('pending_order_id') == order.order_id:
        request.session.pop('pending_order_id', None)
        request.session.modified = True
    context = {
        'order': order,
        'discord_invite_link': settings.DISCORD_INVITE_LINK or '#',
    }
    return render(request, 'shop/order_placed.html', context)


@login_required(login_url='shop:login')
def join_discord_view(request, order_id):
    """Prompt user to join Discord and open ticket"""
    order = get_object_or_404(Order, order_id=order_id, user=request.user)
    profile = getattr(request.user, 'profile', None)
    discord_id = getattr(profile, 'discord_id', None)

    if order.discord_ticket_channel_id:
        return redirect('shop:order_placed', order_id=order.order_id)

    if request.method == 'POST':
        logger.info('Join Discord confirmation for order %s', order.order_id)
        discord_id_input = request.POST.get('discord_id', '').strip()
        if not discord_id and discord_id_input:
            if not re.fullmatch(r'\d{17,20}', discord_id_input):
                messages.error(request, 'Please enter a valid Discord ID (17-20 digits).')
                return redirect('shop:join_discord', order_id=order.order_id)
            profile = profile or UserProfile.objects.create(user=request.user)
            profile.discord_id = discord_id_input
            profile.save(update_fields=['discord_id'])
            discord_id = profile.discord_id

        if not discord_id:
            messages.warning(request, 'Connect your Discord account or enter your Discord ID first.')
            next_url = request.path
            return redirect(f"{reverse('shop:discord_login')}?next={next_url}")

        is_member = check_discord_membership(discord_id)
        if is_member is False:
            messages.info(request, 'We still do not see you in the server. Please join and try again.')
        elif is_member is None:
            messages.warning(request, 'Membership check failed. Please try again in a moment.')
        else:
            if not order.discord_ticket_channel_id:
                items = list(order.items.select_related('product'))
                channel_id = send_order_ticket(order, items)
                if channel_id:
                    order.discord_ticket_channel_id = channel_id
                    order.save(update_fields=['discord_ticket_channel_id'])
                else:
                    messages.warning(request, 'Ticket creation failed. Please contact support.')
                    return redirect('shop:order_placed', order_id=order.order_id)
            return redirect('shop:order_placed', order_id=order.order_id)

    context = {
        'order': order,
        'discord_invite_link': settings.DISCORD_INVITE_LINK or '#',
        'has_discord_id': bool(discord_id),
    }
    return render(request, 'shop/join_discord.html', context)


@login_required(login_url='shop:login')
def join_discord_status_view(request, order_id):
    """Poll Discord membership and create ticket when ready."""
    order = get_object_or_404(Order, order_id=order_id, user=request.user)
    profile = getattr(request.user, 'profile', None)
    discord_id = getattr(profile, 'discord_id', None)

    if not discord_id:
        return JsonResponse({'ok': True, 'needs_discord_id': True, 'is_member': False})

    if order.discord_ticket_channel_id:
        return JsonResponse({
            'ok': True,
            'is_member': True,
            'ticket_created': True,
            'redirect_url': reverse('shop:order_placed', kwargs={'order_id': order.order_id}),
        })

    is_member = check_discord_membership(discord_id)
    if is_member is False:
        return JsonResponse({'ok': True, 'is_member': False, 'ticket_created': False})
    if is_member is None:
        return JsonResponse({'ok': False, 'error': 'membership_check_failed'})

    items = list(order.items.select_related('product'))
    channel_id = send_order_ticket(order, items)
    if channel_id:
        order.discord_ticket_channel_id = channel_id
        order.save(update_fields=['discord_ticket_channel_id'])
        return JsonResponse({
            'ok': True,
            'is_member': True,
            'ticket_created': True,
            'redirect_url': reverse('shop:order_placed', kwargs={'order_id': order.order_id}),
        })

    logger.warning('Ticket creation failed during membership polling for order %s', order.order_id)
    return JsonResponse({'ok': False, 'error': 'ticket_create_failed'})


@csrf_exempt
@require_POST
def discord_order_create(request):
    """Sync ticket channel creation from Discord bot"""
    if not _discord_api_authorized(request):
        return JsonResponse({'error': 'Unauthorized'}, status=403)

    payload = _parse_json_payload(request)
    if not payload:
        return JsonResponse({'error': 'Invalid JSON payload'}, status=400)

    order_id = (payload.get('order_id') or '').strip()
    channel_id = (payload.get('channel_id') or '').strip()
    discord_id = (payload.get('discord_id') or '').strip()

    if not order_id or not channel_id or not discord_id:
        return JsonResponse({'error': 'Missing order_id, channel_id, or discord_id'}, status=400)

    order = Order.objects.filter(order_id=order_id, payment_method='discord').first()
    if not order:
        return JsonResponse({'error': 'Order not found'}, status=404)

    profile = getattr(order.user, 'profile', None)
    if not profile or profile.discord_id != discord_id:
        return JsonResponse({'error': 'Discord ID does not match order owner'}, status=403)

    if order.discord_ticket_channel_id and order.discord_ticket_channel_id != channel_id:
        logger.warning('Order %s already has a ticket channel: %s', order_id, order.discord_ticket_channel_id)
        return JsonResponse({'error': 'Ticket already exists'}, status=409)

    if not order.discord_ticket_channel_id:
        order.discord_ticket_channel_id = channel_id
        order.save(update_fields=['discord_ticket_channel_id'])

    return JsonResponse({'ok': True, 'order_id': order.order_id, 'channel_id': channel_id})


@csrf_exempt
@require_POST
def discord_order_paid(request):
    """Mark an order as paid from Discord bot"""
    if not _discord_api_authorized(request):
        return JsonResponse({'error': 'Unauthorized'}, status=403)

    payload = _parse_json_payload(request)
    if not payload:
        return JsonResponse({'error': 'Invalid JSON payload'}, status=400)

    order_id = (payload.get('order_id') or '').strip()
    confirmed_by = (payload.get('confirmed_by') or '').strip()

    if not order_id or not confirmed_by:
        return JsonResponse({'error': 'Missing order_id or confirmed_by'}, status=400)

    order = Order.objects.filter(order_id=order_id, payment_method='discord').first()
    if not order:
        return JsonResponse({'error': 'Order not found'}, status=404)

    if order.status == 'paid' and order.payment_status == 'completed':
        return JsonResponse({'ok': True, 'order_id': order.order_id, 'status': 'already_paid'})

    order.status = 'paid'
    order.payment_status = 'completed'
    order.paid_at = timezone.now()
    order.confirmed_by = confirmed_by
    order.save(update_fields=['status', 'payment_status', 'paid_at', 'confirmed_by'])

    return JsonResponse({'ok': True, 'order_id': order.order_id, 'status': 'paid'})


@login_required(login_url='shop:login')
def cash_success(request):
    """Display success page for cash payment orders"""
    order_id = request.session.get('last_cash_order_id')
    
    if not order_id:
        messages.warning(request, 'No order found. Please contact support.')
        return redirect('shop:shop_list')
    
    try:
        order = Order.objects.get(id=order_id)
        # Verify user owns this order (if authenticated)
        if request.user.is_authenticated and order.user != request.user:
            messages.error(request, 'Unauthorized access.')
            return redirect('shop:shop_list')
    except Order.DoesNotExist:
        messages.error(request, 'Order not found.')
        return redirect('shop:shop_list')
    
    # Discord invite link
    discord_link = 'https://discord.gg/F72UEFjNHv'
    
    context = {
        'order': order,
        'discord_link': discord_link,
    }
    
    return render(request, 'shop/cash_success.html', context)



@login_required(login_url='shop:login')
def payment_success(request, order_id=None):
    """Payment success page with order details"""
    if order_id:
        order = get_object_or_404(Order, order_id=order_id, user=request.user)
    else:
        order = request.user.orders.first()
        if not order:
            messages.error(request, 'No order found.')
            return redirect('shop:dashboard')

    if order.status != 'paid' or order.payment_status not in ('completed', 'cash_completed'):
        messages.error(request, 'Payment has not been confirmed yet.')
        return redirect('shop:dashboard')

    return render(request, 'shop/payment_success.html', {'order': order})


def payment_cancel(request):
    """Payment cancelled page"""
    return render(request, 'shop/payment_cancel.html')


# ═══════════════════════════════════════════════════════════════════════════
# DASHBOARD & ORDER HISTORY
# ═══════════════════════════════════════════════════════════════════════════

@login_required(login_url='shop:login')
def dashboard_view(request):
    """User dashboard with purchase history"""
    user = request.user
    orders = user.orders.all()

    # Calculate totals
    total_spent = orders.filter(status='paid').aggregate(
        total=Sum('total_price')
    )['total'] or Decimal('0.00')

    total_orders = orders.count()

    context = {
        'user': user,
        'orders': orders,
        'total_orders': total_orders,
        'total_spent': total_spent,
    }
    return render(request, 'shop/dashboard.html', context)


@login_required(login_url='shop:login')
def order_detail_view(request, order_id):
    """View order details (only own orders)"""
    order = get_object_or_404(Order, order_id=order_id, user=request.user)
    return render(request, 'shop/order_detail.html', {'order': order})


def product_detail(request, slug):
    """Display product detail page by slug. Handle review submissions."""
    product = get_object_or_404(Product, slug=slug, is_active=True)


    # Reviews summary and likes
    reviews_qs = product.reviews.select_related('user').annotate(likes_count=Count('likes'))
    reviews_count = reviews_qs.count()
    avg_rating = reviews_qs.aggregate(avg=Avg('rating'))['avg'] or 0
    avg_rating_rounded = int(round(float(avg_rating))) if avg_rating else 0

    user_review = None
    liked_review_ids = set()
    if request.user.is_authenticated:
        user_review = reviews_qs.filter(user=request.user).first()
        liked_review_ids = set(ReviewLike.objects.filter(user=request.user, review__product=product).values_list('review_id', flat=True))

    # Determine if user can review: one review per product per user
    can_review = False
    eligible_order_items = []
    if request.user.is_authenticated:
        if not Review.objects.filter(user=request.user, product=product).exists():
            eligible_order_items = list(
                OrderItem.objects.filter(order__user=request.user, order__status='paid', product=product)
            )
            if eligible_order_items:
                can_review = True

    # Handle review POST
    if request.method == 'POST' and request.POST.get('action') == 'add_review':
        if not request.user.is_authenticated:
            messages.error(request, 'You must be logged in to post a review')
            return redirect('shop:login')

        try:
            rating = int(request.POST.get('rating', 0))
        except (ValueError, TypeError):
            rating = 0
        comment = request.POST.get('comment', '').strip()

        if rating < 1 or rating > 5:
            messages.error(request, 'Rating must be between 1 and 5')
            return redirect('shop:product_detail', slug=product.slug)

        # Prevent duplicate review per product
        if Review.objects.filter(user=request.user, product=product).exists():
            messages.error(request, 'You have already reviewed this product')
            return redirect('shop:product_detail', slug=product.slug)

        Review.objects.create(user=request.user, product=product, rating=rating, comment=comment)
        messages.success(request, 'Thank you for your review')
        return redirect('shop:product_detail', slug=product.slug)

    # Wishlist status
    in_wishlist = False
    if request.user.is_authenticated:
        in_wishlist = Wishlist.objects.filter(user=request.user, product=product).exists()

    # Rating breakdown counts (1-5)
    raw_counts = product.reviews.values('rating').annotate(count=Count('id'))
    counts = {i: 0 for i in range(1, 6)}
    for row in raw_counts:
        counts[row['rating']] = row['count']
    total_reviews = reviews_count
    distribution = []
    for r in range(5, 0, -1):
        c = counts.get(r, 0)
        pct = int((c / total_reviews) * 100) if total_reviews else 0
        distribution.append({'rating': r, 'count': c, 'percent': pct})

    context = {
        'product': product,
        'reviews': reviews_qs,
        'reviews_count': reviews_count,
        'avg_rating': avg_rating,
        'avg_rating_rounded': avg_rating_rounded,
        'user_review': user_review,
        'in_wishlist': in_wishlist,
        'liked_review_ids': liked_review_ids,
        'can_review': can_review,
        'eligible_order_items': eligible_order_items,
        'rating_distribution': distribution,
    }
    return render(request, 'shop/product_detail.html', context)


@login_required(login_url='shop:login')
def toggle_review_like(request, review_id):
    if request.method != 'POST':
        return HttpResponseBadRequest('POST required')
    review = get_object_or_404(Review, id=review_id)
    if review.user == request.user:
        return JsonResponse({'error': 'Cannot like your own review'}, status=400)

    liked = False
    existing = ReviewLike.objects.filter(user=request.user, review=review).first()
    if existing:
        existing.delete()
        liked = False
    else:
        ReviewLike.objects.create(user=request.user, review=review)
        liked = True

    likes_count = ReviewLike.objects.filter(review=review).count()
    # If AJAX request, return JSON for JS update
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return JsonResponse({'liked': liked, 'likes_count': likes_count})

    return redirect('shop:product_detail', slug=review.product.slug)


def wishlist_count(request):
    if not request.user.is_authenticated:
        return JsonResponse({'count': 0})
    count = request.user.wishlist.count()
    return JsonResponse({'count': count})


@login_required(login_url='shop:login')
@require_POST
def add_review(request, product_id):
    product = get_object_or_404(Product, id=product_id, is_active=True)
    # Validate fields
    try:
        rating = int(request.POST.get('rating', 0))
    except (ValueError, TypeError):
        rating = 0
    comment = request.POST.get('comment', '').strip()
    order_item_id = request.POST.get('order_item')

    if rating < 1 or rating > 5:
        messages.error(request, 'Rating must be between 1 and 5')
        return redirect('shop:product_detail', slug=product.slug)

    # Ensure order_item belongs to user and product and is paid
    if not order_item_id:
        messages.error(request, 'Invalid order selection')
        return redirect('shop:product_detail', slug=product.slug)

    try:
        oi = OrderItem.objects.get(id=int(order_item_id), product=product, order__user=request.user, order__status='paid')
    except OrderItem.DoesNotExist:
        messages.error(request, 'Order not found or not eligible for review')
        return redirect('shop:product_detail', slug=product.slug)

    # Prevent duplicate review per product
    if Review.objects.filter(user=request.user, product=product).exists():
        messages.error(request, 'You have already reviewed this product')
        return redirect('shop:product_detail', slug=product.slug)

    Review.objects.create(user=request.user, product=product, order_item=oi, rating=rating, comment=comment)
    messages.success(request, 'Thank you — your review was submitted')
    return redirect('shop:product_detail', slug=product.slug)


@login_required(login_url='shop:login')
def add_to_wishlist(request, product_id):
    product = get_object_or_404(Product, id=product_id, is_active=True)
    wishlist_item, created = Wishlist.objects.get_or_create(user=request.user, product=product)
    if created:
        messages.success(request, f'{product.name} added to your wishlist')
    else:
        messages.info(request, f'{product.name} is already in your wishlist')
    return redirect(request.GET.get('next', 'shop:product_detail'), slug=product.slug)


@login_required(login_url='shop:login')
def remove_from_wishlist(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    Wishlist.objects.filter(user=request.user, product=product).delete()
    messages.success(request, f'{product.name} removed from your wishlist')
    return redirect(request.GET.get('next', 'shop:wishlist'))


@login_required(login_url='shop:login')
def wishlist_view(request):
    items = request.user.wishlist.select_related('product')
    return render(request, 'shop/wishlist.html', {'items': items})


def download_pc(request):
    """Render Windows desktop download page with available releases."""
    from downloads.models import AppVersion

    versions_pc = []
    versions_qs = AppVersion.objects.filter(is_active=True).order_by('-release_date')
    for version in versions_qs:
        download_url = version.exe_file.url if version.exe_file else ''
        versions_pc.append(
            {
                'version': version.version_number,
                'title': version.name,
                'changelog': version.description or 'Release notes are being updated.',
                'published_at': timezone.make_aware(
                    datetime.combine(version.release_date, datetime.min.time())
                )
                if hasattr(version, 'release_date') else timezone.now(),
                'filesize': version.file_size or 'Unknown',
                'release_type': 'Latest' if version.is_latest else 'Release',
                'badge_color': 'bg-green-600 text-white' if version.is_latest else 'bg-gray-600 text-white',
                'checksum': '',
                'arch_urls': {
                    'x64': download_url,
                    'x86': '',
                },
                'download_url': download_url,
            }
        )

    context = {
        'versions_pc': versions_pc,
    }
    return render(request, 'shop/download_pc.html', context)


# ═══════════════════════════════════════════════════════════════════════════
# DISCORD OAUTH VIEWS
# ═══════════════════════════════════════════════════════════════════════════

def discord_login_redirect(request):
    """Redirect user to Discord OAuth authorization page."""
    from .oauth import DiscordOAuthBackend
    import secrets
    
    # Generate state token for CSRF protection
    state = secrets.token_urlsafe(32)
    request.session['oauth_state'] = state
    
    next_url = request.GET.get('next')
    if next_url:
        request.session['oauth_next'] = next_url
    auth_url = DiscordOAuthBackend.get_auth_url(state=state)
    return redirect(auth_url)


def discord_callback(request):
    """Handle Discord OAuth callback."""
    from .oauth import DiscordOAuthBackend
    
    # Verify state token
    state = request.GET.get('state')
    session_state = request.session.get('oauth_state')
    
    if not state or state != session_state:
        messages.error(request, 'Invalid OAuth state. Please try again.')
        return redirect('shop:login')
    
    # Get authorization code
    code = request.GET.get('code')
    error = request.GET.get('error')
    
    if error:
        messages.error(request, f'Discord OAuth error: {error}')
        return redirect('shop:login')
    
    if not code:
        messages.error(request, 'No authorization code received from Discord.')
        return redirect('shop:login')
    
    try:
        # Authenticate user with Discord
        user = DiscordOAuthBackend.authenticate(code)
        
        if user:
            login(request, user)
            messages.success(request, f'Welcome {user.username}! Logged in via Discord.')
            next_url = request.session.pop('oauth_next', None)
            if next_url:
                return redirect(next_url)
            return redirect('shop:dashboard')
        else:
            messages.error(request, 'Failed to authenticate with Discord. Please try again.')
            return redirect('shop:login')
    
    except Exception as e:
        messages.error(request, f'Authentication error: {str(e)}')
        return redirect('shop:login')
