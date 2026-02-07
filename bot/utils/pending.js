const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');
const { createTicketChannel, buildOpenTicketButton } = require('./ticket');
const { postToDjango } = require('./api');

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'discord_members.json');

function ensureStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ pending: [], members: [] }, null, 2), 'utf8');
  }
}

function readStore() {
  ensureStore();
  try {
    const raw = fs.readFileSync(dataFile, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      pending: Array.isArray(parsed.pending) ? parsed.pending : [],
      members: Array.isArray(parsed.members) ? parsed.members : [],
    };
  } catch (error) {
    return { pending: [], members: [] };
  }
}

function writeStore(state) {
  ensureStore();
  fs.writeFileSync(dataFile, JSON.stringify(state, null, 2), 'utf8');
}

function registerPendingOrder(order) {
  const state = readStore();
  const index = state.pending.findIndex((item) => item.order_id === order.order_id);
  if (index >= 0) {
    state.pending[index] = order;
  } else {
    state.pending.push(order);
  }
  writeStore(state);
}

function removePendingOrder(orderId) {
  const state = readStore();
  state.pending = state.pending.filter((item) => item.order_id !== orderId);
  writeStore(state);
}

function saveMemberJoin(member) {
  const state = readStore();
  const record = {
    discord_id: member.user.id,
    discord_tag: member.user.tag,
    joined_at: new Date().toISOString(),
  };
  const index = state.members.findIndex((item) => item.discord_id === record.discord_id);
  if (index >= 0) {
    state.members[index] = record;
  } else {
    state.members.push(record);
  }
  writeStore(state);
}

async function sendTicketDm(user, channel, orderId) {
  const row = buildOpenTicketButton(orderId);
  const embeddm = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle('New Order Ticket Created')
    .setDescription(`***Your order ticket is ready. Click below to open it anytime:***\n${channel.toString()}\n\n**If you have any questions, please contact support.**`)
    .setFooter({ text: 'Thank you for your order!' });

  await user.send({
    embeds: [embeddm],
    components: [row],
  });
}

async function finalizePendingOrder({ client, config, member, order }) {
  if (!order.discord_tag && member) {
    order.discord_tag = member.user.tag;
  }
  if (!order.discord_username && member) {
    order.discord_username = member.user.username;
  }

  const channel = await createTicketChannel({
    client,
    guildId: config.guildId,
    supportRoleId: config.supportRoleId,
    categoryId: config.ticketCategoryId,
    order,
  });

  try {
    await postToDjango(
      '/api/discord/order/create/',
      {
        order_id: order.order_id,
        channel_id: channel.id,
        discord_id: order.discord_id,
      },
      config.djangoApiBaseUrl,
      config.apiSecret
    );
  } catch (error) {
    console.warn('Unable to update Django with ticket channel:', error.message);
  }

  try {
    const user = member ? member.user : await client.users.fetch(order.discord_id);
    await sendTicketDm(user, channel, order.order_id);
  } catch (error) {
    console.warn('Unable to DM user about ticket:', error.message);
  }

  removePendingOrder(order.order_id);
}

async function processPendingOrders(client, config) {
  if (!client || !config?.guildId) {
    return;
  }
  const state = readStore();
  if (!state.pending.length) {
    return;
  }

  let guild = null;
  try {
    guild = await client.guilds.fetch(config.guildId);
  } catch (error) {
    return;
  }

  for (const order of state.pending) {
    if (!order?.discord_id) {
      continue;
    }
    const member = await guild.members.fetch(order.discord_id).catch(() => null);
    if (!member) {
      continue;
    }
    await finalizePendingOrder({ client, config, member, order });
  }
}

async function handleMemberJoin(member, client, config) {
  saveMemberJoin(member);
  const state = readStore();
  const pending = state.pending.filter((order) => order.discord_id === member.user.id);
  for (const order of pending) {
    await finalizePendingOrder({ client, config, member, order });
  }
}

function startPendingMonitor(client, config) {
  processPendingOrders(client, config).catch(() => null);
  setInterval(() => {
    processPendingOrders(client, config).catch(() => null);
  }, 5000);
}

module.exports = {
  registerPendingOrder,
  startPendingMonitor,
  handleMemberJoin,
};
