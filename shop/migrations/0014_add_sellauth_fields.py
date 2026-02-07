from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0013_add_paid_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='sellauth_product_id',
            field=models.PositiveBigIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='sellauth_variant_id',
            field=models.PositiveBigIntegerField(blank=True, null=True),
        ),
    ]
