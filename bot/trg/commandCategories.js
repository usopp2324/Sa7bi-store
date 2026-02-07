module.exports = {
  moderation: {
    name: 'Moderation',
    emoji: '<:ag_mod_black_shield:1405897818908000397>',
    description: 'Commands for moderating the server',
    commands: [
      {
        name: '<a:arow1:1455595655929139465> ``$ban`` <user_id/user> [reason]',
        description: '***Ban a member from the server***',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$kick`` <user_id/user> [reason]',
        description: '***Kick a member from the server***',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$mute`` <user_id/user> [duration] [reason]',
        description: '***Mute a member (server mute) for specified duration***',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$unmute`` <user_id/user>',
        description: '***Unmute a member (server mute)***',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$unmutevoice`` <user_id/user>',
        description: '***Unmute a member in voice channels***',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$unban`` <user_id/user>',
        description: '***Unban a member from the server***',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$warn`` <user_id/user> [reason]',
        description: '***Give a warning to a member***',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$unwarn`` <user_id/user> <warnid>',
        description: '***Remove a warning from a member***',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$warns`` [user_id/user]',
        description: '***Show warnings for a member***',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$jaillogs`` <user_id/user>',
        description: '***Show jail logs for a member***',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$clear`` <amount>',
        description: '***Delete messages in current channel***',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$lock``',
        description: '***Lock the current channel***',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$unlock``',
        description: '***Unlock the current channel***',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$giverole`` <user_id/user> <role>',
        description: '***Give a role to a member***',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$jail`` <user_id/user>',
        description: '***Jail a member (remove all roles)***',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$unjail`` <user_id/user>',
        description: '***Unjail a member (restore roles)***',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$nick`` <user_id/user> <nickname>',
        description: "***Change a member's nickname***",
      },
      {
        name: '<a:arow1:1455595655929139465> ``$timeout`` <user_id/user> [duration] [reason]',
        description: '***Timeout a member (max 1440 minutes)***',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$untimeout`` <user_id/user>',
        description: '***Remove timeout from a member***',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$hnina`` <user_id/user> [duration]',
        description:
          '***Mute a member from sending messages in all text channels for a specified duration***',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$hdr`` <user_id/user>',
        description:
          '***Unmute a member, restoring their ability to send messages in text channels***',
      },
    ],
  },
  voice: {
    name: 'Voice',
    emoji: '<:voice:1405898576437182566>',
    description: 'voice channel management',
    commands: [
      {
        name: '<a:arow1:1455595655929139465> ``$move``',
        description: 'Move a user to your voice channel',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$mperm``',
        description: 'Grant voice permissions to a user',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$moveall``',
        description: 'Move all members from source to target voice channel',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$locate`` <user_id/user>',
        description: 'Find which voice channel a user is in',
      },
    ],
  },
  information: {
    name: 'Information',
    emoji: '<:info_icon:1393519748750512169>',
    description: 'Commands to get information about users and server',
    commands: [
      {
        name: '<a:arow1:1455595655929139465>  ``$server``',
        description: 'Display server information',
      },
      {
        name: '<a:arow1:1455595655929139465>  ``$user``',
        description: 'Show user information',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$avatar``',
        description: "Display user's avatar",
      },
    ],
  },
  utility: {
    name: 'Utility',
    emoji: '<:utility:1405898239718199367>',
    description: 'Utility commands ',
    commands: [
      {
        name: '<a:arow1:1455595655929139465> ``$help``',
        description: 'Show this help menu',
      },
    ],
  },
  social: {
    name: 'Social',
    emoji: '<:black_rose:1405898010319388813>',
    description: 'Commands for social interactions and fun',
    commands: [
      {
        name: '<a:arow1:1455595655929139465> ``$marry`` **User**',
        description: 'Propose marriage to a user',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$divorce``',
        description: 'Request a divorce from your spouse',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$love`` **User**',
        description: 'Check love percentage with a user',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$pp`` **User**',
        description: 'Get a random "size" for a user (fun command)',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$child`` **User**',
        description: 'Invite a user to join your family as a child (requires marriage role)',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$betray``',
        description: 'Leave your family (requires being in a family)',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$howgay`` **User**',
        description: 'Get a random "gay percentage" for a user (fun command)',
      },
      {
        name: '<a:arow1:1455595655929139465> ``$family`` **User**',
        description: "View your family or another user's family",
      },
    ],
  },
  ticket: {
    name: 'Tickets',
    emoji: '🎫',
    description: 'Commands for managing tickets',
    commands: [
      { name: '<a:arow1:1455595655929139465> `$ticket`', description: '***Create a ticket panel***' },
      { name: '<a:arow1:1455595655929139465> `$close`', description: '***Close an open ticket***' },
      { name: '<a:arow1:1455595655929139465> `$claim`', description: '***Claim a ticket ***' },
      { name: '<a:arow1:1455595655929139465> `$unclaim`', description: '***Unclaim a ticket***' },
      { name: '<a:arow1:1455595655929139465> `$topticket`', description: '***Show top 10 ticket claimers***' },
      { name: '<a:arow1:1455595655929139465> `$addtk`', description: '***add user to ur ticket***' },
      { name: '<a:arow1:1455595655929139465> `$removetk`', description: '***remove user from ur ticket***' },
    ],
  },
  games: {
    name: 'Games',
    emoji: '🎮',
    description: 'Commands for fun and games',
    commands: [
      { name: '<a:arow1:1455595655929139465> `$flags`', description: 'Guess the country from its flag!' },
      { name: '<a:arow1:1455595655929139465> `$brands`', description: 'Guess the brand from its logo!' },
      { name: '<a:arow1:1455595655929139465> `$xo <user or id>`', description: 'Challenge a user to play Tic-Tac-Toe!' },
    ],
  },
};
