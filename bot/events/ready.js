module.exports = {
  name: 'clientReady',
  once: true,
  execute(client, context) {
    console.log(`Bot logged in as ${client.user.tag}`);
    if (context?.config) {
      const { startPendingMonitor } = require('../utils/pending');
      startPendingMonitor(client, context.config);
    }
  },
};
