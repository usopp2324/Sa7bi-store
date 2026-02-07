require('dotenv').config();

const fs = require('fs');
const path = require('path');
const express = require('express');
const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
    EmbedBuilder,
} = require('discord.js');

const { buildOpenTicketButton, createTicketChannel } = require('./utils/ticket');
const { registerPendingOrder } = require('./utils/pending');

const config = {
    token: process.env.DISCORD_TOKEN,
    guildId: process.env.GUILD_ID,
    supportRoleId: process.env.SUPPORT_ROLE_ID,
    ticketCategoryId: process.env.TICKET_CATEGORY_ID || null,
    apiSecret: process.env.BOT_API_SECRET,
    djangoApiBaseUrl: process.env.DJANGO_API_BASE_URL,
    port: Number(process.env.PORT || 3001),
};

if (!config.token || !config.guildId || !config.apiSecret || !config.djangoApiBaseUrl) {
    throw new Error('Missing required environment variables. Check .env.example');
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Channel],
});

global.__siteBotClient = client;
const trgPath = path.join(__dirname, '..', 'TRG.js');
try {
    const trgSource = fs.readFileSync(trgPath, 'utf8');
    if (trgSource.trimStart().startsWith('<!DOCTYPE html')) {
        console.error('TRG.js looks like HTML. Check your deployment; skipping require.');
    } else {
        require(trgPath);
    }
} catch (error) {
    console.error('Failed to load TRG.js:', error);
}

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'))
    .forEach((file) => {
        const command = require(path.join(commandsPath, file));
        if (command.name) {

            client.commands.set(command.name, command);
        }
    });

const eventsPath = path.join(__dirname, 'events');
fs.readdirSync(eventsPath)
    .filter((file) => file.endsWith('.js'))
    .forEach((file) => {
        const event = require(path.join(eventsPath, file));
        if (!event.name) {
            return;
        }
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, { client, config }));
        } else {
            client.on(event.name, (...args) => event.execute(...args, { client, config }));
        }
    });

const app = express();
app.use(express.json({ limit: '1mb' }));

app.post('/api/order/create', async(req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== config.apiSecret) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    const payload = req.body || {};
    const requiredFields = ['order_id', 'discord_id', 'website_username', 'items', 'total_price'];
    const missing = requiredFields.filter((field) => !payload[field]);
    if (missing.length) {
        return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
    }

    try {
        let dmUser = null;
        try {
            dmUser = await client.users.fetch(payload.discord_id);
            payload.discord_tag = dmUser.tag;
            payload.discord_username = dmUser.username;
        } catch (error) {
            console.warn('Unable to fetch Discord user for ticket payload:', error.message);
        }

        const channel = await createTicketChannel({
            client,
            guildId: config.guildId,
            supportRoleId: config.supportRoleId,
            categoryId: config.ticketCategoryId,
            order: payload,
        });

        try {
            const user = dmUser || await client.users.fetch(payload.discord_id);
            const row = buildOpenTicketButton(payload.order_id);
            const embeddm = new EmbedBuilder()
                .setColor(0x5865f2)
                .setTitle('New Order Ticket Created')
                .setDescription(`***Your order ticket is ready. Click below to open it anytime:***\n${channel.toString()}\n\n**If you have any questions, please contact support.**`)
                .setFooter({ text: 'Thank you for your order!' });

            await user.send({
                embeds: [embeddm],
            });
        } catch (error) {
            console.warn('Unable to DM user about ticket:', error.message);
        }

        return res.json({ ok: true, channel_id: channel.id });
    } catch (error) {
        console.error('Ticket creation failed:', error);
        return res.status(500).json({ error: error.message });
    }
});

app.post('/api/order/pending', async(req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== config.apiSecret) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    const payload = req.body || {};
    const requiredFields = ['order_id', 'discord_id', 'website_username', 'items', 'total_price'];
    const missing = requiredFields.filter((field) => !payload[field]);
    if (missing.length) {
        return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
    }

    registerPendingOrder(payload);
    return res.json({ ok: true });
});

app.post('/api/order/check-membership', async(req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== config.apiSecret) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    const payload = req.body || {};
    const discordId = payload.discord_id;
    if (!discordId) {
        return res.status(400).json({ error: 'Missing discord_id' });
    }

    try {
        const guild = await client.guilds.fetch(config.guildId);
        const member = await guild.members.fetch(discordId).catch(() => null);
        return res.json({ ok: true, is_member: Boolean(member) });
    } catch (error) {
        console.error('Membership check failed:', error);
        return res.status(500).json({ error: 'Membership check failed' });
    }
});

app.listen(config.port, () => {
    console.log(`Bot webhook listening on port ${config.port}`);
});

client.login(config.token);