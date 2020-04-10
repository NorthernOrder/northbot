import { TextChannel } from 'discord.js';

import RoleReaction from '../entities/RoleReaction';
import { Command, Executor } from '../Command';
import { getNorthernOrder } from '..';
import { channels } from '../config';

const executor: Executor = async (message, args) => {
  const north = getNorthernOrder();
  if (!north) throw new Error('No NRTH, WTF?');

  const data = JSON.parse(args.join(' '));
  const roleChannel = north.channels.cache.get(channels.roles) as TextChannel;

  const msg = await roleChannel.send(data.message);

  for (const role of data.roles) {
    await RoleReaction.create({ msgID: msg.id, emoji: role.emoji, roleID: role.id }).save();
    await msg.react(role.emoji);
  }

  await message.delete();
};

const addReactionRole: Command = {
  name: 'addReactionRole',
  description: 'Adds a reaction role to the #roles channel',
  execute: executor,
};

export default addReactionRole;
