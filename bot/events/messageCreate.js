module.exports = {
  name: 'messageCreate',
  async execute(message, context) {
    const { client, config } = context;

    if (message.author.bot) {
      return;
    }

    const prefix = '$';
    if (!message.content.startsWith(prefix)) {
      return;
    }

    const [commandName, ...args] = message.content.slice(prefix.length).trim().split(/\s+/);
    const command = client.commands.get(commandName?.toLowerCase());
    if (!command) {
      return;
    }

    try {
      await command.execute(message, args, { client, config });
    } catch (error) {
      console.error(`Command ${commandName} failed`, error);
      await message.reply('Something went wrong while executing that command.');
    }
  },
};
