const { fail } = require('assert');
const { channel } = require('diagnostics_channel');
const Discord = require('discord.js');
const {
    Client,
   
    ModalBuilder: DiscordModalBuilder,
    TextInputBuilder: DiscordTextInputBuilder,
    TextInputStyle: DiscordTextInputStyle,
    ComponentType: DiscordComponentType,
    ButtonStyle: DiscordButtonStyle,
} = Discord;
const GatewayIntentBits = Discord.GatewayIntentBits || (Discord.Intents && Discord.Intents.FLAGS) || {};
const PermissionFlagsBits = Discord.PermissionFlagsBits || (Discord.Permissions && Discord.Permissions.FLAGS) || {};
const EmbedBuilder = Discord.EmbedBuilder || Discord.MessageEmbed;
const ActionRowBuilder = Discord.ActionRowBuilder || Discord.MessageActionRow;
const StringSelectMenuBuilder = Discord.StringSelectMenuBuilder || Discord.MessageSelectMenu;
const ButtonBuilder = Discord.ButtonBuilder || Discord.MessageButton;
const ModalBuilder = DiscordModalBuilder || Discord.Modal;
const TextInputBuilder = DiscordTextInputBuilder || Discord.TextInputComponent;
const TextInputStyle = DiscordTextInputStyle || { Short: 'SHORT', Paragraph: 'PARAGRAPH' };
const ComponentType = DiscordComponentType || { Button: 'BUTTON', StringSelect: 'SELECT_MENU' };
const ButtonStyle = DiscordButtonStyle || {
    Primary: 'PRIMARY',
    Secondary: 'SECONDARY',
    Success: 'SUCCESS',
    Danger: 'DANGER',
};
const ChannelType = Discord.ChannelType || {
    GuildCategory: 'GUILD_CATEGORY',
    GuildText: 'GUILD_TEXT',
    GuildVoice: 'GUILD_VOICE',
};
const { NONAME } = require('dns');
const { userInfo } = require('os');
const fs = require('fs').promises;
const countries = require('./bot/trg/data/countries');
const brands = require('./bot/trg/data/brands');
const commandCategories = require('./bot/trg/commandCategories');
const embedConfig = require('./bot/trg/embedConfig');

            const sharedClient = global.__siteBotClient;
            const client = sharedClient || new Client({
                intents: [
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.GuildMembers,
                    GatewayIntentBits.GuildMessages,
                    GatewayIntentBits.MessageContent,
                    GatewayIntentBits.GuildModeration,
                    GatewayIntentBits.GuildVoiceStates,
                    GatewayIntentBits.GuildInvites
                ]
            });
            const shouldLogin = !sharedClient;
            const TOKEN = process.env.DISCORD_TOKEN;
            const AUTO_ROLE_ID = process.env.AUTO_ROLE_ID || '1455988550498517072';
            const JAIL_ROLE_ID = '1455591198365319268';
            const HELP_CHANNEL_ID = '1455591360576098375';
            const HELP_ROLE_ID = '1455572137912832111';
            const WELCOME_CHANNEL_ID = '1455988693339734036';
            const textPrefix = '$';
            const CLAN_MANAGER_ROLE_ID = '1455591504516223098'; 
            const CLAN_CATEGORY_ID = '1455591601781997569';
            const CLAN_LEADER_ROLE_ID = '1455591653921390835'; 
            const CLAN_COLEADER_ROLE_ID = '1455591695591932048'; 
            const VERIFICATION_ROLE_ID = '1455988550498517072'; 
            const CLAN_ADMIN_ROLE_ID = '1455572137912832111';
            const VERIFICATION_ADMIN_ROLE_ID = '1455592190200774777'; 
            const SECOND_VERIFICATION_ROLE_ID = '1455988551471730730';      
            const ALLOWED_USER_ID = '984435138307964999';
            const ROLE_TO_REMOVE_ID = '1390456331386884226'; 
            const CLAN_VOICE_CATEGORY_ID = '1455988690936402160'; 
            const CLAN_TEXT_CATEGORY_ID = '1455988690936402160'; 
            const LIVE_CHANNEL_ID = '1404228737003683881'; 
            let invitesBefore = new Map(); 
            const VERIFICATIONS_FILE = './verifications.json';
            const BASIC_ACCESS_ROLE_ID = '1455988550498517072'; 
            const STAFF_ROLE_ID = '1455988549395415050'; 
            let verifications = new Map();
            const TICKET_CHANNEL_ID = '1455988697492099133'; 
            const TICKET_ADMIN_ROLE_ID = '1455988549395415050'; 
            const TICKETS_FILE = './tickets.json';
            const TICKET_CLAIMS_FILE = './ticketClaims.json';
            const WARNINGS_FILE = './warnings.json';
            const JAILED_USERS_FILE = './jailedUsers.json';
            const MARRIAGES_FILE = './marriages.json';
            const CHILDREN_FILE = './children.json';
            const JAIL_LOGS_FILE = './jailLogs.json';
            const CLAN_VOICE_TIMES_FILE = './clanVoiceTimes.json';
            const OM_USERS_FILE = './omUsers.json';
            const MUTED_CHANNELS_FILE = './mutedChannels.json';
            const VALO_ACCOUNTS_FILE = './valo_accounts.json';
            const VALO_CLAIMED_FILE = './valo_claimed.json';
            let tickets = new Map(); 
            let ticketClaims = new Map(); 
            const TICKET_CATEGORY_ID = '1407780412691841154'; /*  */
            const successEmbed = (title, description) => new EmbedBuilder()
                .setColor('#00fffb')
                .setDescription(`> ${description} <a:Black_Animated_Verified:1392701240873455696>`)
            const errorEmbed = (title, description) => new EmbedBuilder()
                        .setColor('#FF0000')
                        .setDescription(`${description} <a:red_deku:1391537079795712092>`)




            let warnings = new Map();
            let jailedUsers = new Map();
            let marriages = new Map();
            let children = new Map();
        // Load tickets from file
async function loadTickets() {
    try {
        const data = await fs.readFile(TICKETS_FILE, 'utf8');
        if (!data.trim()) {
            console.log('Tickets file is empty, starting with empty tickets');
            tickets = new Map();
            return;
        }
        tickets = new Map(Object.entries(JSON.parse(data)).map(([key, value]) => [
            key,
            {
                ownerId: value.ownerId,
                reason: value.reason,
                createdAt: value.createdAt,
                claimedBy: value.claimedBy || null,
            }
        ]));
        console.log('Tickets loaded successfully');
    } catch (error) {
        if (error.code === 'ENOENT' || error instanceof SyntaxError) {
            console.log('No valid tickets file found, starting with empty tickets');
            tickets = new Map();
        } else {
            console.error('Error loading tickets:', error);
        }
    }
}

async function saveTickets() {
    try {
        const ticketsObject = Object.fromEntries(tickets);
        await fs.writeFile(TICKETS_FILE, JSON.stringify(ticketsObject, null, 2));
        console.log('Tickets saved successfully');
    } catch (error) {
        console.error('Error saving tickets:', error);
    }
}

async function loadTicketClaims() {
    try {
        const data = await fs.readFile(TICKET_CLAIMS_FILE, 'utf8');
        if (!data.trim()) { 
            console.log('Ticket claims file is empty, starting with empty ticket claims');
            ticketClaims = new Map();
            return;
        }
        ticketClaims = new Map(Object.entries(JSON.parse(data)));
        console.log('Ticket claims loaded successfully');
    } catch (error) {
        if (error.code === 'ENOENT' || error instanceof SyntaxError) {
            console.log('No valid ticket claims file found, starting with empty ticket claims');
            ticketClaims = new Map();
        } else {
            console.error('Error loading ticket claims:', error);
        }
    }
}
async function ensureTicketCategory(guild) {
    let category = guild.channels.cache.find(
        (channel) => channel.type === ChannelType.GuildCategory && channel.name.toLowerCase().includes('tickets')
    );
    if (!category) {
        category = await guild.channels.create({
            name: 'Tickets',
            type: ChannelType.GuildCategory,
            permissionOverwrites: [
    { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
    { id: TICKET_ADMIN_ROLE_ID, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ManageChannels] },
],
        });
    }
    return category.id;
}

const ORDER_TICKET_PREFIX = 'ticket-order-';

function isOrderTicketChannel(channel) {
    return Boolean(channel?.name && channel.name.startsWith(ORDER_TICKET_PREFIX));
}

function getOrderTicketOwnerId(channel) {
    if (!channel?.permissionOverwrites?.cache) {
        return null;
    }

    const overwrites = channel.permissionOverwrites.cache;
    const ownerOverwrite = overwrites.find((overwrite) => {
        if (overwrite.id === channel.guild.id || overwrite.id === channel.client.user?.id) {
            return false;
        }
        return !channel.guild.roles.cache.has(overwrite.id);
    });

    return ownerOverwrite?.id || null;
}

function getOrCreateTicketData(channel) {
    if (tickets.has(channel.id)) {
        return { data: tickets.get(channel.id), isOrderTicket: false };
    }

    if (!isOrderTicketChannel(channel)) {
        return null;
    }

    const ownerId = getOrderTicketOwnerId(channel);
    const ticketData = {
        ownerId,
        reason: 'Order ticket',
        createdAt: Date.now(),
        claimedBy: null,
        isOrderTicket: true,
    };

    tickets.set(channel.id, ticketData);
    return { data: ticketData, isOrderTicket: true };
}


async function loadValoAccounts() {
    try {
        const data = await fs.readFile(VALO_ACCOUNTS_FILE, 'utf8');
        if (!data.trim()) {
            console.log('Valorant accounts file is empty');
            valoAccounts = [];
            return;
        }
        valoAccounts = JSON.parse(data);
        console.log(`Loaded ${valoAccounts.length} Valorant accounts`);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('No valo_accounts.json found, starting empty');
            valoAccounts = [];
        } else {
            console.error('Error loading Valorant accounts:', error);
        }
    }
}

async function saveValoAccounts() {
    try {
        await fs.writeFile(VALO_ACCOUNTS_FILE, JSON.stringify(valoAccounts, null, 2));
        console.log('Valorant accounts saved');
    } catch (error) {
        console.error('Error saving Valorant accounts:', error);
    }
}

async function loadValoClaimed() {
    try {
        const data = await fs.readFile(VALO_CLAIMED_FILE, 'utf8');
        if (!data.trim()) {
            valoClaimed = new Set();
            return;
        }
        valoClaimed = new Set(JSON.parse(data));
        console.log(`Loaded ${valoClaimed.size} claimed Valorant accounts`);
    } catch (error) {
        if (error.code === 'ENOENT') {
            valoClaimed = new Set();
        } else {
            console.error('Error loading claimed Valorant:', error);
        }
    }
}

async function saveValoClaimed() {
    try {
        await fs.writeFile(VALO_CLAIMED_FILE, JSON.stringify(Array.from(valoClaimed), null, 2));
        console.log('Valorant claimed saved');
    } catch (error) {
        console.error('Error saving claimed Valorant:', error);
    }
}
async function saveTicketClaims() {
    try {
        const ticketClaimsObject = Object.fromEntries(ticketClaims);
        await fs.writeFile(TICKET_CLAIMS_FILE, JSON.stringify(ticketClaimsObject, null, 2));
        console.log('Ticket claims saved successfully');
    } catch (error) {
        console.error('Error saving ticket claims:', error);
    }
}
            // Load jail logs from file
            async function loadJailLogs() {
                try {
                    const data = await fs.readFile(JAIL_LOGS_FILE, 'utf8');
                    if (!data.trim()) {
                        console.log('Jail logs file is empty, starting with empty jail logs');
                        jailLogs = new Map();
                        return;
                    }
                    jailLogs = new Map(Object.entries(JSON.parse(data)));
                    console.log('Jail logs loaded successfully');
                } catch (error) {
                    if (error.code === 'ENOENT' || error instanceof SyntaxError) {
                        console.log('No valid jail logs file found, starting with empty jail logs');
                        jailLogs = new Map();
                    } else {
                        console.error('Error loading jail logs:', error);
                    }
                }
            }
           async function saveUserHours() {
    try {
        const userHoursObject = Object.fromEntries(
            Array.from(userHours.entries()).map(([key, value]) => [
                key,
                {
                    hours: Number(value.hours) || 0,
                    joinTime: value.joinTime || null
                }
            ])
        );
        await fs.writeFile('userHours.json', JSON.stringify(userHoursObject, null, 2));
        console.log('User hours saved successfully');
    } catch (error) {
        console.error('Error saving user hours:', error);
    }
}
   async function loadUserHours() {
    try {
        const data = await fs.readFile('userHours.json', 'utf8');
        if (!data.trim()) {
            console.log('User hours file is empty, starting with empty userHours');
            userHours = new Map();
            return;
        }
        const parsedData = JSON.parse(data);
        userHours = new Map(
            Object.entries(parsedData).map(([key, value]) => [
                key,
                {
                    hours: Number(value.hours) || 0,
                    joinTime: value.joinTime ? Number(value.joinTime) : null
                }
            ])
        );
        console.log('User hours loaded successfully');
    } catch (error) {
        if (error.code === 'ENOENT' || error instanceof SyntaxError) {
            console.log('No valid user hours file found, starting with empty userHours');
            userHours = new Map();
        } else {
            console.error('Error loading user hours:', error);
        }
    }
}
    async function loadMutedChannels() {
    try {
        const data = await fs.readFile(MUTED_CHANNELS_FILE, 'utf8');
        if (!data.trim()) {
            console.log('Muted channels file is empty, starting with empty muted channels');
            mutedChannels = new Map();
            return;
        }
        mutedChannels = new Map(Object.entries(JSON.parse(data)));
        console.log('Muted channels loaded successfully');
    } catch (error) {
        if (error.code === 'ENOENT' || error instanceof SyntaxError) {
            console.log('No valid muted channels file found, starting with empty muted channels');
            mutedChannels = new Map();
        } else {
            console.error('Error loading muted channels:', error);
        }
    }
}
async function loadVerifications() {
    try {
        const data = await fs.readFile(VERIFICATIONS_FILE, 'utf8');
        if (!data.trim()) {
            console.log('Verifications file is empty, starting with empty verifications');
            verifications = new Map();
            return;
        }
        verifications = new Map(Object.entries(JSON.parse(data)));
        console.log('Verifications loaded successfully');
    } catch (error) {
        if (error.code === 'ENOENT' || error instanceof SyntaxError) {
            console.log('No valid verifications file found, starting with empty verifications');
            verifications = new Map();
        } else {
            console.error('Error loading verifications:', error);
        }
    }
}
async function saveVerifications() {
    try {
        const verificationsObject = Object.fromEntries(verifications);
        await fs.writeFile(VERIFICATIONS_FILE, JSON.stringify(verificationsObject, null, 2));
        console.log('Verifications saved successfully');
    } catch (error) {
        console.error('Error saving verifications:', error);
    }
}

async function saveMutedChannels() {
    try {
        const mutedChannelsObject = Object.fromEntries(mutedChannels);
        await fs.writeFile(MUTED_CHANNELS_FILE, JSON.stringify(mutedChannelsObject, null, 2));
        console.log('Muted channels saved successfully');
    } catch (error) {
        console.error('Error saving muted channels:', error);
    }
}

            // Save jail logs to file
            async function saveJailLogs() {
                try {
                    const jailLogsObject = Object.fromEntries(jailLogs);
                    await fs.writeFile(JAIL_LOGS_FILE, JSON.stringify(jailLogsObject, null, 2));
                    console.log('Jail logs saved successfully');
                } catch (error) {
                    console.error('Error saving jail logs:', error);
                }
            }

              


                
          

                // Load marriages from file
            async function loadMarriages() {
                try {
                    const data = await fs.readFile(MARRIAGES_FILE, 'utf8');
                    if (!data.trim()) {
                        console.log('Marriages file is empty, starting with empty marriages');
                        marriages = new Map();
                        return;
                    }
                    marriages = new Map(Object.entries(JSON.parse(data)));
                    console.log('Marriages loaded successfully');
                } catch (error) {
                    if (error.code === 'ENOENT' || error instanceof SyntaxError) {
                        console.log('No valid marriages file found, starting with empty marriages');
                        marriages = new Map();
                    } else {
                        console.error('Error loading marriages:', error);
                    }
                }
            }

            // Save marriages to file
            async function saveMarriages() {
                try {
                    const marriagesObject = Object.fromEntries(marriages);
                    await fs.writeFile(MARRIAGES_FILE, JSON.stringify(marriagesObject, null, 2));
                    console.log('Marriages saved successfully');
                } catch (error) {
                    console.error('Error saving marriages:', error);
                }
            }

            // Load children from file
            async function loadChildren() {
                try {
                    const data = await fs.readFile(CHILDREN_FILE, 'utf8');
                    if (!data.trim()) {
                        console.log('Children file is empty, starting with empty children');
                        children = new Map();
                        return;
                    }
                    children = new Map(Object.entries(JSON.parse(data)));
                    console.log('Children loaded successfully');
                } catch (error) {
                    if (error.code === 'ENOENT' || error instanceof SyntaxError) {
                        console.log('No valid children file found, starting with empty children');
                        children = new Map();
                    } else {
                        console.error('Error loading children:', error);
                    }
                }
            }

            // Save children to file
            async function saveChildren() {
                try {
                    const childrenObject = Object.fromEntries(children);
                    await fs.writeFile(CHILDREN_FILE, JSON.stringify(childrenObject, null, 2));
                    console.log('Children saved successfully');
                } catch (error) {
                    console.error('Error saving children:', error);
                }
            }
            // Load warnings from file
            async function loadWarnings() {
                try {
                    const data = await fs.readFile(WARNINGS_FILE, 'utf8');
                    if (!data.trim()) {
                        console.log('Warnings file is empty, starting with empty warnings');
                        warnings = new Map();
                        return;
                    }
                    warnings = new Map(Object.entries(JSON.parse(data)));
                    console.log('Warnings loaded successfully');
                } catch (error) {
                    if (error.code === 'ENOENT' || error instanceof SyntaxError) {
                        console.log('No valid warnings file found, starting with empty warnings');
                        warnings = new Map();
                    } else {
                        console.error('Error loading warnings:', error);
                    }
                }
            }

            // Save warnings to file
            async function saveWarnings() {
                try {
                    const warningsObject = Object.fromEntries(warnings);
                    await fs.writeFile(WARNINGS_FILE, JSON.stringify(warningsObject, null, 2));
                    console.log('Warnings saved successfully');
                } catch (error) {
                    console.error('Error saving warnings:', error);
                }
            }

            // Load jailed users from file
            async function loadJailedUsers() {
                try {
                    const data = await fs.readFile(JAILED_USERS_FILE, 'utf8');
                    if (!data.trim()) {
                        console.log('Jailed users file is empty, starting with empty jailed users');
                        jailedUsers = new Map();
                        return;
                    }
                    jailedUsers = new Map(Object.entries(JSON.parse(data)));
                    console.log('Jailed users loaded successfully');
                } catch (error) {
                    if (error.code === 'ENOENT' || error instanceof SyntaxError) {
                        console.log('No valid jailed users file found, starting with empty jailed users');
                        jailedUsers = new Map();
                    } else {
                        console.error('Error loading jailed users:', error);
                    }
                }
            }

            // Save jailed users to file
            async function saveJailedUsers() {
                try {
                    const jailedUsersObject = Object.fromEntries(jailedUsers);
                    await fs.writeFile(JAILED_USERS_FILE, JSON.stringify(jailedUsersObject, null, 2));
                    console.log('Jailed users saved successfully');
                } catch (error) {
                    console.error('Error saving jailed users:', error);
                }
            }

        async function loadClans() {
        try {
            const data = await fs.readFile('clans.json', 'utf8');
            const clansData = JSON.parse(data);
            clans = new Map(Object.entries(clansData).map(([key, value]) => [
                key,
                {
                    name: value.name,
                    leaderId: value.leaderId,
                    coLeaders: value.coLeaders || [],
                    members: value.members || [],
                    roleId: value.roleId,
                    vcId: value.vcId,
                    textChannelId: value.textChannelId
                }
            ]));
            console.log('Clans loaded successfully.');
        } catch (error) {
            console.warn('No clans file found or error loading, starting with empty map.');
            clans = new Map();
        }
    }   
        async function loadOmUsers() {
            try {
                const data = await fs.readFile(OM_USERS_FILE, 'utf8');
                if (!data.trim()) {
                    console.log('OmUsers file is empty, starting with empty omUsers');
                    omUsers = new Map();
                    return;
                }
                omUsers = new Map(Object.entries(JSON.parse(data)));
                console.log('OmUsers loaded successfully');
            } catch (error) {
                if (error.code === 'ENOENT' || error instanceof SyntaxError) {
                    console.log('No valid omUsers file found, starting with empty omUsers');
                    omUsers = new Map();
                } else {
                    console.error('Error loading omUsers:', error);
                }
            }
        }

        async function saveOmUsers() {
            try {
                const omUsersObject = Object.fromEntries(omUsers);
                await fs.writeFile(OM_USERS_FILE, JSON.stringify(omUsersObject, null, 2));
                console.log('OmUsers saved successfully');
            } catch (error) {
                console.error('Error saving omUsers:', error);
            }
        }

    async function saveClans() {
        try {
            const clansData = {};
            for (const [key, clan] of clans) {
                clansData[key] = {
                    name: clan.name,
                    leaderId: clan.leaderId,
                    coLeaders: clan.coLeaders,
                    members: clan.members,
                    roleId: clan.roleId,
                    vcId: clan.vcId,
                    textChannelId: clan.textChannelId
                };
            }
            await fs.writeFile('clans.json', JSON.stringify(clansData, null, 2));
            console.log('Clans saved successfully.');
        } catch (error) {
            console.error('Error saving clans:', error);
        }
    }

      async function loadClanVoiceTimes() {
    try {
        const data = await fs.readFile(CLAN_VOICE_TIMES_FILE, 'utf8');
        if (!data.trim()) {
            console.log('Clan voice times file is empty, starting with empty times');
            clanVoiceTimes = new Map();
            return;
        }
        const parsedData = JSON.parse(data);
        clanVoiceTimes = new Map(
            Object.entries(parsedData).map(([key, value]) => [
                key,
                {
                    hours: Number(value.hours) || 0,
                    joinTime: value.joinTime ? Number(value.joinTime) : null
                }
            ])
        );
        console.log('Clan voice times loaded successfully');
    } catch (error) {
        if (error.code === 'ENOENT' || error instanceof SyntaxError) {
            console.log('No valid clan voice times file found, starting with empty clanVoiceTimes');
            clanVoiceTimes = new Map();
        } else {
            console.error('Error loading clan voice times:', error);
        }
    }
}
     async function saveClanVoiceTimes() {
    try {
        const clanVoiceTimesObject = Object.fromEntries(
            Array.from(clanVoiceTimes.entries()).map(([key, value]) => [
                key,
                {
                    hours: Number(value.hours) || 0,
                    joinTime: value.joinTime || null
                }
            ])
        );
        await fs.writeFile(CLAN_VOICE_TIMES_FILE, JSON.stringify(clanVoiceTimesObject, null, 2));
        console.log('Clan voice times saved successfully');
    } catch (error) {
        console.error('Error saving clan voice times:', error);
    }
}
            // Helper function to get member by ID or mention
            function getMemberFromArgs(message, args) {
                let target = message.mentions.members.first();
                if (!target && args.length > 0) {
                    const userId = args[0].replace(/[<@!>]/g, '');
                    target = message.guild.members.cache.get(userId);
                }
                return target;
            }

            // Create help embed with category selection
            function createHelpEmbed(user) {
                const embed = new EmbedBuilder()
                    .setColor('#030303')
                    .setTitle('Helper Command Center <:8121moderatorcerified:1455947857700851907>')
                    .setDescription(`**Hello there! I'm Sa7bK, your fun and friendly Discord bot. <:bots1:1455942769414639763> \n I'm here to bring joy, games, and great vibes to your community. <:support:1455952918162178231>\n \n \`Type $help\` to see all my commands. Enjoy! <:cmd1:1455953038585102437>**`)
                    .setThumbnail("https://media.discordapp.net/attachments/1070521912981205023/1407810083936796742/d7d5649719cd3ba361b14f8a16eeb609.webp?ex=68a774cf&is=68a6234f&hm=e330b53a014bb3e4188a9d251942e7127c9868c21a2200d8b1a12c801bff5aa5&=&format=webp")
                    .setImage('https://media.discordapp.net/attachments/1045375385027756062/1407799526248681674/download_5.gif?ex=68a76afa&is=68a6197a&hm=384bd0ccb3d1bd0a7238b46865355d9b25f746f432264dc5d7b3c72ff7b0c10c&=')
                
                return embed;
            }

     function createCategorySelectMenu(member) {

    const staffRole = member.guild.roles.cache.get(STAFF_ROLE_ID);
    if (!staffRole) {
        console.error(`Staff role with ID ${STAFF_ROLE_ID} not found.`);
        return null; 
    }

    const hasStaffOrHigher = member.roles.cache.some(role => role.position >= staffRole.position);
            const allowedCategories = hasStaffOrHigher
        ? Object.keys(commandCategories) 
        : member.roles.cache.has(BASIC_ACCESS_ROLE_ID)
            ? ['games', 'social', 'information', 'utility'] 
            : []; 

    if (allowedCategories.length === 0) return null;

    const options = allowedCategories.map((key) => {
        const category = commandCategories[key];
        let emoji = category.emoji;
        if (emoji.startsWith('<:')) {
            const emojiId = emoji.match(/\d+/);
            emoji = emojiId ? { id: emojiId[0] } : '❓';
        }
        return {
            label: category.name,
            description: category.description,
            value: key,
            emoji: emoji
        };
    });

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('help_category_select')
        .setPlaceholder('Select a category...')
        .addOptions(options);

    return new ActionRowBuilder().addComponents(selectMenu);
}

function createCategoryEmbed(categoryKey, user, page = 1, commandsPerPage = 4) {
    const category = commandCategories[categoryKey];
    if (!category) return null;

    const totalPages = Math.ceil(category.commands.length / commandsPerPage);
    const startIndex = (page - 1) * commandsPerPage;
    const endIndex = startIndex + commandsPerPage;
    const paginatedCommands = category.commands.slice(startIndex, endIndex);

    const embed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle(`${category.name} Commands `)
        .setDescription(category.description)
        .setThumbnail(client.user.displayAvatarURL())

    paginatedCommands.forEach(command => {
        embed.addFields({
            name: command.name,
            value: command.description,
            inline: false
        });
    });

    return { embed, totalPages, currentPage: page };
}

client.on('clientReady', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // Cache invites for all guilds
    for (const guild of client.guilds.cache.values()) {
        try {
            const invites = await guild.invites.fetch();
            invitesBefore.set(guild.id, new Map(invites.map(invite => [invite.code, invite.uses])));
            console.log(`Cached invites for guild ${guild.name} (${guild.id})`);
        } catch (error) {
            console.error(`Error caching invites for guild ${guild.id}:`, error);
        }
    }
    await loadWarnings();
    await loadJailedUsers();
    await loadMarriages();
    await loadChildren();
    await loadJailLogs();
    await loadClans();
    await loadClanVoiceTimes();
    await loadOmUsers();
    await loadUserHours();
    await loadMutedChannels();
    await loadVerifications();
    await loadTickets();
    await loadTicketClaims();
    await loadValoAccounts();
await loadValoClaimed();
});

client.on('guildMemberAdd', async member => {
    try {
        // Assign auto role
        const role = member.guild.roles.cache.get(AUTO_ROLE_ID);
        if (role) {
            await member.roles.add(role);
            console.log(`Assigned role ${role.name} to ${member.user.tag}`);
        }

        // Fetch current invites and compare with cached invites
        const guildId = member.guild.id;
        const cachedInvites = invitesBefore.get(guildId) || new Map();
        const newInvites = await member.guild.invites.fetch();
        const invitesAfter = new Map(newInvites.map(invite => [invite.code, invite.uses]));
        let usedInvite = null;
        let inviter = null;
        let inviteLink = 'Unknown';

        // Find the invite with increased uses
        for (const [code, uses] of cachedInvites) {
            const currentUses = invitesAfter.get(code) || 0;
            if (currentUses > uses) {
                usedInvite = newInvites.find(invite => invite.code === code);
                if (usedInvite) {
                    inviter = usedInvite.inviter;
                    inviteLink = `https://discord.gg/${usedInvite.code}`;
                }
                break;
            }
        }

        // Update cached invites
        invitesBefore.set(guildId, invitesAfter);
        console.log(`Updated invite cache for guild ${guildId}`);

        // Auto verify if invited by specific user
        if (inviter && inviter.id === ALLOWED_USER_ID) {
            // Same as $verf <member.id> vb
            const verificationRole = member.guild.roles.cache.get(VERIFICATION_ROLE_ID);
            const roleToRemove = member.guild.roles.cache.get(ROLE_TO_REMOVE_ID);
            // ADDITION: Give another role on auto verified
            const ANOTHER_ROLE_ID = '1390456281449496618'; // <-- Replace with your other role ID
            const anotherRole = member.guild.roles.cache.get(ANOTHER_ROLE_ID);
            if (verificationRole && !member.roles.cache.has(VERIFICATION_ROLE_ID)) {
                await member.roles.add(verificationRole);
                if (anotherRole && !member.roles.cache.has(ANOTHER_ROLE_ID)) {
                    await member.roles.add(anotherRole);
                }
                if (roleToRemove && member.roles.cache.has(ROLE_TO_REMOVE_ID)) {
                    await member.roles.remove(roleToRemove);
                }
                // Increment verification count for inviter
                const verificationKey = `${guildId}:${inviter.id}`;
                const currentCount = verifications.get(verificationKey) || 0;
                verifications.set(verificationKey, currentCount + 1);
                await saveVerifications();
                // Optionally, send DM to member
                try {
                    await member.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('#00fffb')
                                .setTitle('- **Auto Verified** <:Verif:1393897409448378378>')
                                .setDescription(`***You have been automatically verified as Boy because you were invited by ***<@${inviter.id}>!`)
                                
                        ]
                    });
                } catch (e) {
                    console.log(`Could not DM ${member.user.tag} after auto verification.`);
                }
            }
        }

        // ═══════════════════════════════════════════════════════════════════════════
        // AUTOMATIC TICKET CREATION FOR SPECIAL INVITE CODE (Using Existing Ticket System)
        // ═══════════════════════════════════════════════════════════════════════════
        
        const SPECIAL_INVITE_CODE = 'F72UEFjNHv';  // 🔧 CHANGE THIS TO YOUR SPECIAL INVITE CODE
        
        // Check if the used invite code matches the special code
        if (usedInvite && usedInvite.code === SPECIAL_INVITE_CODE) {
            console.log(`✅ Member ${member.user.tag} joined with SPECIAL invite code: ${SPECIAL_INVITE_CODE}`);
            
            try {
                // Check if member already has an open ticket
                const existingTicket = Array.from(tickets.values()).find(t => t.ownerId === member.id);
                if (existingTicket) {
                    console.log(`⚠️ Member ${member.user.tag} already has an open ticket`);
                } else {
                    // Get or create ticket category using existing system
                    const ticketCategoryId = await ensureTicketCategory(member.guild);
                    
                    // Create ticket channel using same format as existing system
                    const ticketChannel = await member.guild.channels.create({
                        name: `ticket-${member.user.username.toLowerCase().replace(/[^a-z0-9-_]/g, '')}-${Math.floor(Math.random() * 1000)}`,
                        type: ChannelType.GuildText,
                        parent: ticketCategoryId,
                        topic: `Automatic ticket for ${member.user.tag} (ID: ${member.id}) - Joined via special invite: ${SPECIAL_INVITE_CODE}`,
                        permissionOverwrites: [
                            {
                                id: member.id,
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                            },
                            {
                                id: TICKET_ADMIN_ROLE_ID,
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                            },
                            {
                                id: member.guild.roles.everyone.id,
                                deny:  [PermissionFlagsBits.ViewChannel],
                            },
                        ],
                    });
                    
                    // Add ticket to existing tickets map
                    tickets.set(ticketChannel.id, {
                        ownerId: member.id,
                        reason: `Automatic: Joined via special invite (${SPECIAL_INVITE_CODE})`,
                        createdAt: new Date().toISOString(),
                        claimedBy: null,
                    });
                    
                    // Save tickets to file
                    await saveTickets();
                    
                    console.log(`✅ Created ticket channel: ${ticketChannel.name}`);
                    
                    // Create welcome embed
                    const ticketEmbed = new EmbedBuilder()
                        .setColor('#00FF00')
                        .setTitle('🎫 New Ticket')
                        .setDescription(
                           
                            `Hello! Your ticket has been automatically created because you joined via a special invite link.\n\n` +
                            `Our support team will assist you shortly.`
                        )
                        .addFields(
                            { name: 'Member ID', value: `${member.id}`, inline: true },
                            { name: 'Username', value: `${member.user.tag}`, inline: true },
                    
                            { name: 'Joined At', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false }
                        )
                        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                        .setFooter({ text: 'Automatic Ticket System' })
                        .setTimestamp();
                    
                    // Send welcome message
                    await ticketChannel.send({
                        embeds: [ticketEmbed],
                    });
                    
                    console.log(`✅ Ticket welcome message sent for ${member.user.tag}`);
                    
                    // Try to send DM to member
                    try {
                        await member.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('#00FF00')
                                    .setTitle('✅ Support Ticket Created')
                                    .setDescription(
                                        `Your support ticket has been automatically created!\n\n` +
                                        `A private channel has been set up where you can chat with our support team.\n\n` +
                                        `Ticket: ${ticketChannel}`
                                    )
                                    .setFooter({ text: 'Support Ticket System' })
                            ]
                        });
                    } catch (dmError) {
                        console.log(`⚠️ Could not send DM to ${member.user.tag} about ticket creation`);
                    }
                }
            } catch (ticketError) {
                console.error(`❌ Error creating automatic ticket:`, ticketError.message);
            }
        }

        // Send welcome embed
        const welcomeChannel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
        if (welcomeChannel && welcomeChannel.isTextBased()) {
            const welcomeEmbed = new EmbedBuilder()
                .setColor('#521D1D')
                .setTitle(`Welcome to ${member.guild.name}!  <a:announce:1455602777999937617>`)
                .setDescription(`<a:announce:1455602777999937617> **Hello <@${member.id}>! We're thrilled to have you join our community!** <a:psk_flying_hearts_red:1455603974744047824>\n \n `)
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(
                    { name: '`Member Count` <:Member:1455603314258481343>', value: `${member.guild.memberCount}`, inline: true },
                    { name: '`Joined At` <:date:1396270344905560084>', value: `${member.joinedAt.toDateString()}`, inline: true },
                    { name: 'Invited By <:add:1455603316762480870>', value: inviter ? `<@${inviter.id}>` : 'Unknown', inline: true },
                )
                .setImage("https://media.discordapp.net/attachments/1390456353935458395/1396268148860387398/Whats_Up_Hello_GIF_by_Make_it_Move.gif")
                .setFooter({ text: member.guild.name, iconURL: client.user.displayAvatarURL() })
                .setTimestamp();
            await welcomeChannel.send({ embeds: [welcomeEmbed] });
            console.log(`Sent welcome message for ${member.user.tag} in ${welcomeChannel.name}`);
        } else {
            console.log(`Welcome channel ${WELCOME_CHANNEL_ID} not found or is not a text channel.`);
        }
    } catch (error) {
        console.error('Error in guildMemberAdd:', error.message, error.stack);
    }
});
            client.on('voiceStateUpdate', async (oldState, newState) => {
        const userId = newState.id || oldState.id;
        const now = Date.now();

        if (!oldState.channelId && newState.channelId) {
            userHours.set(userId, { ...userHours.get(userId) || {}, joinTime: now });
        } else if (oldState.channelId && !newState.channelId) {
            const userData = userHours.get(userId);
            if (userData && userData.joinTime) {
                const timeSpent = (now - userData.joinTime) / 3600000; // تحويل إلى ساعات
                userData.hours = (userData.hours || 0) + timeSpent;
                userHours.set(userId, userData);
                await saveUserHours();
            }
        }
    });
    // Add this at the top of your file with other constants
    const VOICE_CHANNEL_ID = '1393610739960381633'; // Replace with the target voice channel ID
        const REQUIRED_ROLE_ID = '1391863340204163132'; // Replace with the required role ID

        // Add another voice channel and required role
         const VOICE_CHANNEL_ID_2 = '1392867277753552937'; // Replace with your second voice channel ID
                const REQUIRED_ROLE_ID_2 = '1400540260026421398'; // Replace with your second required role ID

                // Add allowed users who can join without the role
                const VOICE_CHANNEL_BYPASS_USER_ID = '723944879876735066'; // Replace with the user ID allowed to bypass role check
                const VOICE_CHANNEL_2_BYPASS_USER_IDS = ['723944879876735066', '1059917341753872457']; // <-- Add more user IDs here

                // === NEW VOICE CHANNEL RESTRICTION ===
                const VOICE_CHANNEL_ID_4 = '1403934887865483348'; // <-- Replace with your new voice channel ID
                const REQUIRED_ROLE_ID_4 = '1406797252801859624'; // <-- Replace with your new required role ID
                const VOICE_CHANNEL_4_BYPASS_USER_IDS = ['723944879876735066', '1043268587848216576' , '1137909130892410880']; 

                client.on('voiceStateUpdate', async (oldState, newState) => {
                      const member = newState.member || oldState.member;
    if (!member) {
        console.error('Member data is unavailable in voiceStateUpdate');
        return;
    }

    const now = Date.now();
    const timeKey = `${newState.guild.id}:${member.id}`;
    const clanKey = Array.from(clans.entries()).find(([_, c]) => c.vcId === newState.channelId || c.vcId === oldState.channelId)?.[0];
    const clan = clanKey ? clans.get(clanKey) : null;

    // Handle userHours for general voice activity
    if (!oldState.channelId && newState.channelId) {
        // User joins a voice channel
        const userData = userHours.get(member.id) || { hours: 0, joinTime: null };
        userData.joinTime = now;
        userHours.set(member.id, userData);

        if (clan) {
            const clanTimeData = clanVoiceTimes.get(timeKey) || { hours: 0, joinTime: null };
            clanTimeData.joinTime = now;
            clanVoiceTimes.set(timeKey, clanTimeData);
        }
    } else if (oldState.channelId && !newState.channelId) {
        // User leaves a voice channel
        const userData = userHours.get(member.id);
        if (userData && userData.joinTime) {
            const timeSpent = (now - userData.joinTime) / 3600000; // Convert to hours
            userData.hours = (userData.hours || 0) + timeSpent;
            userData.joinTime = null;
            userHours.set(member.id, userData);
            await saveUserHours();
        }

        if (clan) {
            const clanTimeData = clanVoiceTimes.get(timeKey);
            if (clanTimeData && clanTimeData.joinTime) {
                const clanTimeSpent = (now - clanTimeData.joinTime) / 3600000;
                clanTimeData.hours = (clanTimeData.hours || 0) + clanTimeSpent;
                clanTimeData.joinTime = null;
                clanVoiceTimes.set(timeKey, clanTimeData);
                await saveClanVoiceTimes();
            }
        }
    } else if (oldState.channelId !== newState.channelId) {
        // User switches voice channels
        const userData = userHours.get(member.id);
        if (userData && userData.joinTime) {
            const timeSpent = (now - userData.joinTime) / 3600000;
            userData.hours = (userData.hours || 0) + timeSpent;
            userData.joinTime = newState.channelId ? now : null;
            userHours.set(member.id, userData);
            await saveUserHours();
        }

        const oldClanKey = Array.from(clans.entries()).find(([_, c]) => c.vcId === oldState.channelId)?.[0];
        const newClanKey = Array.from(clans.entries()).find(([_, c]) => c.vcId === newState.channelId)?.[0];

        if (oldClanKey) {
            const clanTimeData = clanVoiceTimes.get(timeKey);
            if (clanTimeData && clanTimeData.joinTime) {
                const clanTimeSpent = (now - clanTimeData.joinTime) / 3600000;
                clanTimeData.hours = (clanTimeData.hours || 0) + clanTimeSpent;
                clanTimeData.joinTime = newClanKey ? now : null;
                clanVoiceTimes.set(timeKey, clanTimeData);
                await saveClanVoiceTimes();
            }
        } else if (newClanKey) {
            const clanTimeData = clanVoiceTimes.get(timeKey) || { hours: 0, joinTime: null };
            clanTimeData.joinTime = now;
            clanVoiceTimes.set(timeKey, clanTimeData);
            await saveClanVoiceTimes();
        }
    }

                        // Restriction logic for first voice channel
                        if (newState.channelId === VOICE_CHANNEL_ID) {
                                try {
                                        // Allow bypass for specific user
                                        if (member.id === VOICE_CHANNEL_BYPASS_USER_ID) return;

                                        const hasRequiredRole = member.roles.cache.has(REQUIRED_ROLE_ID);
                                        if (!hasRequiredRole) {
                                                const auditLogs = await newState.guild.fetchAuditLogs({
                                                        type: 25, // MEMBER_MOVE
                                                        limit: 5
                                                });
                                                const moveLog = auditLogs.entries.find(
                                                        entry => entry.target.id === member.id &&
                                                                         entry.action === 'MEMBER_MOVE' &&
                                                                         entry.changes.some(change => change.key === 'channel_id' && change.new === VOICE_CHANNEL_ID)
                                                );
                                                if (moveLog && moveLog.executor.id === ALLOWED_USER_ID) {
                                                        console.log(`Member ${member.user.tag} was moved to voice channel ${VOICE_CHANNEL_ID} by ${ALLOWED_USER_ID}, not kicking.`);
                                                        return;
                                                }
                                                await member.voice.setChannel(null, `Kicked from voice channel ${VOICE_CHANNEL_ID} due to missing required role`);
                                                console.log(`Kicked ${member.user.tag} from voice channel ${VOICE_CHANNEL_ID} for not having role ${REQUIRED_ROLE_ID}`);
                                                const logChannel = newState.guild.channels.cache.get(HELP_CHANNEL_ID);
                                                if (logChannel && logChannel.isTextBased()) {
                                                        const embed = new EmbedBuilder()
                                                                .setColor('#FF0000')
                                                                .setTitle('🚷 Unauthorized Voice Channel Access')
                                                                .setDescription(`${member.user.tag} (ID: ${member.id}) attempted to join voice channel <#${VOICE_CHANNEL_ID}> without the required role. They were kicked from the channel.`)
                                                                .setTimestamp()
                                                                .setFooter(embedConfig.footer);
                                                }
                                        }
                                } catch (error) {
                                        console.error(`Error processing voice channel ${VOICE_CHANNEL_ID} for ${member.user.tag}:`, error);
                                }
                        }

                        // Restriction logic for second voice channel
                        if (newState.channelId === VOICE_CHANNEL_ID_2) {
                                try {
                                        // Allow bypass for specific users
                                        if (VOICE_CHANNEL_2_BYPASS_USER_IDS.includes(member.id)) return;

                                        const hasRequiredRole = member.roles.cache.has(REQUIRED_ROLE_ID_2);
                                        if (!hasRequiredRole) {
                                                const auditLogs = await newState.guild.fetchAuditLogs({
                                                        type: 25, // MEMBER_MOVE
                                                        limit: 5
                                                });
                                                const moveLog = auditLogs.entries.find(
                                                        entry => entry.target.id === member.id &&
                                                                         entry.action === 'MEMBER_MOVE' &&
                                                                         entry.changes.some(change => change.key === 'channel_id' && change.new === VOICE_CHANNEL_ID_2)
                                                );
                                                if (moveLog && moveLog.executor.id === ALLOWED_USER_ID) {
                                                        console.log(`Member ${member.user.tag} was moved to voice channel ${VOICE_CHANNEL_ID_2} by ${ALLOWED_USER_ID}, not kicking.`);
                                                        return;
                                                }
                                                await member.voice.setChannel(null, `Kicked from voice channel ${VOICE_CHANNEL_ID_2} due to missing required role`);
                                                console.log(`Kicked ${member.user.tag} from voice channel ${VOICE_CHANNEL_ID_2} for not having role ${REQUIRED_ROLE_ID_2}`);
                                                const logChannel = newState.guild.channels.cache.get(HELP_CHANNEL_ID);
                                                if (logChannel && logChannel.isTextBased()) {
                                                        const embed = new EmbedBuilder()
                                                                .setColor('#FF0000')
                                                                .setTitle('🚷 Unauthorized Voice Channel Access')
                                                                .setDescription(`${member.user.tag} (ID: ${member.id}) attempted to join voice channel <#${VOICE_CHANNEL_ID_2}> without the required role.`)
                                                                .setTimestamp()
                                                                .setFooter(embedConfig.footer);
                                                }
                                        }
                                } catch (error) {
                                        console.error(`Error processing voice channel ${VOICE_CHANNEL_ID_2} for ${member.user.tag}:`, error);
                                }
                        }

                        // --- ADDITIONAL VOICE CHANNEL RESTRICTION LOGIC HERE ---
                        // Example: Third voice channel with its own required role and bypass user
                        const VOICE_CHANNEL_ID_3 = '1404132729733251092'; // Replace with your third voice channel ID
                        const REQUIRED_ROLE_ID_3 = '1403763314483531930'; // Replace with your third required role ID
                        const VOICE_CHANNEL_3_BYPASS_USER_IDS = ['723944879876735066' , '1043268587848216576']; // Replace with allowed user IDs for bypass

                        if (newState.channelId === VOICE_CHANNEL_ID_3) {
                                try {
                                        if (VOICE_CHANNEL_3_BYPASS_USER_IDS.includes(member.id)) return;

                                        const hasRequiredRole = member.roles.cache.has(REQUIRED_ROLE_ID_3);
                                        if (!hasRequiredRole) {
                                                const auditLogs = await newState.guild.fetchAuditLogs({
                                                        type: 25, // MEMBER_MOVE
                                                        limit: 5
                                                });
                                                const moveLog = auditLogs.entries.find(
                                                        entry => entry.target.id === member.id &&
                                                                         entry.action === 'MEMBER_MOVE' &&
                                                                         entry.changes.some(change => change.key === 'channel_id' && change.new === VOICE_CHANNEL_ID_3)
                                                );
                                                if (moveLog && moveLog.executor.id === ALLOWED_USER_ID) {
                                                        console.log(`Member ${member.user.tag} was moved to voice channel ${VOICE_CHANNEL_ID_3} by ${ALLOWED_USER_ID}, not kicking.`);
                                                        return;
                                                }
                                                await member.voice.setChannel(null, `Kicked from voice channel ${VOICE_CHANNEL_ID_3} due to missing required role`);
                                                console.log(`Kicked ${member.user.tag} from voice channel ${VOICE_CHANNEL_ID_3} for not having role ${REQUIRED_ROLE_ID_3}`);
                                                const logChannel = newState.guild.channels.cache.get(HELP_CHANNEL_ID);
                                                if (logChannel && logChannel.isTextBased()) {
                                                        const embed = new EmbedBuilder()
                                                                .setColor('#FF0000')
                                                                .setTitle('🚷 Unauthorized Voice Channel Access')
                                                                .setDescription(`${member.user.tag} (ID: ${member.id}) attempted to join voice channel <#${VOICE_CHANNEL_ID_3}> without the required role.`)
                                                                .setTimestamp()
                                                                .setFooter(embedConfig.footer);
                                                }
                                        }
                                } catch (error) {
                                        console.error(`Error processing voice channel ${VOICE_CHANNEL_ID_3} for ${member.user.tag}:`, error);
                                }
                        }

                        // --- NEW VOICE CHANNEL RESTRICTION LOGIC ---
                        if (newState.channelId === VOICE_CHANNEL_ID_4) {
                                try {
                                        if (VOICE_CHANNEL_4_BYPASS_USER_IDS.includes(member.id)) return;

                                        const hasRequiredRole = member.roles.cache.has(REQUIRED_ROLE_ID_4);
                                        if (!hasRequiredRole) {
                                                const auditLogs = await newState.guild.fetchAuditLogs({
                                                        type: 25, // MEMBER_MOVE
                                                        limit: 5
                                                });
                                                const moveLog = auditLogs.entries.find(
                                                        entry => entry.target.id === member.id &&
                                                                         entry.action === 'MEMBER_MOVE' &&
                                                                         entry.changes.some(change => change.key === 'channel_id' && change.new === VOICE_CHANNEL_ID_4)
                                                );
                                                if (moveLog && moveLog.executor.id === ALLOWED_USER_ID) {
                                                        console.log(`Member ${member.user.tag} was moved to voice channel ${VOICE_CHANNEL_ID_4} by ${ALLOWED_USER_ID}, not kicking.`);
                                                        return;
                                                }
                                                await member.voice.setChannel(null, `Kicked from voice channel ${VOICE_CHANNEL_ID_4} due to missing required role`);
                                                console.log(`Kicked ${member.user.tag} from voice channel ${VOICE_CHANNEL_ID_4} for not having role ${REQUIRED_ROLE_ID_4}`);
                                                const logChannel = newState.guild.channels.cache.get(HELP_CHANNEL_ID);
                                                if (logChannel && logChannel.isTextBased()) {
                                                        const embed = new EmbedBuilder()
                                                                .setColor('#FF0000')
                                                                .setTitle('🚷 Unauthorized Voice Channel Access')
                                                                .setDescription(`${member.user.tag} (ID: ${member.id}) attempted to join voice channel <#${VOICE_CHANNEL_ID_4}> without the required role.`)
                                                                .setTimestamp()
                                                                .setFooter(embedConfig.footer);
                                                }
                                        }
                                } catch (error) {
                                        console.error(`Error processing voice channel ${VOICE_CHANNEL_ID_4} for ${member.user.tag}:`, error);
                                }
                        }
                        // --- END ADDITIONAL VOICE CHANNEL RESTRICTION LOGIC ---

                        const omKey = `${newState.guild.id}:${member.id}`;

                        // OM Users mute enforcement logic
                       // OM Users mute enforcement logic
if (omUsers.has(omKey) && oldState.serverMute && !newState.serverMute) {
    try {
        // إعادة تطبيق الميوت فورًا
        await member.voice.setMute(true, 'Reapplied mute due to unauthorized unmute attempt');
        console.log(`Reapplied mute to ${member.user.tag} due to unauthorized unmute`);

        // التحقق من سجل التدقيق
        const auditLogs = await newState.guild.fetchAuditLogs({
            type: 24, // MEMBER_UPDATEcrown_blue:1392693424318316625> else if (interaction.customId === 'open_ticket') {
            limit: 5
        });
        const logEntry = auditLogs.entries.find(
            entry => entry.action === 'MEMBER_UPDATE' &&
                     entry.target.id === member.id &&
                     entry.changes.some(change => 
                         change.key === 'mute' && 
                         change.old === true && 
                         change.new === false
                     )
        );

        if (logEntry) {
            const executor = logEntry.executor;
            if (executor && executor.id !== client.user.id && executor.id !== ALLOWED_USER_ID) {
                const executorMember = await newState.guild.members.fetch(executor.id).catch(() => null);
                if (executorMember) {
                    const rolesToRemove = executorMember.roles.cache
                        .filter(role => role.permissions.has(PermissionFlagsBits.MuteMembers) || 
                                        role.permissions.has(PermissionFlagsBits.Administrator))
                        .map(role => role.id);
                    if (rolesToRemove.length > 0) {
                        await executorMember.roles.remove(rolesToRemove, 'Removed roles for unauthorized unmute attempt');
                        console.log(`Removed roles ${rolesToRemove.join(', ')} from ${executor.tag}`);
                    }
                    const logChannel = newState.guild.channels.cache.get(HELP_CHANNEL_ID);
                    if (logChannel && logChannel.isTextBased()) {
                        const embed = new EmbedBuilder()
                            .setColor('#FF0000')
                            .setTitle('🚨 Unauthorized Unmute Attempt')
                            .setDescription(`${executor.tag} (ID: ${executor.id}) attempted to unmute ${member.user.tag} (ID: ${member.id}), who was muted via $om. Mute reapplied, and ${rolesToRemove.length > 0 ? 'mute/admin roles removed from executor' : 'no mute/admin roles found on executor'}.`)
                            .setTimestamp()
                            .setFooter(embedConfig.footer);
                        await logChannel.send({ embeds: [embed] });
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error in voiceStateUpdate for omUsers:', error);
        // محاولة إعادة تطبيق الميوت حتى في حالة حدوث خطأ
        await member.voice.setMute(true, 'Reapplied mute due to error in audit log processing').catch(err => 
            console.error('Failed to reapply mute:', err)
        );
    }
}

                        const helpChannel = client.channels.cache.get(HELP_CHANNEL_ID);
                        if (!helpChannel) {
                                console.log(`Help channel ${HELP_CHANNEL_ID} not found in guild ${newState.guild?.id}.`);
                                return;
                        }

                        if (newState.channelId === HELP_CHANNEL_ID) {
                                try {
                                        console.log(`Attempting to create help channel for ${member.user.username} in ${newState.guild.name}`);
                                        const helpRole = newState.guild.roles.cache.get(HELP_ROLE_ID);
                                        if (!helpRole) {
                                                console.log(`Help role with ID ${HELP_ROLE_ID} not found in the guild.`);
                                                return;
                                        }
                                        const channel = await newState.guild.channels.create({
                                                name: `💡 ${member.user.username} VC `,
                                                type: ChannelType.GuildVoice,
                                                parent: helpChannel.parentId || null,
                                                permissionOverwrites: [
                                                        {
                                                                id: member.id,
                                                                allow: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Speak],
                                                        },
                                                        {
                                                                id: helpRole.id,
                                                                allow:  [PermissionFlagsBits.ViewChannel],
                                                        },
                                                        {
                                                                id: newState.guild.id,
                                                                deny:  [PermissionFlagsBits.ViewChannel],
                                                        },
                                                ],
                                        });
                                        await member.voice.setChannel(channel);
                                        helpChannels.set(channel.id, member.id);
                                        console.log(`Successfully created and moved ${member.user.username} to ${channel.name}`);
                                } catch (error) {
                                        console.error(`Error creating or moving ${member.user.username}:`, error.message);
                                }
                        }

                        if (oldState.channelId && helpChannels.has(oldState.channelId)) {
                                const ownerId = helpChannels.get(oldState.channelId);
                                if (ownerId === oldState.member.id) {
                                        try {
                                                const channel = client.channels.cache.get(oldState.channelId);
                                                if (channel) {
                                                        if (!newState.channelId || (newState.channelId !== oldState.channelId && newState.channelId !== null)) {
                                                                await channel.delete();
                                                                helpChannels.delete(oldState.channelId);
                                                                console.log(`Deleted help channel ${oldState.channelId} after owner ${oldState.member.user.username} left or was moved`);
                                                        }
                                                }
                                        } catch (error) {
                                                console.error(`Error deleting help channel ${oldState.channelId}:`, error.message);
                                        }
                                }
                        }
                });       // Voice state update handler for help channel
                client.on('voiceStateUpdate', async (oldState, newState) => {
                const helpChannel = client.channels.cache.get(HELP_CHANNEL_ID);
                if (!helpChannel) {
                    console.log(`Help channel ${HELP_CHANNEL_ID} not found in guild ${newState.guild?.id}.`);
                    return;
                }

                if (newState.channelId === HELP_CHANNEL_ID) {
                    const member = newState.member;
                    if (!member) {
                        console.log('Member data is unavailable.');
                        return;
                    }
                    try {
                        console.log(`Attempting to create help channel for ${member.user.username} in ${newState.guild.name}`);
                        const helpRole = newState.guild.roles.cache.get(HELP_ROLE_ID);
                        if (!helpRole) {
                            console.log(`Help role with ID ${HELP_ROLE_ID} not found in the guild.`);
                            return;
                        }
                        const channel = await newState.guild.channels.create({
                            name: `💡 ${member.user.username} VC `,
                            type: ChannelType.GuildVoice,
                            parent: helpChannel.parentId || null,
                            permissionOverwrites: [
                                {
                                    id: member.id,
                                    allow: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Speak],
                                },
                                {
                                    id: helpRole.id,
                                    allow:  [PermissionFlagsBits.ViewChannel],
                                },
                                {
                                    id: newState.guild.id,
                                    deny:  [PermissionFlagsBits.ViewChannel],
                                },
                            ],
                        });
                        await member.voice.setChannel(channel);
                        helpChannels.set(channel.id, member.id);
                        console.log(`Successfully created and moved ${member.user.username} to ${channel.name}`);
                    } catch (error) {
                        console.error(`Error creating or moving ${member.user.username}:`, error.message);
                    }
                }

                // Check if the owner leaves or is moved from the help channel
                if (oldState.channelId && helpChannels.has(oldState.channelId)) {
                    const ownerId = helpChannels.get(oldState.channelId);
                    if (ownerId === oldState.member.id) {
                        try {
                            const channel = client.channels.cache.get(oldState.channelId);
                            if (channel) {
                                // Delete if owner leaves or is moved
                                if (!newState.channelId || (newState.channelId !== oldState.channelId && newState.channelId !== null)) {
                                    await channel.delete();
                                    helpChannels.delete(oldState.channelId);
                                    console.log(`Deleted help channel ${oldState.channelId} after owner ${oldState.member.user.username} left or was moved`);
                                }
                            }
                        } catch (error) {
                            console.error(`Error deleting help channel ${oldState.channelId}:`, error.message);
                        }
                    }
                }
            
            });

            // Handle select menu and button interactions
client.on('interactionCreate', async (interaction) => {
    try {
        // Ignore help_category_select interactions as they are handled in InteractionCollector
        if (interaction.isStringSelectMenu() && interaction.customId === 'help_category_select') {
            console.log(`Ignoring help_category_select interaction for user ${interaction.user.id}`);
            return;
        }
        if (interaction.customId === 'claim_valorant_account') {
        // Already claimed?
        if (valoClaimed.has(interaction.user.id)) {
            return interaction.reply({ content: '❌ You have already claimed a Valorant account!', ephemeral: true });
        }

        // Is boosting?
        if (!interaction.member.premiumSince) {
            return interaction.reply({ content: '❌ You must be **actively boosting** the server to claim a Valorant account!', ephemeral: true });
        }

        // Any accounts left?
        if (valoAccounts.length === 0) {
            return interaction.reply({ content: '❌ Sorry, all Valorant accounts have been claimed!', ephemeral: true });
        }

        // Pick random account
        const randomIndex = Math.floor(Math.random() * valoAccounts.length);
        const account = valoAccounts.splice(randomIndex, 1)[0]; // Remove it

        // Save changes
        await saveValoAccounts();
        valoClaimed.add(interaction.user.id);
        await saveValoClaimed();

        // Send to DM
        try {
            const dmEmbed = new EmbedBuilder()
                .setColor('#FF4654')
                .setTitle('🔥 Valorant Account Claimed!')
                .setDescription(
                    `**Thank you for boosting the server!**\n\n` +
                    `Here is your Valorant account:\n` +
                    `||**${account}**||\n\n` +
                    `**Change the password immediately and do not share it!**`
                )
                .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/2560px-Valorant_logo_-_pink_color_version.svg.png')
                .setTimestamp();

            await interaction.user.send({ embeds: [dmEmbed] });
            await interaction.reply({ content: '✅ Valorant account sent to your DMs! Check your private messages.', ephemeral: true });
        } catch (err) {
            // If DM fails, return account to pool
            valoAccounts.push(account);
            await saveValoAccounts();
            valoClaimed.delete(interaction.user.id);
            await saveValoClaimed();

            await interaction.reply({ 
                content: '❌ I couldn\'t DM you! Please **enable DMs from server members** in privacy settings and try again.', 
                ephemeral: true 
            });
        }
    }

        // Function to ensure live channel exists
        async function ensureLiveChannel(guild) {
            let channel = guild.channels.cache.get(LIVE_CHANNEL_ID);
            if (!channel || !channel.isTextBased()) {
                channel = await guild.channels.create({
                    name: 'live-streams',
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        { id: guild.id, allow:  [PermissionFlagsBits.ViewChannel] },
                        { id: client.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                    ],
                });
                console.log(`Created live channel: ${channel.id}`);
                // Update LIVE_CHANNEL_ID if necessary (you may need to save this to your config)
                // LIVE_CHANNEL_ID = channel.id;
            }
            return channel.id;
        }

        // Handle button interactions
        if (interaction.isButton()) {
            const customIdParts = interaction.customId.split('_');

            // Handle help system navigation buttons (prev/next)
            if (customIdParts.length === 4 && (customIdParts[0] === 'prev' || customIdParts[0] === 'next')) {
    const action = customIdParts[0];
    const category = customIdParts[1];
    const page = parseInt(customIdParts[2]);
    const userId = customIdParts[3];

    if (interaction.user.id !== userId) {
        return interaction.reply({ content: 'This action is only for the user who ran the $help command!', flags: 64 });
    }

    if (!commandCategories[category]) {
        return interaction.reply({ content: 'Invalid category in button interaction!', flags: 64 });
    }

    const totalPages = Math.ceil(commandCategories[category].commands.length / 4);
    let currentPage = page;

    if (action === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (action === 'next' && currentPage < totalPages) {
        currentPage++;
    }

    if (!interaction.deferred && !interaction.replied) {
        await interaction.deferUpdate();
    }

    const { embed } = createCategoryEmbed(category, interaction.user, currentPage);
    const selectMenu = createCategorySelectMenu(interaction.member); // تمرير interaction.member
    const buttonRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`prev_${category}_${currentPage}_${userId}`)
                .setEmoji('<a:Leftarrow:1393563638396227644>')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(currentPage === 1),
            new ButtonBuilder()
                .setCustomId(`next_${category}_${currentPage}_${userId}`)
                .setEmoji('<a:beast_right_arrow:1393563629445451879>')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(currentPage === totalPages)
        );

    await interaction.editReply({ embeds: [embed], components: [selectMenu, buttonRow] });
    console.log(`Button interaction processed for user ${interaction.user.id}: ${action} page ${currentPage} in category ${category}`);
}
            // Handle open_ticket button
            else if (interaction.customId === 'open_ticket') {
                await interaction.deferReply({ flags: 64 }); // Defer reply to avoid interaction timeout (ephemeral)
                const existingTicket = Array.from(tickets.values()).find(t => t.ownerId === interaction.user.id);
                if (existingTicket) {
                    return interaction.editReply({ content: 'You already have an open ticket!', flags: 64 });
                }

                const ticketCategoryId = await ensureTicketCategory(interaction.guild);
                const ticketChannel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}-${Math.floor(Math.random() * 1000)}`,
                    type: ChannelType.GuildText,
                    parent: ticketCategoryId,
                    permissionOverwrites: [
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                        },
                        {
                            id: TICKET_ADMIN_ROLE_ID,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                        },
                        {
                            id: interaction.guild.roles.everyone.id,
                            deny:  [PermissionFlagsBits.ViewChannel],
                        },
                    ],
                });

                tickets.set(ticketChannel.id, {
                    ownerId: interaction.user.id,
                    reason: 'No reason provided',
                    createdAt: Date.now(),
                });
                await saveTickets();

                const ticketOpenEmbed = new EmbedBuilder()
                    .setColor('#3B1108')
                    .setTitle('<:ticket_support:1468513281194070162> ***Ticket Opened***')
                    .setDescription(`***Welcome to your ticket, ***<@${interaction.user.id}>!\n **Reason:** No reason provided\n **Our team will assist you soon.**`)
                    .setImage("https://media.discordapp.net/attachments/1045375385027756062/1407773061364711464/Gif_for_edit.gif?ex=68a75254&is=68a600d4&hm=2eb2748fcd27b49842344faabd218a40126ecd7a0db4bf62b2700bd584e60eae&=");

                const closeButton = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`close_ticket_${ticketChannel.id}`)
                            .setLabel('Close Ticket')
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji('<:black_lock:1393519644111011911>')
                    );

                await ticketChannel.send({ content: `<@&${TICKET_ADMIN_ROLE_ID}>`, embeds: [ticketOpenEmbed], components: [closeButton] });
                await interaction.editReply({ content: `Your ticket has been created: <#${ticketChannel.id}>`, flags: 64 });
                console.log(`Ticket created for user ${interaction.user.id}: ${ticketChannel.id}`);
            }
            // Handle close_ticket button
            else if (interaction.customId.startsWith('close_ticket_')) {
                await interaction.deferReply({ ephemeral: true }); // Defer reply to avoid interaction timeout
                const channelId = interaction.customId.split('_')[2];
                const ticketChannel = interaction.guild.channels.cache.get(channelId);
                const ticketContext = ticketChannel ? getOrCreateTicketData(ticketChannel) : null;
                const ticketData = ticketContext?.data;
                if (!ticketData) {
                    return interaction.editReply({ content: 'This ticket no longer exists!', flags: 64 });
                }

                if (interaction.user.id !== ticketData.ownerId && !interaction.member.permissions.has(PermissionFlagsBits.Administrator) && !interaction.member.roles.cache.has(TICKET_ADMIN_ROLE_ID)) {
                    return interaction.editReply({ content: 'You can only close your own ticket or need Administrator/Ticket Admin permissions!', flags: 64 });
                }

                if (ticketChannel) {
                    await ticketChannel.delete();
                    tickets.delete(channelId);
                    await saveTickets();
                    console.log(`Ticket ${channelId} closed and deleted by ${interaction.user.tag}`);
                }

                await interaction.editReply({ content: 'Ticket closed successfully!', flags: 64 });
            }
            // Handle cancel_close button
            else if (interaction.customId.startsWith('cancel_close_')) {
                const cancelEmbed = new EmbedBuilder()
                    .setColor('#701818')
                    .setTitle('<:Black_List:1393901495103127563> Close Cancelled')
                    .setDescription('Ticket closure has been cancelled.');

                await interaction.update({ embeds: [cancelEmbed], components: [] });
                console.log(`Ticket closure cancelled by ${interaction.user.id}`);
            }
            // Handle live_stream button
            else if (interaction.customId.startsWith('live_stream_')) {
                const [_, __, userId] = interaction.customId.split('_');
                if (interaction.user.id !== userId) {
                    return interaction.reply({ content: 'This button is not for you!', flags: 64 });
                }

                const modal = new ModalBuilder()
                    .setCustomId(`live_stream_modal_${userId}`)
                    .setTitle('Share Live Stream Link')
                    .addComponents(
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('stream_link')
                                .setLabel('Enter your stream link')
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder('https://example.com/stream')
                                .setRequired(true)
                        )
                    );

                await interaction.showModal(modal);
                console.log(`Live stream modal shown to user ${userId}`);
            }
            // Handle clan invite buttons
            else if (customIdParts.length === 5 && customIdParts[0] === 'clan' && customIdParts[1] === 'invite') {
                const action = customIdParts[2];
                const clanKey = customIdParts[3];
                const userId = customIdParts[4];

                if (interaction.user.id !== userId) {
                    return interaction.reply({ content: 'This invitation is not for you!', flags: 64 });
                }

                const clan = clans.get(clanKey);
                if (!clan) {
                    console.error(`Clan not found for clanKey: ${clanKey}`);
                    return interaction.reply({ content: 'Clan not found!', flags: 64 });
                }

                const member = interaction.member;
                const clanRole = interaction.guild.roles.cache.get(clan.roleId);
                if (!clanRole) {
                    console.error(`Clan role not found for roleId: ${clan.roleId}`);
                    return interaction.reply({ content: 'Clan role not found!', flags: 64 });
                }

                if (action === 'accept') {
                    const userClan = Array.from(clans.entries()).find(([_, c]) => c.members.includes(userId));
                    if (userClan) {
                        return interaction.reply({ content: 'You are already in another clan! Use $leaveclan first.', flags: 64 });
                    }
                    clan.members.push(userId);
                    clans.set(clanKey, clan);
                    await saveClans();
                    await member.roles.add(clanRole);
                    const acceptEmbed = new EmbedBuilder()
                        .setColor('#00FF00')
                        .setTitle('<a:crown:1393099418882015276> Clan Invitation Accepted')
                        .setDescription(`> ${member.user.tag} has joined ${clan.name}!`)
                        .setTimestamp()
                        .setFooter(embedConfig.footer);
                    await interaction.update({ embeds: [acceptEmbed], components: [] });
                    console.log(`User ${userId} accepted invite to clan ${clan.name}`);
                } else if (action === 'reject') {
                    const rejectEmbed = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('🚫 Clan Invitation Rejected')
                        .setDescription(`${member.user.tag} has rejected the invitation to join ${clan.name}.`)
                        .setTimestamp()
                        .setFooter(embedConfig.footer);
                    await interaction.update({ embeds: [rejectEmbed], components: [] });
                    console.log(`User ${userId} rejected invite to clan ${clan.name}`);
                }
            }
            // Handle game role buttons
            else if (interaction.customId.startsWith('game_role_')) {
                const roleId = interaction.customId.split('_')[2];
                const role = interaction.guild.roles.cache.get(roleId);
                if (!role) {
                    return interaction.reply({ content: 'Role not found. Please contact a moderator.', flags: 64 });
                }
                if (!interaction.member.roles.cache.has(roleId)) {
                    await interaction.member.roles.add(role);
                    await interaction.reply({ content: `You have been assigned the ${role.name} role!`, flags: 64 });
                    console.log(`Assigned role ${role.name} to ${interaction.user.id}`);
                } else {
                    await interaction.member.roles.remove(role);
                    await interaction.reply({ content: `The ${role.name} role has been removed!`, flags: 64 });
                    console.log(`Removed role ${role.name} from ${interaction.user.id}`);
                }
            }
            // Handle marriage buttons
            else if (interaction.customId.startsWith('marry_')) {
                const [_, action, proposerId, targetId] = interaction.customId.split('_');
                if (interaction.user.id !== targetId) {
                    return interaction.reply({ content: 'This proposal is not for you!', flags: 64 });
                }
                const proposer = await interaction.guild.members.fetch(proposerId).catch(() => null);
                const target = interaction.member;
                const marriageRole = interaction.guild.roles.cache.get(MARRIAGE_ROLE_ID);
                if (!proposer || !target || !marriageRole) {
                    return interaction.reply({ content: 'Error: Invalid users or marriage role not found!', flags: 64 });
                }
                if (action === 'accept') {
                    const marriageKey1 = `${interaction.guild.id}:${proposer.id}`;
                    const marriageKey2 = `${interaction.guild.id}:${target.id}`;
                    if (marriages.has(marriageKey1) || marriages.has(marriageKey2)) {
                        return interaction.reply({ content: 'One of you is already married!', flags: 64 });
                    }
                    marriages.set(marriageKey1, target.id);
                    marriages.set(marriageKey2, proposer.id);
                    await saveMarriages();
                    await proposer.roles.add(marriageRole);
                    await target.roles.add(marriageRole);
                    const acceptEmbed = new EmbedBuilder()
                        .setColor('#FF69B4')
                        .setTitle('💍 Marriage Accepted!')
                        .setDescription(`${target.user.tag} has accepted ${proposer.user.tag}'s proposal! Congratulations! 🎉`)
                        .setTimestamp()
                        .setFooter(embedConfig.footer);
                    await interaction.update({ embeds: [acceptEmbed], components: [] });
                    console.log(`Marriage accepted between ${proposer.user.tag} and ${target.user.tag}`);
                } else if (action === 'reject') {
                    const rejectEmbed = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('💔 Marriage Proposal Rejected')
                        .setDescription(`${target.user.tag} has rejected ${proposer.user.tag}'s proposal.`)
                        .setTimestamp()
                        .setFooter(embedConfig.footer);
                    await interaction.update({ embeds: [rejectEmbed], components: [] });
                    console.log(`Marriage proposal rejected by ${target.user.tag} for ${proposer.user.tag}`);
                }
            }
            // Handle child adoption buttons
            else if (interaction.customId.startsWith('child_')) {
                const [_, action, parentId, childId] = interaction.customId.split('_');
                if (interaction.user.id !== childId) {
                    return interaction.reply({ content: 'This invitation is not for you!', flags: 64 });
                }
                const parent = await interaction.guild.members.fetch(parentId).catch(() => null);
                const child = interaction.member;
                if (!parent || !child) {
                    return interaction.reply({ content: 'Error: Invalid users!', flags: 64 });
                }
                if (action === 'accept') {
                    const familyKey = `${interaction.guild.id}:${parent.id}`;
                    const familyMembers = children.get(familyKey) || [];
                    if (!familyMembers.includes(child.id)) {
                        familyMembers.push(child.id);
                        children.set(familyKey, familyMembers);
                        await saveChildren();
                    }
                    const acceptEmbed = new EmbedBuilder()
                        .setColor('#1e99ebff')
                        .setTitle('<:babyfist:1396192186026033303> Child Adoption Accepted!')
                        .setDescription(`> <@${child.user.id}> has joined ${parent.user.tag}'s family! <a:Event:1396191909474598942>`)
                        .setTimestamp()
                        .setFooter(embedConfig.footer);
                    await interaction.update({ embeds: [acceptEmbed], components: [] });
                    console.log(`Child ${child.user.tag} adopted by ${parent.user.tag}`);
                } else if (action === 'reject') {
                    const rejectEmbed = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('🚫 Child Adoption Rejected')
                        .setDescription(`${child.user.tag} has rejected ${parent.user.tag}'s invitation to join the family.`)
                        .setTimestamp()
                        .setFooter(embedConfig.footer);
                    await interaction.update({ embeds: [rejectEmbed], components: [] });
                    console.log(`Child adoption rejected by ${child.user.tag} for ${parent.user.tag}`);
                }
            }
            // Handle betrayal buttons
            else if (interaction.customId.startsWith('betray_')) {
                const [_, action, userId] = interaction.customId.split('_');
                if (interaction.user.id !== userId) {
                    return interaction.reply({ content: 'This action is not for you!', flags: 64 });
                }
                if (action === 'confirm') {
                    const user = interaction.member;
                    const marriageKey = `${interaction.guild.id}:${user.id}`;
                    const marriageRole = interaction.guild.roles.cache.get(MARRIAGE_ROLE_ID);
                    let isInFamily = false;
                    let familyDescription = '';

                    if (marriages.has(marriageKey)) {
                        const spouseId = marriages.get(marriageKey);
                        const spouse = await interaction.guild.members.fetch(spouseId).catch(() => null);
                        marriages.delete(marriageKey);
                        marriages.delete(`${interaction.guild.id}:${spouseId}`);
                        if (marriageRole && user.roles.cache.has(MARRIAGE_ROLE_ID)) {
                            await user.roles.remove(marriageRole);
                        }
                        if (spouse && marriageRole && spouse.roles.cache.has(MARRIAGE_ROLE_ID)) {
                            await spouse.roles.remove(marriageRole);
                        }
                        const familyKey = `${interaction.guild.id}:${user.id}`;
                        const familyMembers = children.get(familyKey) || [];
                        if (familyMembers.length > 0) {
                            children.delete(familyKey);
                        }
                        await saveMarriages();
                        await saveChildren();
                        isInFamily = true;
                        familyDescription = `${user.user.tag} has left their marriage with ${spouse ? spouse.user.tag : 'their spouse'}.`;
                    }

                    for (const [familyKey, familyMembers] of children) {
                        if (familyMembers.includes(user.id)) {
                            const parentId = familyKey.split(':')[1];
                            const updatedFamily = familyMembers.filter(id => id !== user.id);
                            if (updatedFamily.length > 0) {
                                children.set(familyKey, updatedFamily);
                            } else {
                                children.delete(familyKey);
                            }
                            await saveChildren();
                            isInFamily = true;
                            const parent = await interaction.guild.members.fetch(parentId).catch(() => null);
                            familyDescription += `\n${user.user.tag} has left ${parent ? parent.user.tag : 'their parent'}'s family.`;
                            break;
                        }
                    }

                    const betrayEmbed = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('💔 Betrayal Confirmed')
                        .setDescription(isInFamily ? familyDescription : 'You are not in any family!')
                        .setTimestamp()
                        .setFooter(embedConfig.footer);
                    await interaction.update({ embeds: [betrayEmbed], components: [] });
                    console.log(`Betrayal confirmed by ${userId}: ${familyDescription}`);
                } else if (action === 'cancel') {
                    const cancelEmbed = new EmbedBuilder()
                        .setColor('#00FF00')
                        .setTitle('🚫 Betrayal Cancelled')
                        .setDescription(`${interaction.user.tag} decided to stay in their family.`)
                        .setTimestamp()
                        .setFooter(embedConfig.footer);
                    await interaction.update({ embeds: [cancelEmbed], components: [] });
                    console.log(`Betrayal cancelled by ${userId}`);
                }
            }
            // Handle divorce buttons
            else if (interaction.customId.startsWith('divorce_')) {
                const [_, action, requesterId, spouseId] = interaction.customId.split('_');
                if (interaction.user.id !== spouseId) {
                    return interaction.reply({ content: 'This divorce request is not for you!', flags: 64 });
                }
                const requester = await interaction.guild.members.fetch(requesterId).catch(() => null);
                const spouse = interaction.member;
                const marriageRole = interaction.guild.roles.cache.get(MARRIAGE_ROLE_ID);
                if (!requester || !spouse || !marriageRole) {
                    return interaction.reply({ content: 'Error: Invalid users or marriage role not found!', flags: 64 });
                }
                if (action === 'accept') {
                    const marriageKey1 = `${interaction.guild.id}:${requester.id}`;
                    const marriageKey2 = `${interaction.guild.id}:${spouse.id}`;
                    marriages.delete(marriageKey1);
                    marriages.delete(marriageKey2);
                    await saveMarriages();
                    if (marriageRole && requester.roles.cache.has(MARRIAGE_ROLE_ID)) {
                        await requester.roles.remove(marriageRole);
                    }
                    if (marriageRole && spouse.roles.cache.has(MARRIAGE_ROLE_ID)) {
                        await spouse.roles.remove(marriageRole);
                    }
                    const familyKey1 = `${interaction.guild.id}:${requester.id}`;
                    const familyKey2 = `${interaction.guild.id}:${spouse.id}`;
                    children.delete(familyKey1);
                    children.delete(familyKey2);
                    await saveChildren();
                    const divorceEmbed = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('💔 Divorce Accepted')
                        .setDescription(`${spouse.user.tag} has accepted ${requester.user.tag}'s divorce request. The marriage is over, and any children are no longer part of the family.`)
                        .setTimestamp()
                        .setFooter(embedConfig.footer);
                    await interaction.update({ embeds: [divorceEmbed], components: [] });
                    console.log(`Divorce accepted between ${requester.user.tag} and ${spouse.user.tag}`);
                } else if (action === 'reject') {
                    const rejectEmbed = new EmbedBuilder()
                        .setColor('#00FF00')
                        .setTitle('🚫 Divorce Rejected')
                        .setDescription(`${spouse.user.tag} has rejected ${requester.user.tag}'s divorce request.`)
                        .setTimestamp()
                        .setFooter(embedConfig.footer);
                    await interaction.update({ embeds: [rejectEmbed], components: [] });
                    console.log(`Divorce rejected by ${spouse.user.tag} for ${requester.user.tag}`);
                }
            }
            // Handle clan leader switch buttons
            else if (interaction.customId.startsWith('switch_leader_')) {
                const [_, __, action, clanKey, newLeaderId] = interaction.customId.split('_');
                if (interaction.user.id !== newLeaderId) {
                    return interaction.reply({ content: 'This action is not for you!', flags: 64 });
                }

                const clan = clans.get(clanKey);
                if (!clan) {
                    console.error(`Clan not found for clanKey: ${clanKey}`);
                    return interaction.reply({ content: 'Clan not found!', flags: 64 });
                }

                const leaderRole = interaction.guild.roles.cache.get(CLAN_LEADER_ROLE_ID);
                const newLeader = interaction.member;
                if (!leaderRole || !newLeader) {
                    console.error(`Invalid roles or users: leaderRole=${leaderRole}, newLeader=${newLeader}`);
                    return interaction.reply({ content: 'Error: Invalid roles or users!', flags: 64 });
                }

                if (action === 'accept') {
                    const oldLeader = await interaction.guild.members.fetch(clan.leaderId).catch(() => null);
                    clan.leaderId = newLeaderId;
                    clans.set(clanKey, clan);
                    await saveClans();
                    if (oldLeader && oldLeader.roles.cache.has(CLAN_LEADER_ROLE_ID)) {
                        await oldLeader.roles.remove(leaderRole);
                    }
                    await newLeader.roles.add(leaderRole);
                    const acceptEmbed = new EmbedBuilder()
                        .setColor('#00FF00')
                        .setTitle('<a:crown:1393099418882015276> Leadership Transferred')
                        .setDescription(`${newLeader.user.tag} is now the leader of ${clan.name}!`)
                        .setTimestamp()
                        .setFooter(embedConfig.footer);
                    await interaction.update({ embeds: [acceptEmbed], components: [] });
                    console.log(`Leadership transferred to ${newLeader.user.tag} for clan ${clan.name}`);
                } else if (action === 'reject') {
                    const rejectEmbed = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('Leadership Transfer Rejected <a:red_deku:1391537079795712092>')
                        .setDescription(`${newLeader.user.tag} has rejected the leadership of ${clan.name}.`)
                        .setTimestamp()
                        .setFooter(embedConfig.footer);
                    await interaction.update({ embeds: [rejectEmbed], components: [] });
                    console.log(`Leadership transfer rejected by ${newLeader.user.tag} for clan ${clan.name}`);
                }
            }
            // Handle leave clan buttons
            else if (interaction.customId.startsWith('leave_clan_')) {
                const [_, __, action, clanKey, userId] = interaction.customId.split('_');
                if (interaction.user.id !== userId) {
                    return interaction.reply({ content: 'This action is not for you!', flags: 64 });
                }

                const clan = clans.get(clanKey);
                if (!clan) {
                    console.error(`Clan not found for clanKey: ${clanKey}`);
                    return interaction.reply({ content: 'Clan not found!', flags: 64 });
                }

                const clanRole = interaction.guild.roles.cache.get(clan.roleId);
                if (!clanRole) {
                    console.error(`Clan role not found for roleId: ${clan.roleId}`);
                    return interaction.reply({ content: 'Clan role not found!', flags: 64 });
                }

                if (action === 'confirm') {
                    clan.members = clan.members.filter(id => id !== userId);
                    clan.coLeaders = clan.coLeaders.filter(id => id !== userId);

                    if (clan.leaderId === userId) {
                        const leaderRole = interaction.guild.roles.cache.get(CLAN_LEADER_ROLE_ID);
                        if (leaderRole) {
                            await interaction.member.roles.remove(leaderRole).catch(error => {
                                console.error(`Error removing leader role from ${userId}:`, error);
                            });
                        }
                        clan.leaderId = null;
                    } else {
                        await interaction.member.roles.remove(clanRole).catch(error => {
                            console.error(`Error removing clan role from ${userId}:`, error);
                        });
                        const coLeaderRole = interaction.guild.roles.cache.get(CLAN_COLEADER_ROLE_ID);
                        if (coLeaderRole && interaction.member.roles.cache.has(CLAN_COLEADER_ROLE_ID)) {
                            await interaction.member.roles.remove(coLeaderRole).catch(error => {
                                console.error(`Error removing co-leader role from ${userId}:`, error);
                            });
                        }
                    }

                    clans.set(clanKey, clan);
                    await saveClans();
                    const leaveEmbed = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('🚪 Left Clan')
                        .setDescription(`${interaction.user.tag} has left ${clan.name}.`)
                        .setTimestamp()
                        .setFooter(embedConfig.footer);
                    await interaction.update({ embeds: [leaveEmbed], components: [] });
                    console.log(`User ${userId} left clan ${clan.name}`);
                } else if (action === 'cancel') {
                    const cancelEmbed = new EmbedBuilder()
                        .setColor('#00FF00')
                        .setTitle('🚫 Leave Cancelled')
                        .setDescription(`${interaction.user.tag} decided to stay in ${clan.name}.`)
                        .setTimestamp()
                        .setFooter(embedConfig.footer);
                    await interaction.update({ embeds: [cancelEmbed], components: [] });
                    console.log(`User ${userId} cancelled leaving clan ${clan.name}`);
                }
            }
        }
        // Handle modal submissions
        else if (interaction.isModalSubmit()) {
            // Handle ticket modal submission
            if (interaction.customId.startsWith('ticket_modal_')) {
                await interaction.deferReply({ ephemeral: true }); // Defer reply to avoid interaction timeout
                const userId = interaction.customId.split('_')[2];
                if (interaction.user.id !== userId) {
                    return interaction.editReply({ content: 'This modal is not for you!', flags: 64 });
                }

                const reason = interaction.fields.getTextInputValue('ticket_reason');
                const ticketCategoryId = await ensureTicketCategory(interaction.guild);
                const ticketChannel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}-${Math.floor(Math.random() * 1000)}`,
                    type: ChannelType.GuildText,
                    parent: ticketCategoryId,
                    permissionOverwrites: [
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                        },
                        {
                            id: TICKET_ADMIN_ROLE_ID,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                        },
                        {
                            id: interaction.guild.id,
                            deny:  [PermissionFlagsBits.ViewChannel],
                        },
                    ],
                });

                tickets.set(ticketChannel.id, {
                    ownerId: interaction.user.id,
                    reason: reason,
                    createdAt: Date.now(),
                });
                await saveTickets();

                const ticketOpenEmbed = new EmbedBuilder()
                    .setColor('#3B1108')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                    .setTitle('<:ticket_support:1468513281194070162> Ticket Opened')
                    .setDescription(`***Welcome to your ticket,*** <@${interaction.user.id}>!\n **Reason:** ${reason}\n **Our team will assist you soon. **`)
                    .setImage("https://media.discordapp.net/attachments/1045375385027756062/1407773061364711464/Gif_for_edit.gif?ex=68a75254&is=68a600d4&hm=2eb2748fcd27b49842344faabd218a40126ecd7a0db4bf62b2700bd584e60eae&=");

                const closeButton = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`close_ticket_${ticketChannel.id}`)
                            .setLabel('Close Ticket')
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji('<:black_lock:1393519644111011911>')
                    );

                await ticketChannel.send({ content: `<@&${TICKET_ADMIN_ROLE_ID}>`, embeds: [ticketOpenEmbed], components: [closeButton] });
                await interaction.editReply({ content: `Your ticket has been created: <#${ticketChannel.id}>`, flags: 64 });
                console.log(`Ticket created for user ${userId} with reason: ${reason}`);
            }
            // Handle live stream modal submission
            else if (interaction.customId.startsWith('live_stream_modal_')) {
                await interaction.deferReply({ ephemeral: true }); // Defer reply to avoid interaction timeout
                const userId = interaction.customId.split('_')[3];
                if (interaction.user.id !== userId) {
                    return interaction.editReply({ content: 'This modal is not for you!', flags: 64 });
                }

                const streamLink = interaction.fields.getTextInputValue('stream_link');
                const liveChannelId = await ensureLiveChannel(interaction.guild);
                const liveChannel = interaction.guild.channels.cache.get(liveChannelId);
                if (!liveChannel || !liveChannel.isTextBased()) {
                    return interaction.editReply({
                        embeds: [errorEmbed('Channel Error', 'Live channel not found or is not a text channel!')],
                        flags: 64
                    });
                }

                const liveEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('🔴 Live Stream!')
                    .setDescription(`${interaction.user.tag} is now live!\nWatch here: ${streamLink}`)
                    .setImage("https://images-ext-1.discordapp.net/external/KKeFK-5KUUv-_hjubTwpQpn780TaaQOGXz6DiM20iRs/https/images-ext-1.discordapp.net/external/sVtsl_iaWgrdN9mCrYKMOP5CB6NjH2MjdHzXZAyTupY/https/media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTNuaGE5ODIyNjNyc2t5Z2NsNWV3bXRldHkyNXE1ZTZkYTlxbmZkayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mWnDeIKilkwDcrM2VT/giphy.gif")
                    .setTimestamp()
                    .setFooter(embedConfig.footer);

                await liveChannel.send(`@everyone  \n \n <:wifi3:1396524900876947666> **Live Stream!** \n <@${interaction.user.id}> ***is now live!*** \n **Watch here:** ${streamLink} \n` );
                await interaction.editReply({
                    embeds: [successEmbed('Stream Shared', 'Your stream link has been shared successfully!')],
                    flags: 64
                });
                console.log(`Live stream link shared by ${userId}: ${streamLink}`);
            }
        }
    } catch (error) {
        console.error('Error handling interaction:', error);
        let errorMessage = 'An error occurred while processing your request. Please try again later.';
        if (error.code === 10003) {
            errorMessage = 'The target channel does not exist or the bot lacks access. Please contact an admin.';
        } else if (error.code === 10062) {
            errorMessage = 'This interaction has expired. Please try again.';
        } else if (error.code === 40060) {
            errorMessage = 'This interaction has already been processed. Please try again.';
        }

        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: errorMessage,
                flags: 64
            }).catch(err => console.error('Failed to send error reply:', err));
        } else {
            await interaction.editReply({
                content: errorMessage,
                flags: 64
            }).catch(err => console.error('Failed to send follow-up:', err));
        }
    }
});


            

            // Text-based command handler
            client.on('messageCreate', async (message) => {



              
             
                if (message.author.bot) return;

               
                if(message.content ==='dora'){
                    message.reply("https://media.discordapp.net/attachments/1046424593067429968/1397418387155456041/National_Panda_Day_GIF.gif?ex=6881a6ca&is=6880554a&hm=297753fe2d072aea2b277d99b2306df46bab37c2764b9d115536563eda5157dd&=")
                }

                if (message.content.startsWith(textPrefix)) {
                    const args = message.content.slice(textPrefix.length).trim().split(/ +/);
                    const command = args.shift().toLowerCase();

                    const successEmbed = (title, description) => new EmbedBuilder()
                        .setColor('#00fffb')
                        .setDescription(`***${description}*** <a:verif:1468510562760790083>`)

                    const errorEmbed = (title, description) => new EmbedBuilder()
                        .setColor('#000000')
                        .setDescription(`***${description}*** <:system:1455612233093615891>`)


                    
                    
                    
                    const textCommands = {
                async ticket() {
                    if (!message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.roles.cache.has(TICKET_ADMIN_ROLE_ID)) {
                        return message.reply({ embeds: [errorEmbed('Permission Denied', 'You need Administrator permissions or the Ticket Admin role to use this command!')] });
                    }

                    const ticketChannel = message.guild.channels.cache.get(TICKET_CHANNEL_ID);
                    if (!ticketChannel || !ticketChannel.isTextBased()) {
                        return message.reply({ embeds: [errorEmbed('Channel Not Found', 'Ticket channel not found or is not a text channel!')] });
                    }

                    const ticketEmbed = new EmbedBuilder()
                        .setColor('#3B1108')
                        .setTitle('<:ticket_support:1468513281194070162> ***Ticket System***')
                        .setDescription('**Click the button below to open a ticket**')
                        .setImage("https://media.discordapp.net/attachments/1045375385027756062/1407769891544498187/download_4.gif?ex=68a74f61&is=68a5fde1&hm=55b3291018a72a57c42bed464b3b89ad9057191d478d5852328f07a100efc576&=");

                    const ticketButton = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('open_ticket')
                                .setLabel('Open Ticket')
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji('<:ticket_support:1468513281194070162>')
                        );

                    await ticketChannel.send({ embeds: [ticketEmbed], components: [ticketButton] });
                    await message.reply({ embeds: [successEmbed('Ticket Panel Created', 'Ticket panel has been created successfully!')] });
                },
                  async giveallrole(args) {
                    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
                        return message.reply({ embeds: [errorEmbed('Permission Denied', 'You need Administrator permissions to use this command!')] });
                    }
                    
                    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
                        return message.reply({ embeds: [errorEmbed('Bot Permission', 'I lack Manage Roles permission! Check my roles.')] });
                    }
                    
                    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]?.replace(/[<@&>]/g, ''));
                    
                    if (!role) {
                        return message.reply({ embeds: [errorEmbed('Invalid Input', 'Please specify a role by mention or ID! Usage: $giveallrole <role>')] });
                    }
                    
                    if (!role.editable) {
                        return message.reply({ embeds: [errorEmbed('Role Hierarchy', 'I cannot manage this role due to hierarchy or permissions!')] });
                    }
                    
                    try {
                        await message.reply({ embeds: [successEmbed('Process Started', `Giving <@&${role.id}> to all members... This may take a while.`)] });
                        
                        const members = await message.guild.members.fetch();
                        let successCount = 0;
                        let failCount = 0;
                        
                        for (const [, member] of members) {
                            if (member.user.bot) continue;
                            
                            if (!member.roles.cache.has(role.id)) {
                                await member.roles.add(role).catch(() => {
                                    failCount++;
                                });
                                successCount++;
                            }
                        }
                        
                        await message.channel.send({ embeds: [successEmbed('Completed', `Successfully gave <@&${role.id}> to ${successCount} members. Failed: ${failCount}`)] });
                    } catch (error) {
                        console.error('Error in giveallrole:', error);
                        await message.reply({ embeds: [errorEmbed('Operation Failed', 'Failed to give role to all members! Check my permissions or role hierarchy.')] });
                    }
                },
                async senddm(args) {
                    if (message.author.id !== ALLOWED_USER_ID) {
                        return message.reply({ embeds: [errorEmbed('Permission Denied', 'Only the owner can use this command!')] });
                    }
                    
                    if (args.length < 1) {
                        return message.reply({ embeds: [errorEmbed('Invalid Input', 'Usage: $senddm <message>')] });
                    }
                    
                    const dmMessage = args.join(' ');
                    
                    try {
                        await message.reply({ embeds: [successEmbed('DM Sending', 'Starting to send DMs to all members...')] });
                        
                        const members = await message.guild.members.fetch();
                        let successCount = 0;
                        let failCount = 0;
                        
                        for (const [, member] of members) {
                            if (member.user.bot) continue;
                            
                            try {
                                const dmEmbed = new EmbedBuilder()
                                    .setColor('#00fffb')
                                    .setTitle(`Message from ${message.guild.name}`)
                                    .setDescription(dmMessage)
                                    .setTimestamp()
                                    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() });
                                
                                await member.send({ embeds: [dmEmbed] });
                                successCount++;
                            } catch (error) {
                                failCount++;
                                console.error(`Failed to DM ${member.user.tag}:`, error);
                            }
                        }
                        
                        await message.channel.send({ 
                            embeds: [successEmbed('DM Campaign Complete', `Successfully sent to ${successCount} members. Failed: ${failCount}`)] 
                        });
                    } catch (error) {
                        console.error('Error in senddm command:', error);
                        await message.reply({ embeds: [errorEmbed('Operation Failed', 'Failed to send DMs! Check permissions.')] });
                    }
                },
async valoclaim() {
    // Only owner or staff can send the panel
    if (message.author.id !== ALLOWED_USER_ID && !message.member.roles.cache.has(STAFF_ROLE_ID)) {
        return message.reply({ embeds: [errorEmbed('Permission Denied', 'Only staff or owner can send the Valorant panel!')] });
    }

    const remaining = valoAccounts.length;

    const claimEmbed = new EmbedBuilder()
        .setColor('#FF4654') // Valorant red color
        .setTitle('🎮 Valorant Account Giveaway')
        .setDescription(
            '**Thank you for boosting our server!** 🔥\n' +
            'As a booster, you can claim **one free Valorant account**.\n\n' +
            `**Remaining accounts:** ${remaining}\n` +
            'Click the button below to claim (one time only).'
        )
        .setThumbnail('https://cdn.discordapp.com/attachments/123456789/valorant-logo.png') // optional: add Valorant logo
        .setImage('https://media.valorant-api.com/sprays/animated/valorant-spray.gif') // optional cool gif
        .setTimestamp()
        .setFooter(embedConfig.footer);

    const button = new ButtonBuilder()
        .setCustomId('claim_valorant_account')
        .setLabel('Claim Valorant Account')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🔫')
        .setDisabled(remaining === 0);

    const row = new ActionRowBuilder().addComponents(button);

    await message.channel.send({ embeds: [claimEmbed], components: [row] });
    await message.reply({ embeds: [successEmbed('Valorant Panel Sent', 'The Valorant claim panel is now live!')] })
        .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
},
    async close() {
        const ticketContext = getOrCreateTicketData(message.channel);
        if (!ticketContext) {
            return message.reply({ embeds: [errorEmbed('Invalid Channel', 'This channel is not a ticket!')] });
        }

        const { data: ticketData } = ticketContext;
        if (message.author.id !== ticketData.ownerId && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.roles.cache.has(TICKET_ADMIN_ROLE_ID)) {
            return message.reply({ embeds: [errorEmbed('Permission Denied', 'You can only close your own ticket or need Administrator/Ticket Admin permissions!')] });
        }

        const closeEmbed = new EmbedBuilder()
            .setColor('#3B1108')
            .setTitle('<:ticket_support:1468513281194070162> **Close Ticket**')
            .setDescription('***Are you sure you want to close this ticket?***')
          

        const closeButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`close_ticket_${message.channel.id}`)
                    .setLabel('Confirm Close')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('<:black_lock:1393519644111011911>'),
                new ButtonBuilder()
                    .setCustomId(`cancel_close_${message.channel.id}`)
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('<:Black_List:1393901495103127563>')
            );

        await message.reply({ embeds: [closeEmbed], components: [closeButtons] });
    },

    async claim() {
        if (!message.guild || !message.member) {
  return message.reply('this is work just in the server');
}

        const isAdmin =
  message.member.roles?.cache?.has(TICKET_ADMIN_ROLE_ID) ||
  message.member.permissions?.has(PermissionFlagsBits.Administrator);

if (!isAdmin) {
  return message.reply('u dont have permission to use this command');
}


        const ticketContext = getOrCreateTicketData(message.channel);
        if (!ticketContext) {
            return message.reply({ embeds: [errorEmbed('Invalid Channel', 'This channel is not a ticket!')] });
        }

        const { data: ticketData } = ticketContext;
        if (ticketData.claimedBy) {
            return message.reply({ embeds: [errorEmbed('Ticket Already Claimed', `This ticket is already claimed by <@${ticketData.claimedBy}>!`)] });
        }

        try {
            const ticketChannel = message.channel;
            const ticketAdminRole = message.guild.roles.cache.get(TICKET_ADMIN_ROLE_ID);
            if (!ticketAdminRole) {
                return message.reply({ embeds: [errorEmbed('Role Not Found', 'Ticket Admin role not found! Check TICKET_ADMIN_ROLE_ID.')] });
            }

            await ticketChannel.permissionOverwrites.edit(ticketAdminRole, {
                SendMessages: false,
                ViewChannel: true,
            });

            await ticketChannel.permissionOverwrites.edit(message.author.id, {
                SendMessages: true,
                ViewChannel: true,
                ReadMessageHistory: true,
            });

            ticketData.claimedBy = message.author.id;
            tickets.set(message.channel.id, ticketData);
            await saveTickets();

            const claimKey = `${message.guild.id}:${message.author.id}`;
            const currentCount = ticketClaims.get(claimKey) || 0;
            ticketClaims.set(claimKey, currentCount + 1);
            await saveTicketClaims();

            const claimEmbed = new EmbedBuilder()
                .setColor('#3B1108')
                .setTitle('<:ticket_support:1468513281194070162> **Ticket Claimed**')
                .setDescription(`**This ticket has been claimed by ** ***<@${message.author.id}>***.`)


            await message.reply({ embeds: [claimEmbed] });
        } catch (error) {
            console.error('Error claiming ticket:', error);
            await message.reply({ embeds: [errorEmbed('Claim Failed', 'Failed to claim the ticket! Check permissions or channel settings.')] });
        }
    },
    async unclaim() {
    // Check if the channel is a valid ticket
    const ticketContext = getOrCreateTicketData(message.channel);
    if (!ticketContext) {
        return message.reply({
            embeds: [
                errorEmbed('Invalid Channel', 'This channel is not a ticket!')
            ]
        });
    }

    const { data: ticketData } = ticketContext;

    // Check if the command executor has admin or ticket admin role
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.roles.cache.has(TICKET_ADMIN_ROLE_ID)) {
        return message.reply({
            embeds: [
                errorEmbed('Permission Denied', 'You need Permision to unclaim a ticket!')
            ]
        });
    }

    // Check if the ticket is claimed
    if (!ticketData.claimedBy) {
        return message.reply({
            embeds: [
                errorEmbed('Ticket Not Claimed', 'This ticket is not claimed by anyone!')
            ]
        });
    }

    // Check if the command executor is the claimer or has Administrator permissions
    if (ticketData.claimedBy !== message.author.id && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return message.reply({
            embeds: [
                errorEmbed('Permission Denied', `You can only unclaim your own ticket `)
            ]
        });
    }

    try {
        const ticketChannel = message.channel;
        const ticketAdminRole = message.guild.roles.cache.get(TICKET_ADMIN_ROLE_ID);
        if (!ticketAdminRole) {
            return message.reply({
                embeds: [
                    errorEmbed('Role Not Found', 'role Error')
                ]
            });
        }

        // Restore permissions for Ticket Admin role
        await ticketChannel.permissionOverwrites.edit(ticketAdminRole, {
            SendMessages: true,
            ViewChannel: true,
            ReadMessageHistory: true
        });

        // Remove permissions for the claimer
        await ticketChannel.permissionOverwrites.delete(ticketData.claimedBy, 'Unclaimed ticket');

        // Update ticket data
        const claimerId = ticketData.claimedBy;
        ticketData.claimedBy = null;
        tickets.set(message.channel.id, ticketData);
        await saveTickets();

        // Decrease the claim count
        const claimKey = `${message.guild.id}:${claimerId}`;
        const currentCount = ticketClaims.get(claimKey) || 0;
        if (currentCount > 0) {
            ticketClaims.set(claimKey, currentCount - 1);
            await saveTicketClaims();
        }

        // Send confirmation message
        await message.reply({
            embeds: [
                successEmbed('Ticket Unclaimed', `YThe ticket has been unclaimed successfully!`)
            ]
        });

        console.log(`Ticket ${message.channel.id} unclaimed by ${message.author.id}`);
    } catch (error) {
        console.error('Error unclaiming ticket:', error);
        await message.reply({
            embeds: [
                errorEmbed('Unclaim Failed', 'An error occurred while unclaiming the ticket! Check permissions or channel settings.')
            ]
        });
    }
},

    async topticket() {
        if (!message.member.roles.cache.has(TICKET_ADMIN_ROLE_ID) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply({ embeds: [errorEmbed('Permission Denied', 'You need the Ticket Admin role or Administrator permission to use this command!')] });
        }

        const ticketClaimList = Array.from(ticketClaims.entries())
            .map(([key, count]) => {
                const [, userId] = key.split(':');
                return { id: userId, count };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        const description = ticketClaimList.length > 0
            ? ticketClaimList.map((t, i) => {
                const member = message.guild.members.cache.get(t.id);
                return `**${i + 1}** . <@${member ? member.user.id : 'Unknown User'}>  ~  **${t.count} tickets claimed**`;
            }).join('\n \n')
            : 'No tickets claimed yet.';

        const topTicketEmbed = new EmbedBuilder()
            .setColor('#00fffb')
            .setTitle(`<a:crown_blue:1455639142250578093> **Top 10 Ticket Claimers** <a:crown_blue:1455639142250578093>`)
            .setDescription(description)
            .setTimestamp()
            .setThumbnail("https://media.discordapp.net/attachments/1070521912981205023/1394229102562508880/Championship_Cup.gif?ex=68760c89&is=6874bb09&hm=c4b4ee3008a5ea4d5a523da43f6e7d7bd0669dc70c496634ccea8c756ba7a873&=")
            .setFooter(embedConfig.footer);

        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('top_prev')
                    .setEmoji('<a:Leftarrow:1393563638396227644>')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('top_next')
                    .setEmoji('<a:beast_right_arrow:1393563629445451879>')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true)
            );

        await message.reply({ embeds: [topTicketEmbed], components: [buttonRow] });
    },
    async addtk() {
    // Check if the command has a user ID argument
    if (args.length < 1) {
        return message.reply({
            embeds: [
                errorEmbed('Command Error', 'Please specify a user ID using `$addtk <user id>`')
            ]
        });
    }

    // Check if the channel is a valid ticket
    if (!tickets.has(message.channel.id)) {
        return message.reply({
            embeds: [
                errorEmbed('Invalid Channel', 'This channel is not a ticket!')
            ]
        });
    }

    // Check if the command executor has admin or ticket admin role
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.roles.cache.has(TICKET_ADMIN_ROLE_ID)) {
        return message.reply({
            embeds: [
                errorEmbed('Permission Denied', 'You need <@&1397727664894382231> to add users!')
            ]
        });
    }

    const userId = args[0].replace(/[<@!>]*/g, ''); // Clean user ID from mentions

    try {
        // Fetch the user to add
        const userToAdd = await message.guild.members.fetch(userId);
        if (!userToAdd) {
            return message.reply({
                embeds: [
                    errorEmbed('User Not Found', 'No user found with the provided ID!')
                ]
            });
        }

        // Check if the user is already added to the ticket
        const channel = message.channel;
        const overwrite = channel.permissionOverwrites.cache.get(userId);
        if (overwrite && overwrite.allow.has(PermissionsBitField.Flags.ViewChannel)) {
            return message.reply({
                embeds: [
                    errorEmbed('User Already Added', `The user <@${userId}> is already added to this ticket!`)
                ]
            });
        }

        // Add the user to the ticket by updating channel permissions
        await channel.permissionOverwrites.edit(userId, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true
        });

        // Send confirmation message
        await message.reply({
            embeds: [
                successEmbed('User Added Successfully', `The user <@${userId}> has been added to the ticket successfully!`)
            ]
        });

        console.log(`User ${userId} added to ticket ${message.channel.id} by ${message.author.id}`);
    } catch (error) {
        console.error('Error adding user to ticket:', error);
        await message.reply({
            embeds: [
                errorEmbed('Add Failed', 'An error occurred while adding the user to the ticket! Check the ID or permissions.')
            ]
        });
    }
},
async removetk() {
    // Check if the command has a user ID argument
    if (args.length < 1) {
        return message.reply({
            embeds: [
                errorEmbed('Command Error', 'Please specify a user ID using `$removetk <user id>`')
            ]
        });
    }

    // Check if the channel is a valid ticket
    if (!tickets.has(message.channel.id)) {
        return message.reply({
            embeds: [
                errorEmbed('Invalid Channel', 'This channel is not a ticket!')
            ]
        });
    }

    const ticketData = tickets.get(message.channel.id);

    // Check if the command executor has admin or ticket admin role
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.roles.cache.has(TICKET_ADMIN_ROLE_ID)) {
        return message.reply({
            embeds: [
                errorEmbed('Permission Denied', 'You need Administrator permissions or the Ticket Admin role to remove users!')
            ]
        });
    }

    const userId = args[0].replace(/[<@!>]*/g, ''); // Clean user ID from mentions

    try {
        // Fetch the user to remove
        const userToRemove = await message.guild.members.fetch(userId);
        if (!userToRemove) {
            return message.reply({
                embeds: [
                    errorEmbed('User Not Found', 'No user found with the provided ID!')
                ]
            });
        }

        // Prevent removing the ticket owner or the command executor
        if (userId === ticketData.ownerId) {
            return message.reply({
                embeds: [
                    errorEmbed('Invalid Action', 'You cannot remove the ticket owner!')
                ]
            });
        }
        if (userId === message.author.id) {
            return message.reply({
                embeds: [
                    errorEmbed('Invalid Action', 'You cannot remove yourself!')
                ]
            });
        }

        // Check if the user is already added to the ticket
        const channel = message.channel;
        const overwrite = channel.permissionOverwrites.cache.get(userId);
        if (!overwrite || !overwrite.allow.has(PermissionsBitField.Flags.ViewChannel)) {
            return message.reply({
                embeds: [
                    errorEmbed('User Not In Ticket', `The user <@${userId}> is not added to this ticket!`)
                ]
            });
        }

        // Remove the user from the ticket by deleting their permission overwrites
        await channel.permissionOverwrites.delete(userId, 'Removed user from ticket');

        // Send confirmation message
        await message.reply({
            embeds: [
                successEmbed('User Removed Successfully', `***The user <@${userId}> has been removed from the ticket successfully!***`)
            ]
        });

        console.log(`User ${userId} removed from ticket ${message.channel.id} by ${message.author.id}`);
    } catch (error) {
        console.error('Error removing user from ticket:', error);
        await message.reply({
            embeds: [
                errorEmbed('Remove Failed', 'An error occurred while removing the user from the ticket! Check the ID or permissions.')
            ]
        });
    }
},

                        async move(args) {
                             const server = message.guild;
                            const owner = await server.fetchOwner();
                            if (!message.member.voice.channel) {
                                return message.reply({ embeds: [errorEmbed('Voice Channel Required', 'You must be in a voice channel!')] });
                            }
                            const target = getMemberFromArgs(message, args);
                            if (!target) return message.reply({ embeds: [errorEmbed('User Not Found', 'The member was not found!')] });
                            await target.voice.setChannel(message.member.voice.channel);
                            await message.reply({ embeds: [successEmbed('Move Successful', `Moved ${target.user.tag} to ${message.member.voice.channel.name}`)] });
                        },

                        async giveaway(args) {
                            if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
                                return message.reply({ embeds: [errorEmbed('Permission Denied', 'You need Administrator permissions to start a giveaway!')] });
                            }
                            
                            if (args.length < 2) {
                                return message.reply({ embeds: [errorEmbed('Invalid Input', 'Usage: $giveaway <prize> <duration with unit: 30m, 2h, 1d>')] });
                            }
                            
                            const prize = args.slice(0, -1).join(' ');
                            const durationArg = args[args.length - 1];
                            
                            // Parse duration (supports m, h, d)
                            let durationMs = 0;
                            let durationDisplay = '';
                            const match = durationArg.match(/^(\d+)([mhd])$/i);
                            
                            if (!match) {
                                return message.reply({ embeds: [errorEmbed('Invalid Duration', 'Please specify duration like 30m, 2h, or 1d (max 7d)!')] });
                            }
                            
                            const value = parseInt(match[1]);
                            const unit = match[2].toLowerCase();
                            
                            if (unit === 'm') {
                                if (value < 1 || value > 10080) return message.reply({ embeds: [errorEmbed('Invalid Duration', 'Minutes must be between 1 and 10080 (7 days)!')] });
                                durationMs = value * 60 * 1000;
                                durationDisplay = `${value} minutes`;
                            } else if (unit === 'h') {
                                if (value < 1 || value > 168) return message.reply({ embeds: [errorEmbed('Invalid Duration', 'Hours must be between 1 and 168 (7 days)!')] });
                                durationMs = value * 60 * 60 * 1000;
                                durationDisplay = `${value} hours`;
                            } else if (unit === 'd') {
                                if (value < 1 || value > 7) return message.reply({ embeds: [errorEmbed('Invalid Duration', 'Days must be between 1 and 7!')] });
                                durationMs = value * 24 * 60 * 60 * 1000;
                                durationDisplay = `${value} day(s)`;
                            }
                            
                            const giveawayEmbed = new EmbedBuilder()
                                .setColor('#FFD700')
                                .setTitle('<a:11pm_giveaway1:1456038974656352478> **GIVEAWAY** <a:11pm_giveaway1:1456038974656352478>')
                                .setDescription(`**Prize:** ${prize}\n\n**Click the button below to join!**`)
                                .addFields(
                                    { name: '<:timer:1432892237058150551> Duration', value: durationDisplay, inline: true },
                                    { name: '<:icon_member:1456027611066269727> Participants', value: '0', inline: true }
                                )
                                .setImage('https://media.giphy.com/media/3o6ZtpWQvBbPZ5VJd2/giphy.gif')
                                .setTimestamp()
                                .setFooter(embedConfig.footer);
                            
                            const joinButton = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId('giveaway_join')
                                    .setLabel('Join Giveaway')
                                    .setStyle(ButtonStyle.Success)
                                    .setEmoji('🎁')
                            );
                            
                            const giveawayMessage = await message.reply({ embeds: [giveawayEmbed], components: [joinButton] });
                            
                            const participants = new Set();
                            const endTime = Date.now() + durationMs;
                            
                            const collector = giveawayMessage.createMessageComponentCollector({
                                componentType: ComponentType.Button,
                                time: durationMs
                            });
                            
                            collector.on('collect', async (interaction) => {
                                if (interaction.customId === 'giveaway_join') {
                                    if (participants.has(interaction.user.id)) {
                                        return interaction.reply({ content: 'You are already joined in this giveaway!', ephemeral: true });
                                    }
                                    
                                    participants.add(interaction.user.id);
                                    
                                    const updatedEmbed = new EmbedBuilder()
                                        .setColor('#FFD700')
                                        .setTitle('<a:11pm_giveaway1:1456038974656352478> **GIVEAWAY** <a:11pm_giveaway1:1456038974656352478>')
                                        .setDescription(`**Prize:** ${prize}\n\n**Click the button below to join!**`)
                                        .addFields(
                                            { name: '<:timer:1432892237058150551> Duration', value: durationDisplay, inline: true },
                                            { name: '<:icon_member:1456027611066269727> Participants', value: `${participants.size}`, inline: true }
                                        )
                                        .setImage('https://media.giphy.com/media/3o6ZtpWQvBbPZ5VJd2/giphy.gif')
                                        .setTimestamp()
                                        .setFooter(embedConfig.footer);
                                    
                                    await giveawayMessage.edit({ embeds: [updatedEmbed] });
                                    
                                    await interaction.reply({ content: '***You have joined the giveaway! <a:verif:1468510562760790083>***', ephemeral: true });
                                }
                            });
                            
                            collector.on('end', async () => {
                                if (participants.size === 0) {
                                    const endEmbed = new EmbedBuilder()
                                        .setColor('#FF0000')
                                        .setTitle('❌ Giveaway Ended')
                                        .setDescription('No one joined the giveaway!')
                                        .setTimestamp()
                                        .setFooter(embedConfig.footer);
                                    
                                    await giveawayMessage.edit({ embeds: [endEmbed], components: [] });
                                    return;
                                }
                                
                                const participantArray = Array.from(participants);
                                const winner = participantArray[Math.floor(Math.random() * participantArray.length)];
                                const winnerUser = await client.users.fetch(winner).catch(() => null);
                                
                                const winnerEmbed = new EmbedBuilder()
                                    .setColor('#52251D')
                                    .setTitle('<a:11pm_giveaway1:1456038974656352478> **GIVEAWAY WINNER** <a:11pm_giveaway1:1456038974656352478>')
                                    .setDescription(`**Prize:** ${prize}\n\n**Winner:** <@${winner}>`)
                                    .addFields(
                                        { name: '<:icon_member:1456027611066269727> Total Participants', value: `${participants.size}`, inline: true },
                                        { name: '<:Gold_Award:1456038270076190844> Winner', value: `<@${winner}>`, inline: true }
                                    )
                                    .setImage('https://media.giphy.com/media/xTiTnr9FYeD5JM9h2E/giphy.gif')
                                    .setTimestamp()
                                    .setFooter(embedConfig.footer);
                                
                                await giveawayMessage.edit({ embeds: [winnerEmbed], components: [] });
                                
                                try {
                                    await winnerUser.send({ embeds: [
                                        new EmbedBuilder()
                                            .setColor('#52251D')
                                            .setTitle('<a:redutilityjc:1455639241555185664> You Won a Giveaway!  <a:redutilityjc:1455639241555185664>')
                                            .setDescription(`Congratulations! You won **${prize}** in ${message.guild.name}!\n\nPlease contact the moderators to claim your prize.`)
                                            .setTimestamp()
                                    ] });
                                } catch (error) {
                                    console.log(`Could not DM winner ${winnerUser?.tag}`);
                                }
                                
                                await message.channel.send({ content: `🎉 Congratulations <@${winner}>! You won the giveaway for **${prize}**!` });
                            });
                        },
                        async server() {
                            const serverEmbed = new EmbedBuilder()
                                .setColor('#000000')
                                .setTitle(`<a:arow1:1455595655929139465> Server Info: **${message.guild.name}**`)
                                .setThumbnail(message.guild.iconURL())
                                .addFields(
                                    { name: '<:icon_member:1456027611066269727> Members', value: `${message.guild.memberCount}`, inline: true },
                                    { name: '<a:create:1456027613746430094> Created', value: `${message.guild.createdAt.toDateString()}`, inline: true },
                                    { name: '<a:crown_blue:1455639142250578093> Owner', value: `<@${message.guild.ownerId}>`, inline: true },
                                    { name: '<a:carregando2:1456027616267075657> Region', value: `${message.guild.preferredLocale}`, inline: true },
                                    { name: '<a:Logo_Boosts:1456027619186184359> Boosts', value: `${message.guild.premiumSubscriptionCount || 0}`, inline: true },
                                    { name: '<a:emoji_1:1456028035080786032> Emojis', value: `${message.guild.emojis.cache.size}`, inline: true },
                                    { name: '<:58778verifiedroleicon:1456027621954551981> Roles', value: `${message.guild.roles.cache.size}`, inline: true },

                                
                                    
                                )
                                .setImage(message.guild.banner ? message.guild.bannerURL({ dynamic: true }) : null)
                                .setFooter(embedConfig.footer);
                            await message.reply({ embeds: [serverEmbed] });
                        },
                        async user(args) {
                            const userTarget = message.mentions.users.first() || message.author;
                            if (args.length > 0) {
                                const userId = args[0].replace(/[<@!>]/g, '');
                                userTarget = await client.users.fetch(userId).catch(() => null) || userTarget;
                            }
                            const member = message.guild.members.cache.get(userTarget.id);
                            const userEmbed = new EmbedBuilder()
                                .setColor('#00fffb')
                                .setTitle(`<:User_ID:1392700011497918606>  User Info: <@${userTarget.id}>`)
                                .setThumbnail(userTarget.displayAvatarURL())
                                .addFields(
                                    { name: '<:_Gif_Perk_1387871916785930300:1391906729985441902> ID', value: `${userTarget.id}`, inline: true },
                                    { name: '<:join:1392699508827095120> Joined', value: `${member.joinedAt.toDateString()}`, inline: true },
                                    { name: '<a:create:1392699682798436452> Created', value: `${userTarget.createdAt.toDateString()}`, inline: true }
                                )
                                .setImage("https://media.discordapp.net/attachments/1070521912981205023/1392695661539102870/studio_ghibli_GIF.gif?ex=68707868&is=686f26e8&hm=ba4e9e7d53922effc7e978d126fb078495ba98bf56cc3d51b025a69b955b4846&=")
                                .setTimestamp()
                                .setFooter(embedConfig.footer);
                            await message.reply({ embeds: [userEmbed] });
                        },
                        async avatar(args) {
                            const avatarTarget = message.mentions.users.first() || message.author;
                            if (args.length > 0) {
                                const userId = args[0].replace(/[<@!>]/g, '');
                                avatarTarget = await client.users.fetch(userId).catch(() => null) || avatarTarget;
                            }
                            const avatarEmbed = new EmbedBuilder()
                                .setColor('#00fffb')
                                .setTitle(` Avatar <a:avatar_83150:1392698619530051696> : ${avatarTarget.tag}   <a:arow1:1455595655929139465> `)
                                .setImage(avatarTarget.displayAvatarURL({ size: 1024 }))
                                .setTimestamp()
                                .setFooter(embedConfig.footer);
                            await message.reply({ embeds: [avatarEmbed] });
                        },
                        async stats() {
                            const memberCount = message.guild.memberCount;
                            const boostCount = message.guild.premiumSubscriptionCount || 0;
                            const voiceChannels = message.guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice);
                            let voiceCount = 0;
                            for (const channel of voiceChannels.values()) {
                                voiceCount += channel.members.size;
                            }
                            const embed = new EmbedBuilder()
                                .setColor('#453927')
                                .setTitle('***Server Statistics***')
                                .setThumbnail(message.guild.iconURL({ size: 1024 }))
                                .addFields(
                                    { name: '<:member_black:1407741948839858227> **Members**', value: `${memberCount}`, inline: false },
                                    { name: '<a:Logo_Boosts:1393756287887609877> **Boosts**', value: `${boostCount}`, inline: false },
                                    { name: '<:volume:1393525855220928664> **Voice**', value: `${voiceCount}`, inline: false }
                                )
                                .setImage(message.guild.bannerURL({ size: 1024 }) || 'No banner available')
                                
                                
                            await message.reply({ embeds: [embed] });
                        },
                       
                        async msh(args) {
            if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply({ embeds: [errorEmbed('Permission Denied', 'You need Manage Messages permission!')] });
            }
            const amount = parseInt(args[0]);
            if (isNaN(amount) || amount < 1 || amount > 100) {
            return message.reply({ embeds: [errorEmbed('Invalid Input', 'Please specify a number between 1 and 100!')] });
            }
            if (message.channel.type !== ChannelType.GuildText) {
            return message.reply({ embeds: [errorEmbed('Invalid Channel', 'This command can only be used in text channels!')] });
            }
            try {
            const messages = await message.channel.messages.fetch({ limit: amount });
            const filteredMessages = messages.filter(msg => {
                const diff = Date.now() - msg.createdTimestamp;
                return diff <= 14 * 24 * 60 * 60 * 1000; // الرسائل أقل من 14 يومًا
            });
            if (filteredMessages.size === 0) {
                return message.reply({ embeds: [errorEmbed('No Messages', 'No messages found that can be deleted (under 14 days old)!')] });
            }
            await message.channel.bulkDelete(filteredMessages, true);
            await message.channel.send({
                embeds: [successEmbed('Messages Cleared', `Successfully deleted ${filteredMessages.size} message(s)!`)]
            });
            } catch (error) {
            console.error('Error in msh command:', error);
            await message.channel.send({
                embeds: [errorEmbed('Clear Failed', 'Failed to delete messages! Check if messages are under 14 days old or if I have permissions.')]
            });
            }
        },
                        async lock() {
                            if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
                                return message.reply({ embeds: [errorEmbed('Permission Denied', 'You lack Manage Channels permission!')] });
                            }
                            try {
                                await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false });
                                await message.reply({ embeds: [successEmbed('Channel Locked', 'The channel is now locked!')] });
                            } catch (error) {
                                console.error('Error locking channel:', error);
                                await message.reply({ embeds: [errorEmbed('Error Occurred', 'Failed to lock the channel!')] });
                            }
                        },
                        async unlock() {
                            if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
                                return message.reply({ embeds: [errorEmbed('Permission Denied', 'You lack Manage Channels permission!')] });
                            }
                            try {
                                await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: null });
                                await message.reply({ embeds: [successEmbed('Channel Unlocked', 'The channel is now unlocked!')] });
                            } catch (error) {
                                console.error('Error unlocking channel:', error);
                                await message.reply({ embeds: [errorEmbed('Error Occurred', 'Failed to unlock the channel!')] });
                            }
                        },
                        async ban(args) {
                            if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
                                return message.reply({ embeds: [errorEmbed('Permission Denied', 'You lack Ban Members permission!')] });
                            }
                            if (!message.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
                                return message.reply({ embeds: [errorEmbed('Bot Permission', 'I lack Ban Members permission! Check my roles.')] });
                            }
                            const banTarget = getMemberFromArgs(message, args);
                            if (!banTarget) {
                                return message.reply({ embeds: [errorEmbed('User Not Found', 'The member was not found!')] });
                            }
                            // Prevent banning if target's highest role is equal or higher than the command user's highest role (unless the user is the owner)
                            if (
                                message.member.id !== message.guild.ownerId &&
                                banTarget.roles.highest.position >= message.member.roles.highest.position
                            ) {
                                return message.reply({ embeds: [errorEmbed('Cannot Ban', 'You cannot ban someone with a higher or equal role than yours!')] });
                            }
                            if (!banTarget.bannable) {
                                return message.reply({ embeds: [errorEmbed('Cannot Ban', 'I cannot ban this member! (Role too high or insufficient permissions)')] });
                            }
                            const banReason = args.slice(1).join(' ') || 'No reason';
                            try {
                                await banTarget.ban({ reason: banReason });
                                await message.reply({ embeds: [successEmbed('Ban Successful', `Banned ${banTarget.user.tag} for: ${banReason}`)] });
                            } catch (error) {
                                console.error(error);
                                await message.reply({ embeds: [errorEmbed('Ban Failed', 'Check my permissions!')] });
                            }
                        }, // <-- Add this line to properly close the ban command function
                        async kick(args) {
                            if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
                                return message.reply({ embeds: [errorEmbed('Permission Denied', 'You lack Kick Members permission!')] });
                            }
                            if (!message.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
                                return message.reply({ embeds: [errorEmbed('Bot Permission', 'I lack Kick Members permission! Check my roles.')] });
                            }
                            const kickTarget = getMemberFromArgs(message, args);
                            if (!kickTarget) {
                                return message.reply({ embeds: [errorEmbed('User Not Found', 'The member was not found!')] });
                            }
                            // Only prevent kicking if target is the server owner
                            if (kickTarget.id === message.guild.ownerId) {
                                return message.reply({ embeds: [errorEmbed('Cannot Kick', 'You cannot kick the server owner!')] });
                            }
                            if (!kickTarget.kickable) {
                                return message.reply({ embeds: [errorEmbed('Cannot Kick', 'I cannot kick this member! (Role too high or insufficient permissions)')] });
                            }
                            const kickReason = args.slice(1).join(' ') || 'No reason';
                            try {
                                await kickTarget.kick(kickReason);
                                await message.reply({ embeds: [successEmbed('Kick Successful', `Kicked ${kickTarget.user.tag} for: ${kickReason}`)] });
                            } catch (error) {
                                console.error(error);
                                await message.reply({ embeds: [errorEmbed('Kick Failed', 'Check my permissions!')] });
                            }
                        },            async mute(args) {
    if (!message.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
        return message.reply({ embeds: [errorEmbed('Permission Denied', 'You lack Mute Members permission!')] });
    }
    
    const muteTarget = getMemberFromArgs(message, args);
    if (!muteTarget) {
        return message.reply({ embeds: [errorEmbed('User Not Found', 'The member was not found!')] });
    }

 
    const executorHighestRole = message.member.roles.highest;
    const targetHighestRole = muteTarget.roles.highest;
    if (targetHighestRole.position >= executorHighestRole.position && message.member.id !== message.guild.ownerId) {
        return message.reply({ embeds: [errorEmbed('Permission Denied', 'You cannot mute a member with a higher or equal role!')] });
    }

    let duration = parseInt(args[1]) || 60;
    duration = Math.min(Math.max(duration, 1), 1440);
    const reason = args.slice(2).join(' ') || 'No reason provided';
    
    try {
        await muteTarget.voice.setMute(true, reason);
        await message.reply({ embeds: [successEmbed('Mute Successful', `Muted ${muteTarget.user.tag} for ${duration} minutes for: ${reason}`)] });
    } catch (error) {
        console.error(error);
        await message.reply({ embeds: [errorEmbed('Mute Failed', 'Check my permissions!')] });
    }
},
                    async unmute(args) {
                        if (!message.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
                            return message.reply({ embeds: [errorEmbed('Permission Denied', 'You lack Mute Members permission!')] });
                        }
                        const unmuteTarget = getMemberFromArgs(message, args);
                        if (!unmuteTarget) {
                            return message.reply({ embeds: [errorEmbed('User Not Found', 'The member was not found!')] });
                        }
                        const omKey = `${message.guild.id}:${unmuteTarget.id}`;
                        if (omUsers.has(omKey)) {
                            return message.reply({ embeds: [errorEmbed('Permission Denied', 'This user can only be unmuted with $uom by the authorized user!')] });
                        }
                        try {
                            await unmuteTarget.voice.setMute(false, 'Unmute server mute');
                            await message.reply({ embeds: [successEmbed('Unmute Successful', `Unmuted ${unmuteTarget.user.tag} (server mute)`)] });
                        } catch (error) {
                            console.error(error);
                            await message.reply({ embeds: [errorEmbed('Unmute Failed', 'Check my permissions!')] });
                        }
                    },
                                    async unmutevoice(args) {
                            if (!message.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
                                return message.reply({ embeds: [errorEmbed('Permission Denied', 'You lack Mute Members permission!')] });
                            }
                            const unvoiceTarget = getMemberFromArgs(message, args);
                            if (!unvoiceTarget) {
                                return message.reply({ embeds: [errorEmbed('User Not Found', 'The member was not found!')] });
                            }
                            try {
                                await unvoiceTarget.voice.setMute(false, 'Unmute voice');
                                await message.reply({ embeds: [successEmbed('Voice Unmute Successful', `Unmuted ${unvoiceTarget.user.tag} (voice)`)] });
                            } catch (error) {
                                console.error(error);
                                await message.reply({ embeds: [errorEmbed('Voice Unmute Failed', 'Check my permissions!')] });
                            }
                        },
                        async mv(args) {
            // التحقق من صلاحيات المستخدم
            if (!message.member.permissions.has(PermissionFlagsBits.MoveMembers)) {
                return message.reply({ embeds: [errorEmbed('Permission Denied', 'You lack Move Members permission!')] });
            }
            if (!message.guild.members.me.permissions.has(PermissionFlagsBits.MoveMembers)) {
                return message.reply({ embeds: [errorEmbed('Bot Permission', 'I lack Move Members permission! Check my roles.')] });
            }

            // التحقق من أن المستخدم في قناة صوتية
            if (!message.member.voice.channel) {
                return message.reply({ embeds: [errorEmbed('Voice Channel Required', 'You must be in a voice channel to use this command!')] });
            }

            // التحقق من وجود وسائط
            if (args.length < 1) {
                return message.reply({ embeds: [errorEmbed('Invalid Input', 'Please specify at least the target voice channel ID!')] });
            }

            // استخراج معرف القناة الصوتية (يجب أن يكون آخر وسيط)
            const targetChannelId = args[args.length - 1];
            const targetChannel = message.guild.channels.cache.get(targetChannelId);
            if (!targetChannel || targetChannel.type !== ChannelType.GuildVoice) {
                return message.reply({ embeds: [errorEmbed('Invalid Channel', 'Please specify a valid voice channel ID as the last argument!')] });
            }

            // استخراج معرفات الأعضاء
            const memberIds = args.slice(0, -1); // كل الوسائط ما عدا الأخير (معرف القناة)
            const members = [];
            for (const id of memberIds) {
                const cleanId = id.replace(/[<@!>]/g, '');
                const member = message.guild.members.cache.get(cleanId);
                if (member) {
                    members.push(member);
                }
            }

            // إضافة المستخدم الذي نفذ الأمر إلى القائمة
            members.push(message.member);

            // التحقق من أن الأعضاء في قنوات صوتية
            const validMembers = members.filter(member => member.voice.channel);
            if (validMembers.length === 0) {
                return message.reply({ embeds: [errorEmbed('No Valid Members', 'No specified members are in voice channels!')] });
            }

            try {
                // نقل كل عضو إلى القناة المستهدفة
                for (const member of validMembers) {
                    await member.voice.setChannel(targetChannel);
                }
                // إرسال رسالة نجاح
                await message.reply({
                    embeds: [successEmbed('Move Successful', `Moved ${validMembers.length} member(s) to ${targetChannel.name}!`)]
                });
            } catch (error) {
                console.error('Error moving members:', error);
                await message.reply({ embeds: [errorEmbed('Move Failed', 'Failed to move members! Check my permissions or channel settings.')] });
            }
        },
    async hnina(args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return message.reply({ embeds: [errorEmbed('Permission Denied', 'You lack Manage Channels permission!')] });
        }
        const target = getMemberFromArgs(message, args);
        if (!target) {
            return message.reply({ embeds: [errorEmbed('User Not Found', 'Please specify a user to mute!')] });
        }
        let duration = parseInt(args[1]) || 60; // Default 60 minutes
        duration = Math.min(Math.max(duration, 1), 1440); // Clamp between 1 and 1440 minutes
        const reason = args.slice(2).join(' ') || 'No reason provided';
        const muteKey = `${message.guild.id}:${target.id}`;
        const textChannels = message.guild.channels.cache.filter(
            c => c.type === ChannelType.GuildText && c.permissionsFor(message.guild.members.me).has(PermissionFlagsBits.ManageChannels)
        );
        const voiceChannels = message.guild.channels.cache.filter(
            c => c.type === ChannelType.GuildVoice && c.permissionsFor(message.guild.members.me).has(PermissionFlagsBits.ManageChannels)
        );
        const modifiedTextChannels = [];
        const modifiedVoiceChannels = [];

        try {
            // Remove SendMessages in all text channels
            for (const [channelId, channel] of textChannels) {
                await channel.permissionOverwrites.edit(target.id, {
                    [PermissionFlagsBits.SendMessages]: false
                });
                modifiedTextChannels.push(channelId);
            }
            // Remove SendMessages in all voice channels (for chat in voice)
            for (const [channelId, channel] of voiceChannels) {
                await channel.permissionOverwrites.edit(target.id, {
                    [PermissionFlagsBits.SendMessages]: false
                });
                modifiedVoiceChannels.push(channelId);
            }
            mutedChannels.set(muteKey, {
                textChannels: modifiedTextChannels,
                voiceChannels: modifiedVoiceChannels,
                endTime: Date.now() + duration * 60 * 1000
            });
            await saveMutedChannels();

            // Auto-unmute after duration
            setTimeout(async () => {
                const data = mutedChannels.get(muteKey);
                if (data) {
                    for (const channelId of data.textChannels || []) {
                        const channel = message.guild.channels.cache.get(channelId);
                        if (channel) {
                            await channel.permissionOverwrites.delete(target.id, 'Auto-unmute after duration').catch(() => {});
                        }
                    }
                    for (const channelId of data.voiceChannels || []) {
                        const channel = message.guild.channels.cache.get(channelId);
                        if (channel) {
                            await channel.permissionOverwrites.delete(target.id, 'Auto-unmute after duration').catch(() => {});
                        }
                    }
                    mutedChannels.delete(muteKey);
                    await saveMutedChannels();
                    const logChannel = message.guild.channels.cache.get(HELP_CHANNEL_ID);
                    if (logChannel && logChannel.isTextBased()) {
                        await logChannel.send({
                            embeds: [successEmbed('Auto-Unmute', `${target.user.tag} has been automatically unmuted after ${duration} minutes.`)]
                        });
                    }
                }
            }, duration * 60 * 1000);

            await message.reply({
                embeds: [successEmbed('Text & Voice Chat Mute Successful', `Muted ${target.user.tag} from sending messages in all text and voice channels for ${duration} minutes for: ${reason}`)]
            });
        } catch (error) {
            console.error('Error in hnina command:', error);
            await message.reply({ embeds: [errorEmbed('Mute Failed', 'Failed to mute user! Check my permissions or channel settings.')] });
        }
    },
    async hdr(args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return message.reply({ embeds: [errorEmbed('Permission Denied', 'You lack Manage Channels permission!')] });
        }
        const target = getMemberFromArgs(message, args);
        if (!target) {
            return message.reply({ embeds: [errorEmbed('User Not Found', 'Please specify a user to unmute!')] });
        }
        const muteKey = `${message.guild.id}:${target.id}`;
        const data = mutedChannels.get(muteKey);
        if (!data) {
            return message.reply({ embeds: [errorEmbed('Not Muted', `${target.user.tag} is not muted in any text channels!`)] });
        }
        try {
            for (const channelId of data.channels) {
                const channel = message.guild.channels.cache.get(channelId);
                if (channel) {
                    await channel.permissionOverwrites.delete(target.id, 'Unmute by command');
                }
            }
            mutedChannels.delete(muteKey);
            await saveMutedChannels();
            await message.reply({ embeds: [successEmbed('Text Unmute Successful', `Restored ${target.user.tag}'s ability to send messages in all text channels!`)] });
        } catch (error) {
            console.error('Error in hdr command:', error);
            await message.reply({ embeds: [errorEmbed('Text Unmute Failed', 'Failed to unmute user! Check my permissions or channel settings.')] });
        }
    },
                        async role(args) {
            if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
                return message.reply({ embeds: [errorEmbed('Permission Denied', 'You lack Manage Roles permission!')] });
            }
            if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
                return message.reply({ embeds: [errorEmbed('Bot Permission', 'I lack Manage Roles permission! Check my roles.')] });
            }
            const roleTarget = getMemberFromArgs(message, args);
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]?.replace(/[<@&>]/g, ''));
            if (!roleTarget || !role) {
                return message.reply({ embeds: [errorEmbed('Invalid Input', 'Please specify a valid member (by mention or ID) and role (by mention or ID)!')] });
            }
            const logschannel = message.guild.channels.cache.get("1414490103904079954");
        if (!logschannel || !logschannel.isTextBased()) {
        console.error("Log channel not found or not a text channel!");
        }
            if (!role.editable) {
                return message.reply({ embeds: [errorEmbed('Role Hierarchy', 'I cannot manage this role due to hierarchy or permissions!')] });
            }
            try {
                if (roleTarget.roles.cache.has(role.id)) {
                    await roleTarget.roles.remove(role);
                     const removeembed = new EmbedBuilder()
                     .setColor('#050A4D')
                     .setTitle('**Role Removed** <:utility:1405898239718199367>')
                        .setDescription(`**<@${message.author.id}> Removed <@&${role.id}> From <@${roleTarget.user.id}>**`)
                        .setTimestamp()
                        await logschannel.send({ embeds: [removeembed] });

                    await message.reply({ embeds: [successEmbed('Role Removed', `Removed <@&${role.id}> from <@${roleTarget.user.id}>`)] });
                } else {
                    await roleTarget.roles.add(role);
                    const addembed = new EmbedBuilder()
                    .setColor('#050A4D')
                    .setTitle('**Role Added** <:utility:1405898239718199367>')
                          .setDescription(`**<@${message.author.id}> Added <@&${role.id}> To <@${roleTarget.user.id}>**`)
                            .setTimestamp()
                            await logschannel.send({ embeds: [addembed] });
                    await message.reply({ embeds: [successEmbed('Role Added', `Gave <@&${role.id}> to <@${roleTarget.user.id}>`)] });
                }
            } catch (error) {
                console.error('Error in role command:', error);
                await message.reply({ embeds: [errorEmbed('Role Operation Failed', 'Failed to add or remove the role! Check my permissions or role hierarchy.')] });
            }
        },
                        async unban(args) {
                            if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
                                return message.reply({ embeds: [errorEmbed('Permission Denied', 'You lack Ban Members permission!')] });
                            }
                            let unbanTarget = message.mentions.users.first();
                            if (args.length > 0) {
                                const userId = args[0].replace(/[<@!>]/g, '');
                                unbanTarget = await client.users.fetch(userId).catch(() => null) || unbanTarget;
                            }
                            if (!unbanTarget) {
                                return message.reply({ embeds: [errorEmbed('User Not Found', 'Please specify the member!')] });
                            }
                            try {
                                await message.guild.members.unban(unbanTarget);
                                await message.reply({ embeds: [successEmbed('Unban Successful', `Unbanned ${unbanTarget.tag || unbanTarget}`)] });
                            } catch (error) {
                                console.error(error);
                                await message.reply({ embeds: [errorEmbed('Unban Failed', 'Check my permissions or if the user is banned!')] });
                            }
                        },
                        
                    async xo(args) {
            const target = message.mentions.users.first() || client.users.cache.get(args[0]);
            if (!target || target.bot || target.id === message.author.id) {
                return message.reply({ embeds: [errorEmbed('Invalid User', 'Please mention a valid user other than the bot or yourself!')] });
            }

            const inviteEmbed = new EmbedBuilder()
                .setColor('#00fffb')
                .setTitle(' **Invitation to play XO**  <:game_night:1410729528459923576>')
                .setDescription(`${target}, ${message.author}***He invites you to play the XO game! Will you accept?***`)
              

            const inviteRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('accept_xo')
                        .setLabel('Accept')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('decline_xo')
                        .setLabel('Reject')
                        .setStyle(ButtonStyle.Danger)
                );

            const inviteMessage = await message.channel.send({ embeds: [inviteEmbed], components: [inviteRow] });

            const filter = (i) => i.user.id === target.id;
            const collector = inviteMessage.createMessageComponentCollector({ filter, time: 30000 });

            let gameStarted = false;
            collector.on('collect', async (i) => {
                if (i.customId === 'decline_xo') {
                    await i.update({ embeds: [errorEmbed('Invitation declined', `${target} declined the invitation!`)], components: [] });
                    collector.stop();
                    return;
                }
                if (i.customId === 'accept_xo') {
                    gameStarted = true;
                    await i.update({ embeds: [successEmbed('Invitation accepted', 'The game will start now!')], components: [] });
                    collector.stop();

                    // Start the game
                    const player1 = message.author;
                    const player2 = target;
                    const isPlayer1X = Math.random() < 0.5;
                    let currentPlayer = isPlayer1X ? player1 : player2; // Changed to let
                    const board = Array(9).fill('🟦');

                    const getBoardRows = () => {
                        const rows = [];
                        for (let i = 0; i < 9; i += 3) {
                            rows.push(new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder().setCustomId(`xo_${i}`).setLabel(board[i]).setStyle(ButtonStyle.Secondary).setDisabled(board[i] !== '🟦'),
                                    new ButtonBuilder().setCustomId(`xo_${i + 1}`).setLabel(board[i + 1]).setStyle(ButtonStyle.Secondary).setDisabled(board[i + 1] !== '🟦'),
                                    new ButtonBuilder().setCustomId(`xo_${i + 2}`).setLabel(board[i + 2]).setStyle(ButtonStyle.Secondary).setDisabled(board[i + 2] !== '🟦')
                                ));
                        }
                        return rows;
                    };

                    const gameEmbed = new EmbedBuilder()
                        .setColor('#00fffb')
                        .setTitle(' **XO Game** <:game_night:1410729528459923576>')
                        .setDescription(`***Now it's your turn*** <@${currentPlayer.id}> (${isPlayer1X ? '❎' : '🟢'}) **Choose a box within 7 seconds!**`)
                    

                    const gameMessage = await message.channel.send({ embeds: [gameEmbed], components: getBoardRows() });

                    const checkWin = (board, symbol) => {
                        const wins = [
                            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
                            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
                            [0, 4, 8], [2, 4, 6] // Diagonals
                        ];
                        return wins.some(([a, b, c]) => board[a] === symbol && board[b] === symbol && board[c] === symbol);
                    };

                    let turn = 0;
                    const gameCollector = gameMessage.createMessageComponentCollector({ time: 80000 });

                    gameCollector.on('collect', async (i) => {
                        if (i.user.id !== currentPlayer.id) {
                            await i.reply({ content: 'Not your turn now!', ephemeral: true });
                            return;
                        }

                        const index = parseInt(i.customId.split('_')[1]);
                        if (board[index] === '🟦') {
                            board[index] = turn % 2 === 0 ? '❎' : '🟢';
                            turn++;

                            const winner = checkWin(board, turn % 2 === 0 ? '🟢' : '❎'); // Adjusted to check the current player's symbol
                            if (winner) {
                                await i.update({ embeds: [successEmbed('Game Over!', `<@${currentPlayer.id}> wins! 🎉`)], components: getBoardRows() });
                                gameCollector.stop();
                                return;
                            }
                            if (!board.includes('🟦')) {
                                await i.update({ embeds: [errorEmbed('Game Over!', 'It\'s a tie! ⚠️')], components: getBoardRows() });
                                gameCollector.stop();
                                return;
                            }

                            currentPlayer = currentPlayer.id === player1.id ? player2 : player1; // Reassign currentPlayer
                            await i.update({
                                embeds: [new EmbedBuilder()
                                    .setColor('#00fffb')
                                    .setTitle(' **XO Game**  <:game_night:1410729528459923576>')
                                    .setDescription(`***Now it's your turn ***<@${currentPlayer.id}> (${turn % 2 === 0 ? '❎' : '🟢'}) **Choose a box within 8 seconds!**`)],
                                   
                                components: getBoardRows()
                            });

                            const turnCollector = gameMessage.createMessageComponentCollector({ filter: (i) => i.user.id === currentPlayer.id, time: 8000 });
                            turnCollector.on('end', async (collected) => {
                                if (collected.size === 0) { 
                                    await gameMessage.edit({ embeds: [errorEmbed('Time\'s Up!', `<@${currentPlayer.id}> didn\'t play. <@${currentPlayer.id === player1.id ? player2.id : player1.id}> wins!`)], components: getBoardRows() });
                                    gameCollector.stop();
                                }
                            });
                        }
                    });

                    gameCollector.on('end', async () => {
                        if (gameMessage) {
                            await gameMessage.edit({ components: getBoardRows().map(row => row.setComponents(row.components.map(btn => btn.setDisabled(true)))) });
                        }
                    });
                }
            });

            collector.on('end', async (collected) => {
                if (!gameStarted && collected.size === 0) {
                    await inviteMessage.edit({ embeds: [errorEmbed('The invitation has expired.', 'The invitation was not responded to within 30 seconds!')], components: [] });
                }
            });
        },
       async topboost() {
    // Fetch all members to ensure the cache is complete
    await message.guild.members.fetch();

    const boosters = message.guild.members.cache
        .filter(member => member.premiumSince)
        .map(member => ({
            id: member.id,
            premiumSince: member.premiumSince
        }))
        .sort((a, b) => a.premiumSince - b.premiumSince)
        .slice(0, 10);

    const description = boosters.length > 0
        ? boosters.map((b, i) => {
            return `**${i + 1}** . <@${b.id}>  ~  **Boosting since:** <t:${Math.floor(b.premiumSince.getTime() / 1000)}:R>`;
        }).join('\n\n')
        : 'No boosters found.';

    const topBoostEmbed = new EmbedBuilder()
        .setColor('#FF73FA')
        .setTitle('<a:Logo_Boosts:1393756287887609877> **Top 10 Boosters** <a:Logo_Boosts:1393756287887609877>')
        .setDescription(description)
        .setTimestamp()
        .setThumbnail("https://media.discordapp.net/attachments/1070521912981205023/1394229102562508880/Championship_Cup.gif")

    await message.reply({ embeds: [topBoostEmbed] });
},
async roletp(args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
        return message.reply({ embeds: [errorEmbed('Permission Denied', 'You lack Manage Roles permission!')] });
    }
    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
        return message.reply({ embeds: [errorEmbed('Bot Permission', 'I lack Manage Roles permission! Check my roles.')] });
    }
    const target = getMemberFromArgs(message, args);
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]?.replace(/[<@&>]/g, ''));
    const durationArg = args[2];
    if (!target || !role || !durationArg) {
        return message.reply({ embeds: [errorEmbed('Invalid Input', 'Usage: $roletp <user> <role> <duration> (e.g. 30m, 2h, 1d)')] });
    }
    if (!role.editable) {
        return message.reply({ embeds: [errorEmbed('Role Hierarchy', 'I cannot manage this role due to hierarchy or permissions!')] });
    }

    // Parse duration (supports m, h, d)
    let durationMs = 0;
    const match = durationArg.match(/^(\d+)([mhd])$/i);
    if (!match) {
        return message.reply({ embeds: [errorEmbed('Invalid Duration', 'Please specify duration like 30m, 2h, or 1d (max 10d)!')] });
    }
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    if (unit === 'm') {
        if (value < 1 || value > 14400) return message.reply({ embeds: [errorEmbed('Invalid Duration', 'Minutes must be between 1 and 14400 (10 days)!')] });
        durationMs = value * 60 * 1000;
    } else if (unit === 'h') {
        if (value < 1 || value > 240) return message.reply({ embeds: [errorEmbed('Invalid Duration', 'Hours must be between 1 and 240 (10 days)!')] });
        durationMs = value * 60 * 60 * 1000;
    } else if (unit === 'd') {
        if (value < 1 || value > 10) return message.reply({ embeds: [errorEmbed('Invalid Duration', 'Days must be between 1 and 10!')] });
        durationMs = value * 24 * 60 * 60 * 1000;
    }

    try {
        await target.roles.add(role);
        await message.reply({ embeds: [successEmbed('Temporary Role Given', `Gave <@&${role.id}> to <@${target.user.id}> for ${value}${unit}.`)] });
        setTimeout(async () => {
            const member = await message.guild.members.fetch(target.id).catch(() => null);
            if (member && member.roles.cache.has(role.id)) {
                await member.roles.remove(role, 'Temporary role duration expired').catch(() => {});
                const logChannel = message.guild.channels.cache.get(HELP_CHANNEL_ID);
                if (logChannel && logChannel.isTextBased()) {
                    await logChannel.send({ embeds: [successEmbed('Temporary Role Removed', `<@${target.user.id}> had <@&${role.id}> removed after ${value}${unit}.`)] });
                }
            }
        }, durationMs);
    } catch (error) {
        console.error('Error in roletp:', error);
        await message.reply({ embeds: [errorEmbed('Role Operation Failed', 'Failed to add the role! Check my permissions or role hierarchy.')] });
    }
},
      async live() {
        const liveEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('🔴 Share Your Stream!')
            .setDescription('Click the button below to share your live stream link!')
            .setImage("https://images-ext-1.discordapp.net/external/KKeFK-5KUUv-_hjubTwpQpn780TaaQOGXz6DiM20iRs/https/images-ext-1.discordapp.net/external/sVtsl_iaWgrdN9mCrYKMOP5CB6NjH2MjdHzXZAyTupY/https/media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTNuaGE5ODIyNjNyc2t5Z2NsNWV3bXRldHkyNXE1ZTZkYTlxbmZkayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mWnDeIKilkwDcrM2VT/giphy.gif")
            .setTimestamp()
            .setFooter(embedConfig.footer);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`live_stream_${message.author.id}`)
                .setLabel('Share Stream')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🔴')
        );

        await message.reply({ embeds: [liveEmbed], components: [row] });
    },

                
                       async warn(args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
        return message.reply({ embeds: [errorEmbed('Permission Denied', 'You lack Moderate Members permission!')] });
    }
    const warnTarget = getMemberFromArgs(message, args);
    if (!warnTarget) {
        return message.reply({ embeds: [errorEmbed('User Not Found', 'The member was not found!')] });
    }
    const warnReason = args.slice(1).join(' ') || 'No reason provided';
    const warnId = Date.now();
    const warnKey = `${message.guild.id}:${warnTarget.id}`;
    const warnData = warnings.get(warnKey) || [];
    warnData.push({
        id: warnId,
        reason: warnReason,
        moderator: message.author.tag,
        timestamp: new Date(warnId).toDateString()
    });
    warnings.set(warnKey, warnData);
    await saveWarnings();

    // Create DM embed for the warned user
    const dmEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('<a:Warn:1396573880839307386>**You Have Been Warned** ')
        .setDescription(`> You have received a warning in \`${message.guild.name}\` `)
        .setThumbnail("https://images-ext-1.discordapp.net/external/TzQBBZ-QPjAGHmin5-v5ed9TaQ-6WscHxSf1E_jdqzk/%3Fformat%3Dwebp%26quality%3Dlossless/https/images-ext-1.discordapp.net/external/ebZfx4D6FBQhlfgPL2x3OCZcKAtRKNwh1S3uCnTnMMg/%253Fsize%253D1024/https/cdn.discordapp.com/icons/774365213088153680/14f5d68ca35dcd298f3647f1ce9b77ff.png?format=webp&quality=lossless")
        .addFields(
            { name: 'Reason', value: `**${warnReason}**`, inline: true },
            { name: 'Time', value: new Date(warnId).toLocaleString(), inline: true }
        )
        .setTimestamp()
        .setFooter(embedConfig.footer);

    // Send DM to the warned user
    try {
        await warnTarget.send({ embeds: [dmEmbed] });
    } catch (error) {
        console.error(`Failed to send DM to ${warnTarget.user.tag}:`, error);
        await message.reply({ embeds: [errorEmbed('DM Failed', `Could not send warning notification to ${warnTarget.user.tag}. Their DMs might be closed.`)] });
    }

    await message.reply({ embeds: [successEmbed('Warning Issued', `Warned ${warnTarget.user.tag} for: ${warnReason} (ID: ${warnId})`)] });
},
                        async unwarn(args) {
            if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
                return message.reply({ embeds: [errorEmbed('Permission Denied', 'You lack Moderate Members permission!')] });
            }
            const unwarnTarget = getMemberFromArgs(message, args);
            if (!unwarnTarget) {
                return message.reply({ embeds: [errorEmbed('User Not Found', 'The member was not found!')] });
            }
            const warnNumber = parseInt(args[1]);
            if (isNaN(warnNumber) || warnNumber < 1) {
                return message.reply({ embeds: [errorEmbed('Invalid Warning Number', 'Please specify a valid warning number (e.g., 1, 2, 3)!')] });
            }
            const unwarnKey = `${message.guild.id}:${unwarnTarget.id}`;
            let unwarnData = warnings.get(unwarnKey) || [];
            if (warnNumber > unwarnData.length) {
                return message.reply({ embeds: [errorEmbed('Invalid Warning Number', `No warning found with number ${warnNumber} for ${unwarnTarget.user.tag}!`)] });
            }
            const warnIndex = warnNumber - 1; // Convert to zero-based index
            const removedWarn = unwarnData.splice(warnIndex, 1)[0]; // Remove the warning
            if (unwarnData.length === 0) {
                warnings.delete(unwarnKey);
            } else {
                warnings.set(unwarnKey, unwarnData);
            }
            await saveWarnings();
            await message.reply({ embeds: [successEmbed('Warning Removed', `Removed warning #${warnNumber} (${removedWarn.reason}) for ${unwarnTarget.user.tag}`)] });
        },
            async warns(args) {
                let warnsTarget = message.mentions.users.first() || message.author;
                if (args.length > 0) {
                    const userId = args[0].replace(/[<@!>]/g, '');
                    warnsTarget = await client.users.fetch(userId).catch(() => null) || warnsTarget;
                }
                const warnsKey = `${message.guild.id}:${warnsTarget.id}`;
                const userWarnings = warnings.get(warnsKey) || [];
                const warnsEmbed = new EmbedBuilder()
                    .setColor('#00fffb')
                    .setAuthor({ name: `${warnsTarget.tag} warnings`, iconURL: warnsTarget.displayAvatarURL() })
                    .setTimestamp()
                    .setFooter(embedConfig.footer);
                if (userWarnings.length === 0) {
                    warnsEmbed.setDescription('No warnings found for this user.');
                } else {
                    const warnText = userWarnings.map((warn, index) => `**${index + 1} - \`${warn.reason}\` | by <@${warn.moderator}>**`).join('\n');
                    warnsEmbed.setDescription(`Found ${userWarnings.length} warning(s):\n${warnText}`);
                }
                await message.reply({ embeds: [warnsEmbed] });
            },
                        async locate(args) {
                            const target = getMemberFromArgs(message, args);
                            if (!target) {
                                return message.reply({ embeds: [errorEmbed('User Not Found', 'Please specify a user to locate!')] });
                            }
                            const voiceChannel = target.voice.channel;
                            if (!voiceChannel) {
                                return message.reply({ embeds: [errorEmbed('Not in Voice Channel', `${target.user.tag} is not in any voice channel!`)] });
                            }
                            const membersInChannel = voiceChannel.members
                                .filter(member => member.tag !== target.id)
                                .map(member => member.user.tag)
                                .join(', ') || 'No other members in this channel';
                            const locateEmbed = new EmbedBuilder()
                                .setColor('#00fffb')
                                .setTitle(` User Located  <a:locations:1392696692922515607>`)
                                .setDescription(`<@${target.user.id}> is in voice channel <#${voiceChannel.id}> <a:asinexegiveweays_120598604767101:1391902199474425856>`)
                                .addFields(
                                    { name: 'Members in Channel', value: `${membersInChannel}`, inline: false }
                                )
                                .setTimestamp()
                                .setFooter(embedConfig.footer);
                            await message.reply({ embeds: [locateEmbed] });
                        },
                    adej: async (args) => {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageGuildExpressions)) {
            return message.reply({ embeds: [errorEmbed('Permission Denied', 'You need Manage Emojis permission to use this command!')] });
        }
        if (!args.length) {
            return message.reply({ embeds: [errorEmbed('Invalid Input', 'Please provide at least one custom emoji to add!')] });
        }

        const results = [];
        
        for (const emoji of args) {
            let emojiName, emojiId, isAnimated;

            // تحليل الإيموجي المخصص (<:name:id> أو <a:name:id>)
            const customEmojiMatch = emoji.match(/<a?:(\w+):(\d+)>/);
            if (customEmojiMatch) {
                emojiName = customEmojiMatch[1];
                emojiId = customEmojiMatch[2];
                isAnimated = emoji.startsWith('<a:');
            } else {
                // التحقق مما إذا كان إيموجي Unicode
                const unicodeEmoji = /\p{Emoji}/u.test(emoji);
                if (unicodeEmoji) {
                    results.push(`Failed to add ${emoji}: Unicode emojis cannot be added to the server as they are already available!`);
                    continue;
                }
                results.push(`Failed to add ${emoji}: Please provide a valid custom emoji!`);
                continue;
            }

            try {
                const emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId}.${isAnimated ? 'gif' : 'png'}?v=1`;
                const newEmoji = await message.guild.emojis.create({
                    attachment: emojiUrl,
                    name: emojiName,
                    reason: `Added by ${message.author.tag} using $adej command`
                });
                results.push(`Successfully added emoji ${newEmoji} (${emojiName}) to the server!`);
            } catch (error) {
                console.error(`Error adding emoji ${emoji}:`, error);
                results.push(`Failed to add ${emoji}: Check if the server has reached the emoji limit or if the bot has Manage Emojis permission.`);
            }
        }

        // إرسال نتائج معالجة جميع الإيموجيات
        await message.reply({ 
            embeds: [successEmbed('Emoji Addition Results', results.join('\n'))] 
        });
    },
                        async mperm(args) {
                            if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
                                return message.reply({ embeds: [errorEmbed('Permission Denied', 'You lack Manage Channels permission!')] });
                            }
                            const userToPermit = getMemberFromArgs(message, args);
                            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
                            if (!userToPermit || !channel) {
                                return message.reply({ embeds: [errorEmbed('Invalid Input', 'Please specify a user and a voice channel!')] });
                            }
                            if (channel.type !== ChannelType.GuildVoice) {
                                return message.reply({ embeds: [errorEmbed('Invalid Channel', 'The specified channel must be a voice channel!')] });
                            }
                            try {
                                await channel.permissionOverwrites.edit(userToPermit.id, {
                                    [PermissionsBitField.Flags.Connect]: true,
                                     [PermissionFlagsBits.ViewChannel]: true,
                                    [PermissionsBitField.Flags.Speak]: true,
                                    [PermissionsBitField.Flags.ManageChannels]: false
                                });
                                await message.reply({ embeds: [successEmbed('Permission Granted', `Granted ${userToPermit.user.tag} permission to connect, view, and speak in ${channel.name}!`)] });
                            } catch (error) {
                                console.error('Error setting channel permissions:', error);
                                await message.reply({ embeds: [errorEmbed('Permission Failed', 'Failed to set permissions! Check my permissions.')] });
                            }
                        },
                        async jail(args) {
                if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
                    return message.reply({ embeds: [errorEmbed('Permission Denied', 'You lack Manage Roles permission!')] });
                }
                const jailTarget = getMemberFromArgs(message, args);
                if (!jailTarget) {
                    return message.reply({ embeds: [errorEmbed('User Not Found', 'Please specify a member to jail!')] });
                }
                const jailRole = message.guild.roles.cache.get(JAIL_ROLE_ID);
                if (!jailRole) {
                    return message.reply({ embeds: [errorEmbed('Role Not Found', 'Jail role not found! Check JAIL_ROLE_ID.')] });
                }
                try {
                    const rolesToRemove = jailTarget.roles.cache.filter(role => role.id !== message.guild.id).map(role => role.id);
                    const jailKey = `${message.guild.id}:${jailTarget.id}`;
                    const jailId = Date.now();
                    const jailReason = args.slice(1).join(' ') || 'No reason provided';
                    jailedUsers.set(jailKey, rolesToRemove);
                    const jailData = jailLogs.get(jailKey) || [];
                    jailData.push({
                        id: jailId,
                        reason: jailReason,
                        moderator: message.author.id,
                        timestamp: new Date(jailId).toDateString()
                    });
                    jailLogs.set(jailKey, jailData);
                    await saveJailedUsers();
                    await saveJailLogs();
                    await jailTarget.roles.remove(rolesToRemove);
                    await jailTarget.roles.add(jailRole);
                    await message.reply({ embeds: [successEmbed('Jail Successful', `Jailed ${jailTarget.user.tag} `)] });
                    await jailTarget.send({ embeds: [
                        new EmbedBuilder()
                            .setColor('#5E3930')
                            .setTitle('***You Have Been Jailed*** <:staff_black:1393184098809413703>')
                            .setDescription(`***You have been jailed in*** \`${message.guild.name}\` \n \n ***Reason:*** **${jailReason}**`)
                            .setImage("https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmh5MmFhZnkyNHdzZ2Q3dmUzYWdqcmQ2eXhqNHAzOTNyM3V3NDV4OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yw3MXMbTPkBgASDYJz/giphy.gif")
                    ] });
                } catch (error) {
                    console.error(error);
                    await message.reply({ embeds: [errorEmbed('Jail Failed', 'Check my permissions or role hierarchy!')] });
                }
            },
async client(args) {
    if (!message.member.roles.cache.has(VERIFICATION_ADMIN_ROLE_ID) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return message.reply({ embeds: [errorEmbed('Permission Denied', 'You need the Verification Admin role or Administrator permission to use this command!')] });
    }
    if (args.length < 2) {
        return message.reply({ embeds: [errorEmbed('Invalid Input', 'Usage: $verf <user_id/user> <vb/vg>')] });
    }
    const userId = args[0].replace(/[<@!>]/g, '');
    let target;
    try {
        target = await message.guild.members.fetch(userId);
    } catch (error) {
        console.error('Error fetching member:', error);
        return message.reply({ embeds: [errorEmbed('User Not Found', 'Please specify a valid user by mention or ID!')] });
    }
    const verificationType = args[1].toLowerCase();
    if (verificationType !== 'trusted' && verificationType !== 'client') {
        return message.reply({ embeds: [errorEmbed('Invalid Type', 'Please specify either "vb" or "vg"!')] });
    }
    const verificationRole = message.guild.roles.cache.get(VERIFICATION_ROLE_ID);
    const secondVerificationRole = message.guild.roles.cache.get(SECOND_VERIFICATION_ROLE_ID);
    const roleToRemove = message.guild.roles.cache.get(ROLE_TO_REMOVE_ID);
    if (!verificationRole || (verificationType === 'vg' && !secondVerificationRole)) {
        return message.reply({ embeds: [errorEmbed('Role Not Found', 'Verification role(s) not found! Check role IDs.')] });
    }
    if (target.roles.cache.has(VERIFICATION_ROLE_ID)) {
        return message.reply({ embeds: [errorEmbed('Already Verified', `<@${target.user.id}> is already verified!`)] });
    }
    try {
        if (verificationType === 'trusted') {
            await target.roles.add(verificationRole);
            if (roleToRemove && target.roles.cache.has(ROLE_TO_REMOVE_ID)) {
                await target.roles.remove(roleToRemove);
            }
            await message.reply({ embeds: [successEmbed('Verification Successful', `<@${target.user.id}> has been trusted`)] });
        } else {
            await target.roles.add([verificationRole, secondVerificationRole]);
            if (roleToRemove && target.roles.cache.has(ROLE_TO_REMOVE_ID)) {
                await target.roles.remove(roleToRemove);
            }
            await message.reply({ embeds: [successEmbed('Verification Successful', `<@${target.user.id}> has been verified as cleint`)] });
        }
        // Increment verification count for the executor
        const verificationKey = `${message.guild.id}:${message.author.id}`;
        const currentCount = verifications.get(verificationKey) || 0;
        verifications.set(verificationKey, currentCount + 1);
        await saveVerifications();
    } catch (error) {
        console.error('Error verifying user:', error);
        await message.reply({ embeds: [errorEmbed('Verification Failed', 'Failed to verify user or remove role! Check my permissions or role hierarchy.')] });
    }
},
async topverf() {
    if (!message.member.roles.cache.has(VERIFICATION_ADMIN_ROLE_ID) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return message.reply({ embeds: [errorEmbed('Permission Denied', 'You need the Verification Admin role or Administrator permission to use this command!')] });
    }
    const verificationList = Array.from(verifications.entries())
        .map(([key, count]) => {
            const [, userId] = key.split(':');
            return { id: userId, count };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    const description = verificationList.length > 0
        ? verificationList.map((v, i) => {
            const member = message.guild.members.cache.get(v.id);
            return `**${i + 1}** . <@${member ? member.user.id : 'Unknown User'}>  ~  **${v.count} verifications**`;
        }).join('\n \n')
        : 'No verifications recorded.';

    const topVerfEmbed = new EmbedBuilder()
        .setColor('#00fffb')
        .setTitle(`<a:crown_blue:1455639142250578093> **Top 10 Verifiers** <a:crown_blue:1455639142250578093>`)
        .setDescription(description)
        .setTimestamp()
        .setThumbnail("https://media.discordapp.net/attachments/1070521912981205023/1394229102562508880/Championship_Cup.gif?ex=68760c89&is=6874bb09&hm=c4b4ee3008a5ea4d5a523da43f6e7d7bd0669dc70c496634ccea8c756ba7a873&=")
        .setFooter(embedConfig.footer);

    const buttonRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('top_prev')
                .setEmoji('<a:Leftarrow:1393563638396227644>')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('top_next')
                .setEmoji('<a:beast_right_arrow:1393563629445451879>')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
        );

    await message.reply({ embeds: [topVerfEmbed], components: [buttonRow] });
},
async resetvr() {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return message.reply({ embeds: [errorEmbed('Permission Denied', 'You need Administrator permissions to use this command!')] });
    }
    try {
        verifications = new Map();
        await saveVerifications();
        await message.reply({ embeds: [successEmbed('Verification Counts Reset', 'All verification counts have been successfully reset to zero!')] });
    } catch (error) {
        console.error('Error resetting verification counts:', error);
        await message.reply({ embeds: [errorEmbed('Reset Failed', 'Failed to reset verification counts! Please try again or check permissions.')] });
    }
},


// Inside the textCommands object, replace the existing stats command with this updated version

            async jaillogs(args) {
                const jailTarget = getMemberFromArgs(message, args);
                if (!jailTarget) {
                    return message.reply({ embeds: [errorEmbed('User Not Found', 'Please specify a user to view jail logs!')] });
                }
                const jailKey = `${message.guild.id}:${jailTarget.id}`;
                const userJailLogs = jailLogs.get(jailKey) || [];
                const jailEmbed = new EmbedBuilder()
                    .setColor('#f40060')
                    .setAuthor({ name: `${jailTarget.user.tag} warnings`, iconURL: jailTarget.user.displayAvatarURL() })
                    .setTimestamp();
                if (userJailLogs.length === 0) {
                    jailEmbed.setDescription('No jail logs found for this user.');
                } else {
                    const logText = userJailLogs.map((jail, index) => `**${index + 1} - \`${jail.reason}\` | by <@${jail.moderator}>**`).join('\n');
                    jailEmbed.setDescription(`Found ${userJailLogs.length} jail log(s):\n${logText}`);
                }
                await message.reply({ embeds: [jailEmbed] });
            },
                        async unjail(args) {
                            if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
                                return message.reply({ embeds: [errorEmbed('Permission Denied', 'You lack Manage Roles permission!')] });
                            }
                            const unjailTarget = getMemberFromArgs(message, args);
                            if (!unjailTarget) {
                                return message.reply({ embeds: [errorEmbed('User Not Found', 'Please specify a member to unjail!')] });
                            }
                            const jailRole = message.guild.roles.cache.get(JAIL_ROLE_ID);
                            if (!jailRole) {
                                return message.reply({ embeds: [errorEmbed('Role Not Found', 'Jail role not found! Check JAIL_ROLE_ID.')] });
                            }
                            try {
                                await unjailTarget.roles.remove(jailRole);
                                const jailKey = `${message.guild.id}:${unjailTarget.id}`;
                                const previousRoles = jailedUsers.get(jailKey) || [];
                                if (previousRoles.length > 0) {
                                    await unjailTarget.roles.add(previousRoles);
                                }
                                jailedUsers.delete(jailKey);
                                await saveJailedUsers();
                                await message.reply({ embeds: [successEmbed('Unjail Successful', `Unjailed ${unjailTarget.user.tag} and restored previous roles!`)] });
                            } catch (error) {
                                console.error(error);
                                await message.reply({ embeds: [errorEmbed('Unjail Failed', 'Check my permissions or role hierarchy!')] });
                            }
                        },
                        async nick(args) {
                            if (!message.member.permissions.has(PermissionFlagsBits.ManageNicknames)) {
                                return message.reply({ embeds: [errorEmbed('Permission Denied', 'You lack Manage Nicknames permission!')] });
                            }
                            const nickTarget = getMemberFromArgs(message, args);
                            const newNickname = args.slice(1).join(' ');
                            if (!nickTarget || !newNickname) {
                                return message.reply({ embeds: [errorEmbed('Invalid Input', 'Please specify a member and a new nickname!')] });
                            }
                            try {
                                await nickTarget.setNickname(newNickname);
                                await message.reply({ embeds: [successEmbed('Nickname Changed', `Changed nickname of ${nickTarget.user.tag} to ${newNickname}!`)] });
                            } catch (error) {
                                console.error(error);
                                await message.reply({ embeds: [errorEmbed('Nickname Change Failed', 'Check my permissions or role hierarchy!')] });
                            }
                        },
                        async timeout(args) {
                            if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
                                return message.reply({ embeds: [errorEmbed('Permission Denied', 'You lack Moderate Members permission!')] });
                            }
                            const timeoutTarget = getMemberFromArgs(message, args);
                            if (!timeoutTarget) {
                                return message.reply({ embeds: [errorEmbed('User Not Found', 'Please specify a member to timeout!')] });
                            }
                            let duration = parseInt(args[1]) || 60;
                            duration = Math.min(Math.max(duration, 1), 1440);
                            const reason = args.slice(2).join(' ') || 'No reason provided';
                            try {
                                await timeoutTarget.timeout(duration * 60 * 1000, reason);
                                await message.reply({ embeds: [successEmbed('Timeout Successful', `Timed out ${timeoutTarget.user.tag} for ${duration} minutes for: ${reason}`)] });
                            } catch (error) {
                                console.error(error);
                                await message.reply({ embeds: [errorEmbed('Timeout Failed', 'Check my permissions!')] });
                            }
                        },
                        async untimeout(args) {
                            if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
                                return message.reply({ embeds: [errorEmbed('Permission Denied', 'You lack Moderate Members permission!')] });
                            }
                            const untimeoutTarget = getMemberFromArgs(message, args);
                            if (!untimeoutTarget) {
                                return message.reply({ embeds: [errorEmbed('User Not Found', 'Please specify a member to untimeout!')] });
                            }
                            try {
                                await untimeoutTarget.timeout(null, 'Timeout removed');
                                await message.reply({ embeds: [successEmbed('Untimeout Successful', `Removed timeout from ${untimeoutTarget.user.tag}!`)] });
                            } catch (error) {
                                console.error(error);
                                await message.reply({ embeds: [errorEmbed('Untimeout Failed', 'Check my permissions or if the user has a timeout!')] });
                            }
                        },
                        async moveall(args) {
                            if (!message.member.permissions.has(PermissionFlagsBits.MoveMembers)) {
                                return message.reply({ embeds: [errorEmbed('Permission Denied', 'You lack Move Members permission!')] });
                            }
                            const sourceChannelId = args[0];
                            const targetChannelId = args[1];
                            const sourceChannel = message.guild.channels.cache.get(sourceChannelId);
                            const targetChannel = message.guild.channels.cache.get(targetChannelId);
                            if (!sourceChannel || sourceChannel.type !== ChannelType.GuildVoice) {
                                return message.reply({ embeds: [errorEmbed('Invalid Source Channel', 'Please specify a valid source voice channel ID!')] });
                            }
                            if (!targetChannel || targetChannel.type !== ChannelType.GuildVoice) {
                                return message.reply({ embeds: [errorEmbed('Invalid Target Channel', 'Please specify a valid target voice channel ID!')] });
                            }
                            try {
                                const members = sourceChannel.members;
                                let movedCount = 0;
                                for (const [memberId, member] of members) {
                                    if (!member.voice.serverDeaf && member.voice.channel) {
                                        await member.voice.setChannel(targetChannel);
                                        movedCount++;
                                    }
                                }
                                await message.reply({ embeds: [successEmbed('Move All Successful', `Moved ${movedCount} members from ${sourceChannel.name} to ${targetChannel.name}!`)] });
                            } catch (error) {
                                console.error('Error moving members:', error);
                                await message.reply({ embeds: [errorEmbed('Move Failed', 'Check my permissions or channel settings!')] });
                            }
                        },
                        async gameself() {
                            if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
                                return message.reply({ embeds: [errorEmbed('Permission Denied', 'You lack Manage Roles permission!')] });
                            }
                            if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
                                return message.reply({ embeds: [errorEmbed('Bot Permission', 'I lack Manage Roles permission! Check my roles.')] });
                            }
                            try {
                                const gameRolesEmbed = new EmbedBuilder()
                                    .setColor('#5865F2')
                                    .setTitle('<a:ta:1376404515867201558> Game Roles <a:ta:1376404515867201558>')
                                    .setDescription(`Click a button below to add or remove the Game role.\n\n${selfRolesMapping.map(role => `${role.emoji} <a:arow2:1391490474161995907> <@&${role.roleID}>`).join('\n')}`)
                                    .setTimestamp()
                                    .setFooter(embedConfig.footer);

                                // Create buttons with emoji only
                                const buttons = selfRolesMapping
                                    .map((role, index) => {
                                        const match = role.emoji.match(/:(\d+)>$/);
                                        if (!match || !match[1]) {
                                            console.warn(`Invalid emoji format for role: ${JSON.stringify(role)}`);
                                            return null;
                                        }
                                        if (!role.roleID) {
                                            console.warn(`Missing roleID for role: ${JSON.stringify(role)}`);
                                            return null;
                                        }
                                        const emojiId = match[1];
                                        return new ButtonBuilder()
                                            .setCustomId(`game_role_${role.roleID}_${index}`)
                                            .setStyle(ButtonStyle.Primary)
                                            .setEmoji({ id: emojiId });
                                    })
                                    .filter(button => button !== null); // Filter out invalid buttons

                                if (buttons.length === 0) {
                                    return message.reply({ embeds: [errorEmbed('No Valid Roles', 'No valid game roles found to create buttons!')] });
                                }

                                // Divide buttons into rows
                                const rows = [];
                                for (let i = 0; i < buttons.length; i += 5) {
                                    const rowButtons = buttons.slice(i, i + 5);
                                    if (rowButtons.length > 0) {
                                        const row = new ActionRowBuilder().addComponents(rowButtons);
                                        rows.push(row);
                                    }
                                }

                                if (rows.length === 0) {
                                    return message.reply({ embeds: [errorEmbed('No Rows Created', 'Failed to create any button rows!')] });
                                }

                                await message.channel.send({ embeds: [gameRolesEmbed], components: rows });
                                await message.reply({ embeds: [successEmbed('Game Roles Setup', 'Game roles message has been sent successfully!')] });
                            } catch (error) {
                                console.error('Error setting up game roles:', error);
                                await message.reply({ embeds: [errorEmbed('Game Roles Failed', 'Failed to set up game roles. Check my permissions!')] });
                            }
                        },
async help() {
    const userId = message.author.id;
    const member = message.member;

    const helpEmbed = createHelpEmbed(message.author, member);
    const selectMenu = createCategorySelectMenu(member);

    // إذا لم يكن لديه الصلاحيات، أرسل الإمبد بدون قائمة
    if (!selectMenu) {
        return message.reply({ embeds: [helpEmbed] });
    }

    const helpMessage = await message.reply({
        embeds: [helpEmbed],
        components: [selectMenu]
    });

    const collector = helpMessage.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        filter: interaction => interaction.user.id === userId,
        time: 60000 // مهلة 60 ثانية
    });

    let lastEmbed = helpEmbed; // تخزين الإمبد الأخير لاستخدامه عند انتهاء المهلة

    collector.on('collect', async (interaction) => {
        console.log(`Starting interaction processing for user ${interaction.user.id}, category: ${interaction.values[0]}`);
        const selectedCategory = interaction.values[0];
        if (!commandCategories[selectedCategory]) {
            await interaction.reply({ content: 'Invalid category selected!', ephemeral: true });
            return;
        }

        if (interaction.deferred || interaction.replied) {
            console.log(`Interaction already acknowledged for user ${interaction.user.id}, skipping deferUpdate.`);
        } else {
            await interaction.deferUpdate();
        }

        const { embed, totalPages, currentPage } = createCategoryEmbed(selectedCategory, interaction.user, 1);
        lastEmbed = embed; // تحديث الإمبد الأخير
        const selectMenu = createCategorySelectMenu(member);
        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`prev_${selectedCategory}_1_${interaction.user.id}`)
                    .setEmoji('<a:Leftarrow:1393563638396227644>')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId(`next_${selectedCategory}_1_${interaction.user.id}`)
                    .setEmoji('<a:beast_right_arrow:1393563629445451879>')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(totalPages <= 1)
            );

        try {
            await interaction.editReply({
                embeds: [embed],
                components: [selectMenu, buttonRow]
            });
            console.log(`Finished interaction processing for user ${interaction.user.id}`);
        } catch (error) {
            console.error(`Error handling interaction for user ${interaction.user.id}:`, error);
            if (error.code === 40060) {
                console.warn('Interaction has already been acknowledged:', error);
                await interaction.followUp({
                    content: 'This interaction has already been processed. Please run $help again.',
                    ephemeral: true
                }).catch(err => console.error('Failed to send follow-up:', err));
            } else if (error.code === 10062) {
                console.warn('Unknown interaction error, interaction may have expired:', error);
                await interaction.followUp({
                    content: 'This interaction has expired. Please run $help again.',
                    ephemeral: true
                }).catch(err => console.error('Failed to send follow-up:', err));
            } else {
                await interaction.followUp({
                    content: 'An error occurred while processing your request. Please try again.',
                    ephemeral: true
                }).catch(err => console.error('Failed to send follow-up:', err));
            }
        }
    });

    collector.on('end', async (collected) => {
        console.log(`Collector ended for user ${userId}, collected ${collected.size} interactions`);
        await helpMessage.edit({
            embeds: [lastEmbed], // الإبقاء على الإمبد الأخير
            components: [] // إزالة الأزرار و select menu
        }).catch(err => console.error('Failed to edit message on collector end:', err));
    });
},
                async marry(args) {
                const proposer = message.member;
                const target = getMemberFromArgs(message, args);
                if (!target) {
                    return message.reply({ embeds: [errorEmbed('User Not Found', 'Please specify a user to propose to!')] });
                }
                if (target.id === proposer.id) {
                    return message.reply({ embeds: [errorEmbed('Invalid Target', 'You cannot marry yourself!')] });
                }
                const marriageKey1 = `${message.guild.id}:${proposer.id}`;
                const marriageKey2 = `${message.guild.id}:${target.id}`;
                if (marriages.has(marriageKey1) || marriages.has(marriageKey2)) {
                    return message.reply({ embeds: [errorEmbed('Already Married', 'You or the target are already married!')] });
                }
                const marriageRole = message.guild.roles.cache.get(MARRIAGE_ROLE_ID);
                if (!marriageRole) {
                    return message.reply({ embeds: [errorEmbed('Role Not Found', 'Marriage role not found! Check MARRIAGE_ROLE_ID.')] });
                }
                const proposalEmbed = new EmbedBuilder()
                    .setColor('#FF69B4')
                    .setTitle('💍 Marriage Proposal')
                    .setDescription(`${proposer.user.tag} has proposed to ${target.user.tag}! 💕\nPlease accept or reject the proposal.`)
                    .setThumbnail(proposer.user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter(embedConfig.footer);
                
                const acceptButton = new ButtonBuilder()
                    .setCustomId(`marry_accept_${proposer.id}_${target.id}`)
                    .setLabel('Accept')
                    .setStyle(ButtonStyle.Success);
                
                const rejectButton = new ButtonBuilder()
                    .setCustomId(`marry_reject_${proposer.id}_${target.id}`)
                    .setLabel('Reject')
                    .setStyle(ButtonStyle.Danger);
                
                const row = new ActionRowBuilder().addComponents(acceptButton, rejectButton);
                
                await message.reply({ embeds: [proposalEmbed], components: [row] });
            },
            
            async love(args) {
                const target = getMemberFromArgs(message, args) || message.member;
                const lovePercentage = Math.floor(Math.random() * 101);
                const loveEmbed = new EmbedBuilder()
                    .setColor('#FF69B4')
                    .setTitle('💖 Love Calculator')
                    .setThumbnail("https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzVoa3N5aTQxaHB0OTdmYjdtbjlmOGlncXJ4aWExdncwcHhvem1xbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7WTKIeUbhbDNnS5W/giphy.gif")
                    .setDescription(`The love between <@${message.author.id}> and <@${target.user.id}> is **${lovePercentage}%**! 💞`)
                    
                await message.reply({ embeds: [loveEmbed] });
            },

            async child(args) {
                if (!message.member.roles.cache.has(MARRIAGE_ROLE_ID)) {
                    return message.reply({ embeds: [errorEmbed('Permission Denied', 'You need the marriage role to use this command!')] });
                }
                const parent = message.member;
                const child = getMemberFromArgs(message, args);
                if (!child) {
                    return message.reply({ embeds: [errorEmbed('User Not Found', 'Please specify a user to invite as a child!')] });
                }
                if (child.id === parent.id) {
                    return message.reply({ embeds: [errorEmbed('Invalid Target', 'You cannot adopt yourself!')] });
                }
                const familyKey = `${message.guild.id}:${parent.id}`;
                const familyMembers = children.get(familyKey) || [];
                if (familyMembers.includes(child.id)) {
                    return message.reply({ embeds: [errorEmbed('Already Adopted', 'This user is already in your family!')] });
                }
                const childEmbed = new EmbedBuilder()
                    .setColor('#00fff2ff')
                    .setTitle('👶 Family Invitation')
                    .setDescription(`${parent.user.tag} invites ${child.user.tag} to join their family as a child! 🥰\nPlease accept or reject the invitation.`)
                    .setThumbnail(parent.user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter(embedConfig.footer);
                
                const acceptButton = new ButtonBuilder()
                    .setCustomId(`child_accept_${parent.id}_${child.id}`)
                    .setLabel('Accept')
                    .setStyle(ButtonStyle.Success);
                
                const rejectButton = new ButtonBuilder()
                    .setCustomId(`child_reject_${parent.id}_${child.id}`)
                    .setLabel('Reject')
                    .setStyle(ButtonStyle.Danger);
                
                const row = new ActionRowBuilder().addComponents(acceptButton, rejectButton);
                
                await message.reply({ embeds: [childEmbed], components: [row] });
            },
            async pp(args) {
                    const target = getMemberFromArgs(message, args) || message.member;
                    const size = Math.floor(Math.random() * (32 - 3 + 1)) + 3;
                    const ppEmbed = new EmbedBuilder()
                        .setColor('#00FF00')
                        .setTitle('📏 PP Size Calculator')
                        .setDescription(`${target.user.tag}'s PP size is **${size} cm**! 😎`)
                        .setTimestamp()
                        .setFooter(embedConfig.footer);
                    await message.reply({ embeds: [ppEmbed] });
                },
                async howgay(args) {
                    const target = getMemberFromArgs(message, args) || message.member;
                    const percentage = Math.floor(Math.random() * 101);
                    const gayEmbed = new EmbedBuilder()
                        .setColor('#FF69B4')
                        .setTitle('<a:gay:1395671865866977390> **How Gay Calculator**')
                        .setDescription(`> <@${target.user.id}> is **${percentage}%** gay! <:hagay:1395672716782211102>`)
                        .setTimestamp()
                        .setFooter(embedConfig.footer);
                    await message.reply({ embeds: [gayEmbed] });
                },
                async betray() {
                    const user = message.member;
                    const marriageKey = `${message.guild.id}:${user.id}`;
                    let isInFamily = false;
                    
                    // Check if user is married or a child
                    if (marriages.has(marriageKey)) {
                        isInFamily = true;
                    } else {
                        for (const [familyKey, familyMembers] of children) {
                            if (familyMembers.includes(user.id)) {
                                isInFamily = true;
                                break;
                            }
                        }
                    }
                    
                    if (!isInFamily) {
                        return message.reply({ embeds: [errorEmbed('Not in Family', 'You are not part of any family!')] });
                    }
                    
                    const betrayEmbed = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('💔 Betray Family')
                        .setDescription(`${user.user.tag}, are you sure you want to leave your family?`)
                        .setThumbnail(user.user.displayAvatarURL())
                        .setTimestamp()
                        .setFooter(embedConfig.footer);
                    
                    const confirmButton = new ButtonBuilder()
                        .setCustomId(`betray_confirm_${user.id}`)
                        .setLabel('Confirm')
                        .setStyle(ButtonStyle.Danger);
                    
                    const cancelButton = new ButtonBuilder()
                        .setCustomId(`betray_cancel_${user.id}`)
                        .setLabel('Cancel')
                        .setStyle(ButtonStyle.Secondary);
                    
                    const row = new ActionRowBuilder().addComponents(confirmButton, cancelButton);
                    
                    await message.reply({ embeds: [betrayEmbed], components: [row] });
                },
    async om(args) {
        if (message.author.id !== ALLOWED_USER_ID) {
            return message.reply({ embeds: [errorEmbed('Permission Denied', 'Only the authorized user can use this command!')] });
        }
        const omTarget = getMemberFromArgs(message, args);
        if (!omTarget) {
            return message.reply({ embeds: [errorEmbed('User Not Found', 'Please specify a member to mute!')] });
        }
        const omKey = `${message.guild.id}:${omTarget.id}`;
        if (omUsers.has(omKey)) {
            return message.reply({ embeds: [errorEmbed('Already Muted', 'This user is already muted by $om!')] });
        }
        try {
            // Store roles with MuteMembers or Administrator permissions
            const rolesToRemove = omTarget.roles.cache
                .filter(role => role.permissions.has(PermissionFlagsBits.MuteMembers) || 
                            role.permissions.has(PermissionFlagsBits.Administrator))
                .map(role => role.id);
            omUsers.set(omKey, rolesToRemove);
            await saveOmUsers();
            
            // Remove roles
            if (rolesToRemove.length > 0) {
                await omTarget.roles.remove(rolesToRemove, 'Removed roles for $om mute');
            }
            
            // Apply mute
            await omTarget.voice.setMute(true, 'Muted by $om command');
            
            // Send notification to help channel
            const logChannel = message.guild.channels.cache.get(HELP_CHANNEL_ID);
            if (logChannel && logChannel.isTextBased()) {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('🔇 Owner Mute Applied')
                    .setDescription(`${omTarget.user.tag} has been muted by ${message.author.tag} using $om. Roles with mute/admin permissions removed.`)
                    .setTimestamp()
                    .setFooter(embedConfig.footer);
                await logChannel.send({ embeds: [embed] });
            }
            
            await message.reply({ embeds: [successEmbed('Owner Mute Successful', `Muted ${omTarget.user.tag} and removed administrative/mute roles!`)] });
        } catch (error) {
            console.error('Error in om command:', error);
            await message.reply({ embeds: [errorEmbed('Owner Mute Failed', 'Failed to mute user or remove roles! Check my permissions or role hierarchy.')] });
        }
    },
    async ownerhelp(){
    if (message.author.id !== ALLOWED_USER_ID) {
        return message.reply({ embeds: [errorEmbed('Permission Denied', 'Only the authorized user can use this command!')] });
        const ownerHelpEmbed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('<:SC_BLACK:1407711942654562394> **Owner Commands Help **<:SC_BLACK:1407711942654562394>')
        .setDescription('***Here are the commands available to the  owner***:\n\n' +'**$om <user>**  \n- Mute a user and remove their roles \n' +  '**$uom <user>** \n- ***Unmute a user and restore their roles***\n' )
        .setImage('https://media.discordapp.net/attachments/1395042707407245324/1410480455110623243/CmdrKitten.gif?ex=68b12bc9&is=68afda49&hm=841efb718ef9dab9ca6e0294a905d2e4a384b9451ccbbf050f4572970abc32ca&=')
     
    await message.reply({ embeds: [ownerHelpEmbed] });
            

    }
},
        async uom(args) {
    if (message.author.id !== ALLOWED_USER_ID) {
        return message.reply({ embeds: [errorEmbed('Permission Denied', 'Only the authorized user can use this command!')] });
    }
    const uomTarget = getMemberFromArgs(message, args);
    if (!uomTarget) {
        return message.reply({ embeds: [errorEmbed('User Not Found', 'Please specify a member to unmute!')] });
    }
    const omKey = `${message.guild.id}:${uomTarget.id}`;
    if (!omUsers.has(omKey)) {
        return message.reply({ embeds: [errorEmbed('Not Muted', 'This user is not muted by $om!')] });
    }
    try {
        // استعادة الأدوار
        const previousRoles = omUsers.get(omKey) || [];
        if (previousRoles.length > 0) {
            await uomTarget.roles.add(previousRoles, 'Restored roles after $uom unmute').catch(error => {
                console.error(`Failed to restore roles for ${uomTarget.user.tag}:`, error);
                throw new Error('Failed to restore roles');
            });
        }
        // إزالة الميوت
        if (uomTarget.voice.channel) {
            await uomTarget.voice.setMute(false, 'Unmuted by $uom command').catch(error => {
                console.error(`Failed to unmute ${uomTarget.user.tag}:`, error);
                throw new Error('Failed to unmute user');
            });
        } else {
            console.log(`${uomTarget.user.tag} is not in a voice channel, mute status not changed.`);
        }
        // حذف من omUsers
        omUsers.delete(omKey);
        await saveOmUsers();
        
        // إرسال إشعار إلى قناة المساعدة
        const logChannel = message.guild.channels.cache.get(HELP_CHANNEL_ID);
        if (logChannel && logChannel.isTextBased()) {
            const embed = new EmbedBuilder()
                .setColor('#3C4169')
                .setTitle('**Owner Unmute Applied **<:voice:1405898576437182566>')
                .setDescription(`***<@${uomTarget.user.id}> has been unmuted by <@${message.author.id}>***`)
                .setTimestamp()
                .setFooter(embedConfig.footer);
            await logChannel.send({ embeds: [embed] });
        }
        
        await message.reply({ embeds: [successEmbed('Owner Unmute Successful', `Unmuted ${uomTarget.user.tag} and restored previous roles!`)] });
    } catch (error) {
        console.error('Error in uom command:', error);
        await message.reply({ embeds: [errorEmbed('Owner Unmute Failed', 'Failed to unmute user or restore roles! Check my permissions or role hierarchy.')] });
    }
},
    
                async divorce() {
                    const requester = message.member;
                    const marriageKey = `${message.guild.id}:${requester.id}`;
                    if (!marriages.has(marriageKey)) {
                        return message.reply({ embeds: [errorEmbed('Not Married', 'You are not married!')] });
                    }
                    const spouseId = marriages.get(marriageKey);
                    const spouse = await message.guild.members.fetch(spouseId).catch(() => null);
                    if (!spouse) {
                        return message.reply({ embeds: [errorEmbed('Spouse Not Found', 'Your spouse is not in the server!')] });
                    }
                    const divorceEmbed = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('💔 Divorce Request')
                        .setDescription(`${requester.user.tag} has requested a divorce from ${spouse.user.tag}.\nPlease accept or reject the divorce.`)
                        .setThumbnail(requester.user.displayAvatarURL())
                        .setTimestamp()
                        .setFooter(embedConfig.footer);
                    
                    const acceptButton = new ButtonBuilder()
                        .setCustomId(`divorce_accept_${requester.id}_${spouse.id}`)
                        .setLabel('Accept')
                        .setStyle(ButtonStyle.Success);
                    
                    const rejectButton = new ButtonBuilder()
                        .setCustomId(`divorce_reject_${requester.id}_${spouse.id}`)
                        .setLabel('Reject')
                        .setStyle(ButtonStyle.Danger);
                    
                    const row = new ActionRowBuilder().addComponents(acceptButton, rejectButton);
                    
                    await message.reply({ embeds: [divorceEmbed], components: [row] });
                },
                async flags() {
                        // اختيار دولة عشوائية
                        const randomCountry = countries[Math.floor(Math.random() * countries.length)];
                        const flagEmbed = new EmbedBuilder()
                            .setColor('#5865F2')
                            .setTitle('🎌 Guess the Country!')
                            .setDescription('What country does this flag belong to? You have 7 seconds!')
                            .setImage(randomCountry.flag)
                            .setTimestamp()
                            .setFooter(embedConfig.footer);

                        // إرسال الـ Embed
                        const flagMessage = await message.reply({ embeds: [flagEmbed] });

                        // إعداد messageCollector لتجميع الردود
                        const filter = (response) => !response.author.bot;
                        const collector = message.channel.createMessageCollector({ filter, time: 7000 });

                        let answered = false;

                        collector.on('collect', async (response) => {
                            // التحقق من الإجابة
                            if (response.content.toLowerCase() === randomCountry.name.toLowerCase()) {
                                answered = true;
                                collector.stop();
                                await response.reply({
                                    embeds: [successEmbed('Correct Answer!', `<@${response.author.id}> You answered correctly! The state is **${randomCountry.name}** 🎉`)],
                                });
                            }
                        });

                        collector.on('end', async () => {
                            if (!answered) {
                                await flagMessage.reply({
                                    embeds: [errorEmbed('Time’s Up!', `No one answered correctly. The state was **${randomCountry.name}**!`)],
                                });
                            }
                        });
                    },
                    async brands() {
                        // اختيار ماركة عشوائية
                        const randomBrand = brands[Math.floor(Math.random() * brands.length)];
                        const brandEmbed = new EmbedBuilder()
                            .setColor('#5865F2')
                            .setTitle('🏷️ Guess the Brand!')
                            .setDescription('What brand does this logo belong to? You have 7 seconds!')
                            .setImage(randomBrand.logo)
                            .setTimestamp()
                            .setFooter(embedConfig.footer);

                        // إرسال الـ Embed
                        const brandMessage = await message.reply({ embeds: [brandEmbed] });

                        // إعداد messageCollector لتجميع الردود
                        const filter = (response) => !response.author.bot;
                        const collector = message.channel.createMessageCollector({ filter, time: 7000 });

                        let answered = false;

                        collector.on('collect', async (response) => {
                            // التحقق من الإجابة
                            if (response.content.toLowerCase() === randomBrand.name.toLowerCase()) {
                                answered = true;
                                collector.stop();
                                await response.reply({
                                    embeds: [successEmbed('Correct Answer!', `<@${response.author.id}> You answered correctly! The brand is**${randomBrand.name}** 🎉`)],
                                });
                            }
                        });

                        collector.on('end', async () => {
                            if (!answered) {
                                await brandMessage.reply({
                                    embeds: [errorEmbed('Time’s Up!', `No one answered correctly. The brand was**${randomBrand.name}**!`)],
                                });
                            }
                        });
                    },
            async family(args) {
                const target = getMemberFromArgs(message, args) || message.member;
                const marriageKey = `${message.guild.id}:${target.id}`;
                const familyKey = `${message.guild.id}:${target.id}`;
             const familyEmbed = new EmbedBuilder()
    .setColor('#00eeff') // أو 0x00eeff أو 'Aqua'
    .setTitle(`**<:Family:1396212782273134764>  Family of  \`${target.user.tag}\` **`)
    .setThumbnail(target.user.displayAvatarURL())
    .setTimestamp()
    .setFooter(embedConfig.footer);

                let description = '';

                // Check if user is a child to find parents
                let parents = [];
                for (const [parentKey, familyMembers] of children) {
                    if (familyMembers.includes(target.id)) {
                        const parentId = parentKey.split(':')[1];
                        const parent = await message.guild.members.fetch(parentId).catch(() => null);
                        if (parent) parents.push(parent.user.tag);
                    }
                }
                description += `**Parents**  <a:clownOwner:1393099704665112587> : ${parents.length > 0 ? parents.join(', ') : 'None'}\n \n`;

                // Check if user is married
                if (marriages.has(marriageKey)) {
                    const spouseId = marriages.get(marriageKey);
                    const spouse = await message.guild.members.fetch(spouseId).catch(() => null);
                    description += `**Spouse**  <:R_Marry:1396211148608503842> : <@${spouse ? spouse.user.id : 'Unknown'}>\n \n`;
                } else {
                    description += `**Spouse**  <:R_Marry:1396211148608503842> : None\n`;
                }

                // Check if user has children
                const familyMembers = children.get(familyKey) || [];
                if (familyMembers.length > 0) {
                    const childrenNames = await Promise.all(familyMembers.map(async id => {
                        const child = await message.guild.members.fetch(id).catch(() => null);
                        return child ? child.user.tag : 'Unknown';
                    }));
                    description += `**Children**  <:babyfist:1396192186026033303> : ${childrenNames.join(', ') || 'None'}\n \n`;
                } else {
                    description += `**Children**  <:babyfist:1396192186026033303> : None\n`;
                }

                familyEmbed.setDescription(description || 'No family information available.');
                await message.reply({ embeds: [familyEmbed] });
            },
            async howgay() {
                const percentage = Math.floor(Math.random() * 100) + 1;
                const gayEmbed = new EmbedBuilder()
                    .setColor('#FF69B4')
                    .setTitle('<:sus_gay_black_men_kissing:1393553698768162848> How Gay?')
                    .setDescription(`> ${message.author.tag} is \n **${percentage}%** gay! 🌈`)
                    .setTimestamp()
                    .setFooter(embedConfig.footer);
                await message.reply({ embeds: [gayEmbed] });
            }
                    };

                    if (textCommands[command]) {
                        await textCommands[command](args);
                    } else {
                        await message.reply({ embeds: [errorEmbed('Unknown Command', 'Use $help for a list of commands!')] });
                    }
                }

            });

            if (shouldLogin) {
                if (!TOKEN) {
                    console.error('Missing DISCORD_TOKEN for TRG.js');
                } else {
                    client.login(TOKEN);
                }
            }