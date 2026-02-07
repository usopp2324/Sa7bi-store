const {
    ChannelType,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,

} = require('discord.js');

const TICKET_PREFIX = 'ticket-order-';

function buildOrderContainer(order) {
    const items = Array.isArray(order.items) ? order.items : [];

    const productLines = items.length ?
        items.map(item => `• ${item.name} ×${item.quantity} — $${item.price}`).join('\n') :
        'No items provided';

    const discordUser = order.discord_tag || order.discord_username || 'Unknown';

    const rawThumbnailUrl = items.find((item) => item && item.image_url) ? items.find((item) => item && item.image_url).image_url : null;
    const baseUrl = (process.env.DJANGO_API_BASE_URL || '').replace(/\/$/, '');
    const thumbnailUrl = rawThumbnailUrl && rawThumbnailUrl.startsWith('/') && baseUrl ?
        `${baseUrl}${rawThumbnailUrl}` :
        rawThumbnailUrl;

    const embed = new EmbedBuilder()
        .setTitle('<a:Shopelmaystro:1469316983358226535> New Order Ticket')
        .setDescription([
            `<:ID_Card:1469315397948805254>** Order ID:** \n \`\`\`${order.order_id || 'Unknown'}\`\`\``,
            `<:websiteWick:1469315394153222289>** Website User:** \n \`\`\`${order.website_username || 'Unknown'}\`\`\``,
            `<:user:1469315391921852528>** Discord User:** \n \`\`\`${discordUser || 'Unknown'}\`\`\``,
            ``,
            `** Product(s):**`,
            productLines,
            ``,
            `<a:Money:1469315193262837801>** Total Price:** $${order.total_price || '0.00'}`,
            `<:CASHAPP:1469315190666559590>** Payment Method:** Discord`,
            `<a:status_offline_animated2:1469314376875114557>** Status:** ${order.status || 'Pending'}`
        ].join('\n'))
        .setFooter({ text: 'Use !pay <order_id> to confirm payment' });

    if (thumbnailUrl) {
        embed.setThumbnail(thumbnailUrl);
    }

    return embed;
}

function buildOpenTicketButton(orderId) {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId(`open_order_ticket:${orderId}`)
        .setLabel('Open Ticket')
        .setStyle(ButtonStyle.Primary)
    );
}

async function findTicketChannel(guild, orderId) {
    if (!guild) {
        return null;
    }

    const name = `${TICKET_PREFIX}${orderId}`;
    const cached = guild.channels.cache.find((ch) => ch.name === name);
    if (cached) {
        return cached;
    }

    await guild.channels.fetch().catch(() => null);
    return guild.channels.cache.find((ch) => ch.name === name) || null;
}

async function createTicketChannel({ client, guildId, supportRoleId, categoryId, order }) {
    const guild = await client.guilds.fetch(guildId);
    const existing = await findTicketChannel(guild, order.order_id);
    if (existing) {
        return existing;
    }

    const channelName = `${TICKET_PREFIX}${order.order_id}`;
    const permissionOverwrites = [{
        id: guild.id,
        deny: [PermissionFlagsBits.ViewChannel],
    }, ];

    if (order.discord_id) {
        permissionOverwrites.push({
            id: order.discord_id,
            allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
            ],
        });
    }

    if (supportRoleId) {
        permissionOverwrites.push({
            id: supportRoleId,
            allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.ManageChannels,
            ],
        });
    }

    if (client.user.id) {
        permissionOverwrites.push({
            id: client.user.id,
            allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.ManageChannels,
            ],
        });
    }

    const channel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent: categoryId || undefined,
        topic: `Order ${order.order_id} • ${order.website_username || 'Unknown'}`,
        permissionOverwrites,
    });

    const embed = buildOrderContainer(order);
    try {
        const clientMention = order.discord_id ? `<@${order.discord_id}>` : 'Client';
        await channel.send({content: `<@&${"1455988549395415050"}>`});
        await channel.send({ content: `${clientMention}` });
        await channel.send({ embeds: [embed] });
    } catch (error) {
        await channel.send({
            content: `Order ${order.order_id} ticket created for <@${order.discord_id}>.`,
        });
    }

        return channel;
    }

    async function updateTicketStatus(guild, orderId, status) {
        const channel = await findTicketChannel(guild, orderId);
        if (!channel) {
            return null;
        }

        const baseTopic = (channel.topic || `Order ${orderId}`).replace(/\s+•\s+Status:\s+.*$/i, '').trim();
        const nextTopic = `${baseTopic} • Status: ${status}`;
        try {
            await channel.setTopic(nextTopic);
        } catch (error) {
            console.warn('Failed to update ticket topic:', error.message);
        }

        return channel;
    }

    module.exports = {
        buildOpenTicketButton,
        buildOrderContainer,
        createTicketChannel,
        findTicketChannel,
        updateTicketStatus,
    };
    awacon