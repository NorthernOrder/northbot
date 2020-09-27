import { TextChannel } from 'discord.js';

import { Command, Executor, Permission } from '../types/Command';
import { getNorthernOrder } from '..';
import { channels } from '../config';

const executor: Executor = async (message, args) => {
  const north = getNorthernOrder();

  const data = JSON.parse(args.join(' '));
  const voteChannel = north.channels.cache.get(channels.votes) as TextChannel;

  const msg = await voteChannel.send(data.message);

  for (const reaction of data.reactions) {
    await msg.react(reaction);
  }

  await message.delete();
};

const addVote: Command = {
  name: 'addVote',
  usage: 'addVote <JSON>',
  description: 'Adds a vote to the #vote channel',
  permission: Permission.Admin,
  execute: executor,
};

export default addVote;
