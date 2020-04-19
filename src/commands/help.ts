import { MessageEmbed } from 'discord.js';

import { Executor, Command, Permission } from '../Command';
import { commands } from '../events/message';
import { roles } from '../config';

const executor: Executor = async (msg, args) => {
  const embed = new MessageEmbed();

  if (args.length === 0) {
    embed.setTitle('Commands');

    commands.forEach((cmd) => {
      // Staff
      if (cmd.permission === Permission.Staff && !msg.member?.roles.cache.has(roles.staff)) {
        return;
      }

      // Admin
      if (cmd.permission === Permission.Admin && !msg.member?.roles.cache.has(roles.admin)) {
        return;
      }

      // Owner
      if (cmd.permission === Permission.Owner && msg.author.id !== msg.guild?.ownerID) {
        return;
      }
      embed.addField(cmd.name, cmd.description);
    });
  } else {
    const command = commands.find((cmd) => cmd.name === args[0]);
    if (!command) {
      embed.setTitle('Commands');
      embed.setDescription(`Unknown command ${args[0]}`);
    } else {
      embed.setTitle(`Help - ${command.name}`);
      embed.addField('Usage', '`' + command.usage + '`');
      embed.addField('Description', command.description);
      embed.addField('Permission', command.permission);
    }
  }

  await msg.channel.send(embed);
};

const help: Command = {
  name: 'help',
  usage: 'help [command]',
  description: "Shows info about this bot's commands",
  permission: Permission.Everyone,
  execute: executor,
};

export default help;
