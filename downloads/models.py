from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone


def exe_upload_to(instance, filename):
    # store under downloads/<version>/<filename>
    safe_name = instance.version_number.replace('.', '_')
    return f'downloads/{safe_name}/{filename}'


class AppVersion(models.Model):
    name = models.CharField(max_length=128, help_text='Display name, e.g. v2.0.0')
    version_number = models.CharField(max_length=64, unique=True)
    description = models.TextField(blank=True)
    exe_file = models.FileField(upload_to=exe_upload_to)
    file_size = models.CharField(max_length=64, blank=True, null=True)
    release_date = models.DateField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    is_latest = models.BooleanField(default=False, help_text='Mark this release as the latest published build')

    class Meta:
        ordering = ['-release_date']

    def __str__(self):
        return f'{self.name} ({self.version_number})'

    def clean(self):
        # enforce only one latest at a time
        if self.is_latest:
            qs = AppVersion.objects.filter(is_latest=True)
            if self.pk:
                qs = qs.exclude(pk=self.pk)
            if qs.exists():
                raise ValidationError('There is already another version marked as latest. Unset it first.')

    def save(self, *args, **kwargs):
        # If marked as latest, unset other latest flags
        if self.is_latest:
            AppVersion.objects.filter(is_latest=True).exclude(pk=getattr(self, 'pk', None)).update(is_latest=False)
        super().save(*args, **kwargs)
