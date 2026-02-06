from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0012_add_discord_checkout_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='paid_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='confirmed_by',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
