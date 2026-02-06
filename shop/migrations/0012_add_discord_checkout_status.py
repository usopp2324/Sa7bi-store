from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0011_order_discord_ticket_channel_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('awaiting_discord', 'Awaiting Discord'), ('paid', 'Paid'), ('cancelled', 'Cancelled')], default='pending', max_length=20),
        ),
        migrations.AlterField(
            model_name='order',
            name='payment_method',
            field=models.CharField(choices=[('stripe', 'Stripe'), ('paypal', 'PayPal'), ('cash', 'Cash Payment'), ('discord', 'Discord')], default='stripe', max_length=20),
        ),
        migrations.AlterField(
            model_name='order',
            name='payment_status',
            field=models.CharField(choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed'), ('cash_pending', 'Cash - Awaiting Payment'), ('cash_completed', 'Cash - Paid'), ('awaiting_discord', 'Awaiting Discord')], default='pending', max_length=20),
        ),
    ]
