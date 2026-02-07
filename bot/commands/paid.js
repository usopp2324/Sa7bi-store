const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { postToDjango } = require('../utils/api');
const { updateTicketStatus } = require('../utils/ticket');

const formatOrderId = (value) => (value || '').toString().toUpperCase();

module.exports = {
    name: 'pay',
    description: 'Mark an order as paid',
    async execute(message, args, context) {
        const { config, client } = context;
        const orderId = args[0];

        if (!orderId) {
            return message.reply('Usage: !pay <order_id>');
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

            let activationInfo = null;
            try {
                activationInfo = await postToDjango(
                    '/api/discord/activation/create/', { order_id: orderId },
                    config.djangoApiBaseUrl,
                    config.apiSecret
                );
            } catch (error) {
                await message.reply(`Order paid, but activation code generation failed: ${error.message}`);
            }

            const displayOrderId = formatOrderId(activationInfo.order_id || orderId);

            const guild = await client.guilds.fetch(config.guildId);
            const channel = await updateTicketStatus(guild, orderId, 'PAID');
            if (channel) {
                await channel.send(`Payment confirmed by ${message.author}. Order ${displayOrderId} marked as PAID.`);
            }

            if (activationInfo.code && activationInfo.discord_id) {
                try {
                    const user = await client.users.fetch(activationInfo.discord_id);
                    const embeddm = new EmbedBuilder()
                        .setColor(0x5865f2)
                        .setTitle('Payment Confirmed <a:verif:1468510562760790083>')
                        .setDescription(`**How to use:**\n<:number_one:1469745913391091876> Download the .exe from: https://sa7bi.shop/download/ \n <:number_two:1469745916360659123> Run it \n <:number_three:1469745918738829393> Enter your code \n enjoy  ***Thank you for your purchase! <a:11pm_giveaway1:1456038974656352478>*** \n \n Your activation code for order ${displayOrderId} \n  \`\`\`${activationInfo.code}\`\`\` `);

                    await user.send({ embeds: [embeddm] });
                } catch (error) {
                    await message.reply(`Order paid, but I could not DM the activation code: ${error.message}`);
                }
            }

            return message.reply(`Order ${displayOrderId} marked as PAID.`);
        } catch (error) {
            return message.reply(`Failed to confirm payment: ${error.message}`);
        }
    },
};