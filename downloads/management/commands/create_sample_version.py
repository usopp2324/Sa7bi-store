from django.core.management.base import BaseCommand
from downloads.models import AppVersion
from django.utils import timezone
from datetime import timedelta


class Command(BaseCommand):
    help = 'Create a sample AppVersion for testing'

    def handle(self, *args, **options):
        # Check if any versions exist
        if AppVersion.objects.exists():
            self.stdout.write(self.style.WARNING('AppVersion records already exist. Skipping.'))
            return

        # Create a sample version
        version = AppVersion.objects.create(
            name='Sa7bi Desktop v1.0.0',
            version_number='1.0.0',
            description='Initial release of Sa7bi Desktop for Windows.\n\nFeatures:\n- Fast and responsive UI\n- Offline mode support\n- Secure data handling\n- Cross-platform compatibility',
            file_size='42.5 MB',
            release_date=timezone.now(),
            is_active=True,
            is_latest=True,
        )
        self.stdout.write(self.style.SUCCESS(f'Created sample version: {version}'))
        self.stdout.write('Go to /admin/downloads/appversion/ to upload an actual .exe file.')
