from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.utils.text import slugify
import uuid
import secrets
import string
from django.conf import settings
from decimal import Decimal
from django.core.validators import MinValueValidator, MaxValueValidator


class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True, db_index=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/')
    is_active = models.BooleanField(default=True)
    sellauth_product_id = models.PositiveBigIntegerField(blank=True, null=True)
    sellauth_variant_id = models.PositiveBigIntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        """Auto-generate a unique slug from the product name if not provided."""
        if not self.slug:
            base_slug = slugify(self.name) or 'product'
            slug = base_slug
            # Ensure uniqueness
            while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{uuid.uuid4().hex[:6]}"
            self.slug = slug
        super().save(*args, **kwargs)


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.product.name} image"


def generate_order_id():
    alphabet = string.ascii_uppercase + string.digits
    parts = [''.join(secrets.choice(alphabet) for _ in range(5)) for _ in range(3)]
    candidate = f"SA7BI-ORDER-{parts[0]}-{parts[1]}-{parts[2]}"
    while Order.objects.filter(order_id=candidate).exists():
        parts = [''.join(secrets.choice(alphabet) for _ in range(5)) for _ in range(3)]
        candidate = f"SA7BI-{parts[0]}-{parts[1]}-{parts[2]}"
    return candidate


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('awaiting_discord', 'Awaiting Discord'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('stripe', 'Stripe'),
        ('paypal', 'PayPal'),
        ('cash', 'Cash Payment'),
        ('discord', 'Discord'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cash_pending', 'Cash - Awaiting Payment'),
        ('cash_completed', 'Cash - Paid'),
        ('awaiting_discord', 'Awaiting Discord'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    order_id = models.CharField(max_length=50, unique=True, default=generate_order_id)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        default='stripe'
    )
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default='pending'
    )
    discord_ticket_channel_id = models.CharField(max_length=120, blank=True, null=True)
    paid_at = models.DateTimeField(blank=True, null=True)
    confirmed_by = models.CharField(max_length=255, blank=True, null=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order {self.order_id} - {self.user.username}"

    @property
    def item_count(self):
        return self.items.aggregate(models.Sum('quantity'))['quantity__sum'] or 0


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price at purchase time

    def __str__(self):
        return f"{self.product.name} x{self.quantity} (Order {self.order.order_id})"

    @property
    def subtotal(self):
        if self.price is None or self.quantity is None:
            return Decimal('0.00')
        return self.price * self.quantity


class Wishlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wishlist')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='wishlisted_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} → {self.product.name}"


class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    order_item = models.ForeignKey('OrderItem', on_delete=models.CASCADE, related_name='review', null=True, blank=True)
    RATING_CHOICES = [(i, str(i)) for i in range(1, 6)]
    rating = models.IntegerField(choices=RATING_CHOICES, default=5)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.rating}★ for {self.product}"

    @property
    def short_comment(self):
        if not self.comment:
            return ''
        return (self.comment[:120] + '...') if len(self.comment) > 120 else self.comment


class ReviewLike(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='review_likes')
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'review')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} likes Review {self.review_id}"

class ContactMessage(models.Model):
    SUBJECT_CHOICES = [
        ('support', 'Technical Support'),
        ('sales', 'Service Inquiry'),
        ('partnership', 'Business Partnership'),
        ('complaint', 'Feedback or Complaint'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'

    def __str__(self):
        return f"{self.name} - {self.subject} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"


class UserProfile(models.Model):
    """Extended user profile to store OAuth and additional user information."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    discord_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    discord_username = models.CharField(max_length=255, null=True, blank=True)
    discord_avatar_url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"