import logging

from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver

from .discord_integration import send_order_ticket
from .models import Order

logger = logging.getLogger(__name__)


def _should_send_ticket(order, created):
    if order.discord_ticket_channel_id:
        return False
    if order.status == 'paid':
        return True
    if order.payment_status in ('completed', 'cash_completed'):
        return True
    return False


@receiver(post_save, sender=Order)
def order_ticket_signal(sender, instance, created, **kwargs):
    if not _should_send_ticket(instance, created):
        return

    logger.info(
        'Order ticket signal fired for order %s (created=%s, status=%s, payment_status=%s)',
        instance.order_id,
        created,
        instance.status,
        instance.payment_status,
    )

    def _send():
        order = (
            Order.objects.select_related('user')
            .prefetch_related('items__product')
            .get(pk=instance.pk)
        )
        if order.discord_ticket_channel_id:
            return
        items = list(order.items.all())
        if not items:
            logger.info('Order %s has no items; skipping ticket', order.order_id)
            return
        channel_id = send_order_ticket(order, items)
        if channel_id:
            Order.objects.filter(pk=order.pk).update(
                discord_ticket_channel_id=channel_id,
            )
        else:
            logger.info('Ticket not created for order %s', order.order_id)

    transaction.on_commit(_send)
