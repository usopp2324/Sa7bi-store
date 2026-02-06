from django.urls import path
from . import views

app_name = 'shop'

urlpatterns = [
    # Shop
    path('', views.shop_list, name='shop_list'),

    # Authentication
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    
    # Discord OAuth
    path('auth/discord/', views.discord_login_redirect, name='discord_login'),
    path('auth/discord/callback/', views.discord_callback, name='discord_callback'),

    # Cart
    path('cart/', views.cart_view, name='cart'),
    path('cart/add/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
    path('cart/remove/<int:product_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('cart/update/<int:product_id>/', views.update_cart, name='update_cart'),

    # Checkout
    path('checkout/', views.checkout_view, name='checkout'),
    path('order/placed/<str:order_id>/', views.order_placed_view, name='order_placed'),
    path('order/join-discord/<str:order_id>/', views.join_discord_view, name='join_discord'),
    path('order/join-discord/<str:order_id>/status/', views.join_discord_status_view, name='join_discord_status'),
    path('payment/success/<str:order_id>/', views.payment_success, name='payment_success'),
    path('payment/cancel/', views.payment_cancel, name='payment_cancel'),
    path('cash-success/', views.cash_success, name='cash_success'),

    # Dashboard & Orders
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('order/<str:order_id>/', views.order_detail_view, name='order_detail'),

    # Product detail
    path('product/<slug:slug>/', views.product_detail, name='product_detail'),
    
    # Wishlist
    path('wishlist/', views.wishlist_view, name='wishlist'),
    path('wishlist/add/<int:product_id>/', views.add_to_wishlist, name='add_to_wishlist'),
    path('wishlist/remove/<int:product_id>/', views.remove_from_wishlist, name='remove_from_wishlist'),
    path('wishlist/count/', views.wishlist_count, name='wishlist_count'),

    # Review likes
    path('review/<int:review_id>/like/', views.toggle_review_like, name='toggle_review_like'),
    path('review/add/<int:product_id>/', views.add_review, name='add_review'),
    # Desktop download page
    path('download-pc/', views.download_pc, name='download_pc'),
]
    