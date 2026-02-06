const { PermissionFlagsBits } = require('discord.js');
const { postToDjango } = require('../utils/api');
const { updateTicketStatus } = require('../utils/ticket');

module.exports = {
  name: 'pay',
  description: 'Mark an order as paid',
  async execute(message, args, context) {
    const { config, client } = context;
    const orderId = args[0];

    if (!orderId) {
      return message.reply('Usage: $pay <order_id>');
    }

    const isAdmin = message.member.permissions.has(PermissionFlagsBits.Administrator);
    const isSupport = config.supportRoleId && message.member.roles.cache.has(config.supportRoleId);
    if (!isAdmin && !isSupport) {
      return message.reply('You do not have permission to confirm payments.');
    }

    try {
      const payload = {
        order_id: orderId,
        confirmed_by: message.author.tag,
      };
      await postToDjango('/api/discord/order/paid/', payload, config.djangoApiBaseUrl, config.apiSecret);

      const guild = await client.guilds.fetch(config.guildId);
      const channel = await updateTicketStatus(guild, orderId, 'PAID');
      if (channel) {
        await channel.send(`Payment confirmed by ${message.author}. Order marked as PAID.`);
      }

      return message.reply(`Order ${orderId} marked as PAID.`);
    } catch (error) {
      return message.reply(`Failed to confirm payment: ${error.message}`);
    }
  },
};
