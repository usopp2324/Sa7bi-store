from django.shortcuts import render
from django.utils.timesince import timesince
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
import json


def home(request):
    # Latest reviews for testimonials (limit 8). If your Review model has an 'approved' field, only show approved.
    from shop.models import Review
    qs = Review.objects.select_related('product', 'user').order_by('-created_at')
    if hasattr(Review, 'approved'):
        qs = qs.filter(approved=True)
    reviews = qs[:8]
    return render(request, 'sa7bisite.html', {'reviews': reviews})


def contact_us(request):
    """Render the Contact Us page (old orbital design)."""
    return render(request, 'contact_us.html')


def contact(request):
    """Render the modern Contact page."""
    return render(request, 'contact.html')


@require_http_methods(["POST"])
def submit_contact(request):
    """Handle contact form submission via AJAX."""
    try:
        data = json.loads(request.body)
        from shop.models import ContactMessage
        
        # Validate required fields
        required_fields = ['name', 'email', 'subject', 'message']
        if not all(data.get(field) for field in required_fields):
            return JsonResponse({'success': False, 'error': 'Missing required fields'}, status=400)
        
        # Create and save the contact message
        message = ContactMessage(
            name=data.get('name').strip(),
            email=data.get('email').strip(),
            phone=data.get('phone', '').strip(),
            subject=data.get('subject'),
            message=data.get('message').strip(),
        )
        message.full_clean()  # Validate
        message.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Thank you! Your message has been received. We\'ll get back to you soon.',
            'message_id': message.id
        })
    
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


@login_required
def messages_dashboard(request):
    """Dashboard to view all contact messages (admin only)."""
    from shop.models import ContactMessage
    
    # Check if user is staff
    if not request.user.is_staff:
        from django.http import HttpResponseForbidden
        return HttpResponseForbidden('You do not have permission to access this page.')
    
    # Get filter parameters
    filter_type = request.GET.get('filter', 'all')  # all, unread, read
    search_query = request.GET.get('search', '')
    
    # Base queryset
    messages = ContactMessage.objects.all()
    
    # Apply filters
    if filter_type == 'unread':
        messages = messages.filter(is_read=False)
    elif filter_type == 'read':
        messages = messages.filter(is_read=True)
    
    # Apply search
    if search_query:
        from django.db.models import Q
        messages = messages.filter(
            Q(name__icontains=search_query) |
            Q(email__icontains=search_query) |
            Q(message__icontains=search_query)
        )
    
    # Get statistics
    total_messages = ContactMessage.objects.count()
    unread_messages = ContactMessage.objects.filter(is_read=False).count()
    
    # Pagination
    from django.core.paginator import Paginator
    paginator = Paginator(messages.order_by('-created_at'), 10)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'messages': page_obj.object_list,
        'total_messages': total_messages,
        'unread_messages': unread_messages,
        'filter_type': filter_type,
        'search_query': search_query,
    }
    
    return render(request, 'messages_dashboard.html', context)


@login_required
def message_detail(request, message_id):
    """View a single message in detail."""
    from shop.models import ContactMessage
    
    # Check if user is staff
    if not request.user.is_staff:
        from django.http import HttpResponseForbidden
        return HttpResponseForbidden('You do not have permission to access this page.')
    
    message = ContactMessage.objects.get(id=message_id)
    
    # Mark as read
    if not message.is_read:
        message.is_read = True
        message.save()
    
    context = {
        'message': message,
    }
    
    return render(request, 'message_detail.html', context)


@login_required
@require_http_methods(["POST"])
def mark_message_read(request, message_id):
    """Mark a message as read via AJAX."""
    from shop.models import ContactMessage
    
    if not request.user.is_staff:
        return JsonResponse({'success': False, 'error': 'Permission denied'}, status=403)
    
    try:
        message = ContactMessage.objects.get(id=message_id)
        message.is_read = True
        message.save()
        return JsonResponse({'success': True})
    except ContactMessage.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Message not found'}, status=404)
