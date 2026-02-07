"""
URL configuration for myproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views
from shop import views as shop_views

urlpatterns = [
    path('', views.home, name='home'),
    path('about', views.about, name='about'),
    path('privacy', views.privacy, name='privacy'),
    path('terms', views.terms, name='terms'),
    path('contact', views.contact, name='contact'),
    path('contact_us.html', views.contact_us, name='contact_us'),
    path('api/contact/submit', views.submit_contact, name='submit_contact'),
    path('messages', views.messages_dashboard, name='messages_dashboard'),
    path('messages/<int:message_id>', views.message_detail, name='message_detail'),
    path('api/messages/<int:message_id>/read', views.mark_message_read, name='mark_message_read'),
    path('api/discord/order/create/', shop_views.discord_order_create, name='discord_order_create'),
    path('api/discord/order/paid/', shop_views.discord_order_paid, name='discord_order_paid'),
    path('api/discord/activation/create/', shop_views.discord_activation_create, name='discord_activation_create'),
    path('admin/', admin.site.urls),
    path('download/', include('downloads.urls')),
    path('shop/', include('shop.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
