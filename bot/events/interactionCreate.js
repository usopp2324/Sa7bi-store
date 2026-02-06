const { postToDjango } = require('../utils/api');
const { buildOpenTicketButton, createTicketChannel, findTicketChannel } = require('../utils/ticket');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, context) {
    const { client, config } = context;

    if (!interaction.isButton()) {
      return;
    }

    if (!interaction.customId.startsWith('open_order_ticket:')) {
      return;
    }

    const orderId = interaction.customId.split(':')[1];
    if (!orderId) {
      return interaction.reply({ content: 'Invalid order ticket request.', ephemeral: true });
    }

    try {
      const orderPayload = {
        order_id: orderId,
        discord_id: interaction.user.id,
        discord_tag: interaction.user.tag,
      };

      const guild = await client.guilds.fetch(config.guildId);
      const existingChannel = await findTicketChannel(guild, orderId);
      if (existingChannel) {
        return interaction.reply({ content: `Your ticket is ready: ${existingChannel.toString()}` });
      }

      const channel = await createTicketChannel({
        client,
        guildId: config.guildId,
        supportRoleId: config.supportRoleId,
        categoryId: config.ticketCategoryId,
        order: { ...orderPayload },
      });

      await postToDjango(
        '/api/discord/order/create/',
        {
          order_id: orderId,
          channel_id: channel.id,
          discord_id: interaction.user.id,
        },
        config.djangoApiBaseUrl,
        config.apiSecret
      );

      const row = buildOpenTicketButton(orderId);
      return interaction.reply({
        content: `Ticket created: ${channel.toString()}`,
        components: [row],
      });
    } catch (error) {
      return interaction.reply({ content: `Unable to create ticket: ${error.message}`, ephemeral: true });
    }
  },
};
