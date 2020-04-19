import { MessageEmbed } from 'discord.js';

import { Executor, Command, Permission } from '../Command';
import { commands } from '../events/message';

const executor: Executor = async (msg) => {
  const embed = new MessageEmbed();
  embed.setTitle('North Bot - Help');
  commands.forEach((c) => {
    embed.addField(c.name, c.description);
  });
  await msg.channel.send(embed);
};

const help: Command = {
  name: 'help',
  description: 'The command you just ran',
  permission: Permission.Everyone,
  execute: executor,
};

export default help;
