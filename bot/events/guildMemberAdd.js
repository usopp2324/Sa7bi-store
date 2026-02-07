const { handleMemberJoin } = require('../utils/pending');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, context) {
    try {
      await handleMemberJoin(member, context.client, context.config);
    } catch (error) {
      console.warn('Member join handler failed:', error.message);
    }
  },
};
