from django.contrib import admin
from django.utils.html import format_html
from .models import Product, Order, OrderItem
from .models import Wishlist, Review, ContactMessage, UserProfile


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('image_tag', 'name', 'price', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name', 'description')
    readonly_fields = ('image_preview',)
    fields = ('name', 'description', 'price', 'image', 'image_preview', 'is_active')

    def image_preview(self, obj):
        if not obj.image:
            return '(no image)'
        return format_html('<img src="{}" style="height: 100px; object-fit: cover;"/>', obj.image.url)

    image_preview.short_description = 'Image Preview'

    def image_tag(self, obj):
        if not obj.image:
            return ''
        return format_html('<img src="{}" style="height: 48px; width:48px; object-fit: cover; border-radius:6px;"/>', obj.image.url)

    image_tag.short_description = 'Image'


class OrderItemInline(admin.TabularInline):
    """Inline admin for order items"""
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'quantity', 'price', 'subtotal')
    fields = ('product', 'quantity', 'price', 'subtotal')
    can_delete = False

    def subtotal(self, obj):
        return f"${obj.subtotal}"
    subtotal.short_description = 'Subtotal'


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id_short', 'user', 'status_badge', 'total_price', 'item_count', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('order_id', 'user__username', 'user__email')
    readonly_fields = ('order_id', 'created_at', 'updated_at', 'user', 'total_price')
    fields = ('user', 'order_id', 'status', 'total_price', 'created_at', 'updated_at')
    inlines = [OrderItemInline]
    date_hierarchy = 'created_at'

    def order_id_short(self, obj):
        return obj.order_id[:12] + '...'
    order_id_short.short_description = 'Order ID'

    def status_badge(self, obj):
        colors = {
            'paid': '#22c55e',
            'pending': '#eab308',
            'cancelled': '#ef4444',
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;">{}</span>',
            colors.get(obj.status, '#gray'),
            obj.status.upper()
        )
    status_badge.short_description = 'Status'

    def item_count(self, obj):
        return obj.item_count
    item_count.short_description = 'Items'


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price', 'subtotal')
    list_filter = ('order__created_at', 'product')
    search_fields = ('order__order_id', 'product__name')
    readonly_fields = ('order', 'product', 'quantity', 'price')

    def subtotal(self, obj):
        return f"${obj.subtotal}"
    subtotal.short_description = 'Subtotal'


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'created_at')
    search_fields = ('user__username', 'product__name')
    list_filter = ('created_at',)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'user', 'rating', 'created_at')
    search_fields = ('product__name', 'user__username', 'comment')
    list_filter = ('rating', 'product')
    readonly_fields = ('created_at',)

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('id_short', 'name', 'subject_display', 'email', 'is_read_badge', 'created_at')
    list_filter = ('subject', 'is_read', 'created_at')
    search_fields = ('name', 'email', 'message', 'phone')
    readonly_fields = ('created_at', 'updated_at', 'email', 'name', 'phone', 'subject', 'message')
    fields = ('name', 'email', 'phone', 'subject', 'message', 'is_read', 'created_at', 'updated_at')
    date_hierarchy = 'created_at'
    actions = ['mark_as_read', 'mark_as_unread']

    def id_short(self, obj):
        return f"#{obj.id}"
    id_short.short_description = 'ID'

    def subject_display(self, obj):
        subject_labels = {
            'support': '🔧 Technical Support',
            'sales': '💼 Service Inquiry',
            'partnership': '🤝 Partnership',
            'complaint': '⚠️ Feedback/Complaint',
            'other': '📌 Other',
        }
        return subject_labels.get(obj.subject, obj.subject)
    subject_display.short_description = 'Subject'

    def is_read_badge(self, obj):
        if obj.is_read:
            return format_html(
                '<span style="background-color: #22c55e; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;">✓ READ</span>'
            )
        return format_html(
            '<span style="background-color: #ef4444; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;">NEW</span>'
        )
    is_read_badge.short_description = 'Status'

    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f'{updated} message(s) marked as read.')
    mark_as_read.short_description = 'Mark selected as read'

    def mark_as_unread(self, request, queryset):
        updated = queryset.update(is_read=False)
        self.message_user(request, f'{updated} message(s) marked as unread.')
    mark_as_unread.short_description = 'Mark selected as unread'


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'discord_username', 'discord_id_display', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'discord_username', 'discord_id')
    readonly_fields = ('created_at', 'updated_at', 'user')
    fields = ('user', 'discord_id', 'discord_username', 'discord_avatar_url', 'created_at', 'updated_at')
    
    def discord_id_display(self, obj):
        if obj.discord_id:
            return format_html(
                '<span style="background-color: #5865F2; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;">{}</span>',
                obj.discord_id
            )
        return '—'
    discord_id_display.short_description = 'Discord ID'