from django.contrib import admin
from .models import AppVersion
from django.forms import ModelForm
from django.core.exceptions import ValidationError


class AppVersionForm(ModelForm):
    class Meta:
        model = AppVersion
        fields = '__all__'

    def clean(self):
        cleaned = super().clean()
        is_latest = cleaned.get('is_latest')
        if is_latest:
            qs = AppVersion.objects.filter(is_latest=True)
            if self.instance.pk:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise ValidationError('Another version is already marked as latest. Unset it first or update that record.')
        return cleaned


@admin.register(AppVersion)
class AppVersionAdmin(admin.ModelAdmin):
    form = AppVersionForm
    list_display = ('version_number', 'release_date', 'is_active', 'is_latest')
    list_filter = ('is_active', 'is_latest')
    search_fields = ('version_number', 'name')
    readonly_fields = ('file_size',)

    def save_model(self, request, obj, form, change):
        # If this is marked latest, clear others (enforce uniqueness)
        if obj.is_latest:
            AppVersion.objects.filter(is_latest=True).exclude(pk=getattr(obj, 'pk', None)).update(is_latest=False)
        super().save_model(request, obj, form, change)
