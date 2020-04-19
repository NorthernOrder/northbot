import fs from 'fs';
import path from 'path';

import { Collection, Message, TextChannel } from 'discord.js';

import { channels, freeGameFilters, roles } from '../config';
import { bot, getNorthernOrder } from '..';
import { Event, EventHandler } from '../Event';
import { Command, Permission } from '../Command';

// collection of all the implemented commands
export const commands = new Collection<string, Command>();

// list of all the files that have command implementations
const commandFiles = fs
  .readdirSync(path.join(__dirname, '..', 'commands'))
  .filter((file: string) => file.endsWith('.ts') || file.endsWith('.js'));

// load all commands to the collection for later use
commandFiles.forEach(async (file) => {
  const commandImport = await import(path.join(__dirname, '..', 'commands', file));
  const command = commandImport.default as Command;
  commands.set(command.name, command);
});

// handler for the private server's free games channel's messages
const handleFreeGame = (msg: Message) => {
  const north = getNorthernOrder();
  if (!north) throw new Error('No NRTH, WTF?');

  // get end of game store tag of message
  const storeTagEnd = msg.content.indexOf(']');

  // get the store tag from the message
  const storeTag = msg.content.slice(1, storeTagEnd).toLowerCase();

  // check that the store is included in our filters
  let included = false;

  freeGameFilters.forEach((filter) => {
    if (storeTag.includes(filter)) included = true;
  });

  if (!included) return;

  // send message to NRTH #free-games channel
  (north.channels.cache.get(channels.nrthFreeGames) as TextChannel).send([
    '<@&683725383408943212>,',
    msg.content,
  ]);
};

const handler: EventHandler = async (msg: Message) => {
  const north = getNorthernOrder();
  if (!north) return;
  // if message is coming from the private server's free games channel handle it separately
  if (msg.channel.id === channels.privateFreeGames) {
    handleFreeGame(msg);
    return;
  }

  // ignore messages sent by a bot
  if (msg.author.bot) return;

  // no DMs yet
  if (!msg.member || !msg.guild) return;

  // f in chat
  if (msg.content.toLowerCase() === 'f') {
    const FEmoji = bot.emojis.cache.get('682623831726227542');
    if (!FEmoji) return;
    await msg.react(FEmoji);
    return;
  }

  // must use prefix
  if (!msg.content.startsWith(process.env.PREFIX)) return;

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
