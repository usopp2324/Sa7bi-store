from django.shortcuts import render, get_object_or_404
from django.http import FileResponse, Http404, JsonResponse
from .models import AppVersion, ActivationCode
from django.conf import settings
import os
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt


def download_latest(request):
    version = AppVersion.objects.filter(is_active=True, is_latest=True).first()
    if not version:
        # fallback to latest active by date
        version = AppVersion.objects.filter(is_active=True).order_by('-release_date').first()
    if not version:
        # No releases yet - show friendly message
        return render(request, 'downloads/download.html', {'version': None, 'others': []})
    others = AppVersion.objects.filter(is_active=True).exclude(pk=version.pk)
    return render(request, 'downloads/download.html', {'version': version, 'others': others})


def download_version(request, version):
    # version may be version_number
    obj = get_object_or_404(AppVersion, version_number=version, is_active=True)
    others = AppVersion.objects.filter(is_active=True).exclude(pk=obj.pk)
    return render(request, 'downloads/download_version.html', {'version': obj, 'others': others})


def download_file(request, version):
    # Optionally require login — toggle by setting DOWNLOADS_REQUIRE_LOGIN in settings
    if getattr(settings, 'DOWNLOADS_REQUIRE_LOGIN', False):
        if not request.user.is_authenticated:
            raise Http404('Authentication required')

    obj = get_object_or_404(AppVersion, version_number=version, is_active=True)
    if not obj.exe_file:
        raise Http404('File not found')

    file_path = obj.exe_file.path
    if not os.path.exists(file_path):
        raise Http404('File not found on server')

    response = FileResponse(open(file_path, 'rb'), as_attachment=True, filename=os.path.basename(file_path))
    # Optional: set content type for exe
    response['Content-Type'] = 'application/vnd.microsoft.portable-executable'
    return response


@csrf_exempt
def verify_activation(request):
    if request.method == 'POST':
        code = request.POST.get('code')
        hardware_id = request.POST.get('hardware_id')

        if not code or not hardware_id:
            return JsonResponse({'status': 'error', 'message': 'Missing code or hardware ID'}, status=400)

        try:
            ac = ActivationCode.objects.get(code=code)
            if ac.used:
                if ac.duration and ac.created_at + ac.duration < timezone.now():
                    return JsonResponse({'status': 'error', 'message': 'Code expired'}, status=403)

                if ac.hardware_id == hardware_id:
                    return JsonResponse({'status': 'success'})
                return JsonResponse({'status': 'error', 'message': 'Code bound to another machine'}, status=403)

            ac.created_at = timezone.now()
            ac.hardware_id = hardware_id
            ac.used = True
            ac.save()
            return JsonResponse({'status': 'success'})
        except ActivationCode.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Invalid code'}, status=404)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)
