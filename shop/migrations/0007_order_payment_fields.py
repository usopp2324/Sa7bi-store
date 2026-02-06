# Generated migration for adding payment_method and payment_status fields

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0006_alter_review_unique_together_review_order_item_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='payment_method',
            field=models.CharField(
                choices=[('stripe', 'Stripe'), ('paypal', 'PayPal'), ('cash', 'Cash Payment')],
                default='stripe',
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name='order',
            name='payment_status',
            field=models.CharField(
                choices=[
                    ('pending', 'Pending'),
                    ('completed', 'Completed'),
                    ('failed', 'Failed'),
                    ('cash_pending', 'Cash - Awaiting Payment'),
                    ('cash_completed', 'Cash - Paid'),
                ],
                default='pending',
                max_length=20,
            ),
        ),
    ]
