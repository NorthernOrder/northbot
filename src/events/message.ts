import fs from 'fs';
import path from 'path';

import { Collection, Message } from 'discord.js';

import { roles } from '../config';
import { P } from '..';
import { Event, MessageEventHandler } from '../types/Event';
import { Command, Permission } from '../types/Command';

// collection of all the implemented commands
export const commands = new Collection<string, Command>();

// list of all the files that have command implementations
const commandFiles = fs.readdirSync(path.join(__dirname, '..', 'commands'));

// load all commands to the collection for later use
commandFiles.forEach(async (file) => {
  const commandImport = await import(path.join(__dirname, '..', 'commands', file));
  const command = commandImport.default as Command;
  commands.set(command.name, command);
});

const handler: MessageEventHandler = async (msg: Message) => {
  // ignore messages sent by a bot
  if (msg.author.bot) return;

  // no DMs yet
  if (!msg.member || !msg.guild) return;

  // must use prefix
  if (!msg.content.startsWith(P)) return;

  // slice the message content to the command name and argument list
  const [cmd, ...args] = msg.content.slice(1).split(' ');

  // find the command from the command list
  const command = commands.get(cmd);

  // if we can't find a command, do nothing
  if (!command) return;

  // Permission Checks
  // Staff
  if (command.permission === Permission.Staff && !msg.member.roles.cache.has(roles.staff)) {
    return;
  }

  // Admin
  if (command.permission === Permission.Admin && !msg.member.roles.cache.has(roles.admin)) {
    return;
  }

  // Owner
  if (command.permission === Permission.Owner && msg.author.id !== msg.guild.ownerID) {
    return;
  }

  // try to execute the command, if it fails tell the user and log the error to console
  try {
    await command.execute(msg, args);
  } catch (error) {
    msg.reply(`Error running command \`${cmd}\``);
    console.log(`Error running command \`${cmd}\`:`);
    console.log(error);
  }
};

const messageEvent: Event = {
  name: 'message',
  handler,
};

export default messageEvent;
