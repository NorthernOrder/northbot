import { Message, TextChannel } from 'discord.js';

import { Command, Executor, Permission } from '../types/Command';
import { channels } from '../config';
import {
  InteractiveCallback,
  InteractiveCommand,
  interactiveUsers,
} from '../events/interactiveCommands';
import { errorMsg } from '../utils/chat';
import { getNorthernOrder, P } from '..';
import RoleReaction from '../entities/RoleReaction';

const getSelfAssignable = async (msg: Message, cmd: InteractiveCommand): Promise<boolean> => {
  const m = await msg.channel.send('Will the role be self assignable?');
  await m.react('✅');
  await m.react('❌');
  const collected = await m.awaitReactions(
    (reaction, user) => {
      return ['✅', '❌'].includes(reaction.emoji.name) && user.id === msg.author.id;
    },
    { max: 1, time: 10000, errors: ['time'] },
  );
  const reaction = collected.first();
  if (reaction?.emoji.name === '✅') {
    cmd.state.selfAddable = true;
  } else if (reaction?.emoji.name === '❌') {
    cmd.state.selfAddable = false;
  } else {
    await errorMsg(msg, "Didn't react with correct emoji cancelling...");
    interactiveUsers.delete(msg.author.id);
    return false;
  }
  return true;
};

const getEmoji = async (msg: Message, cmd: InteractiveCommand): Promise<void> => {
  const m = await msg.channel.send(
    'React to this message with an emoji to use as reaction to add and remove the role from users',
  );
  const collected = await m.awaitReactions(
    (_reaction, user) => {
      return user.id === msg.author.id;
    },
    { max: 1, time: 60000, errors: ['time'] },
  );
  const reaction = collected.first()?.emoji.name;
  cmd.state.emoji = reaction;
};

const callback: InteractiveCallback = async (msg, cmd) => {
  if (msg.content === `${P}cancel`) {
    msg.channel.send('Canceled');
    interactiveUsers.delete(msg.author.id);
    return;
  }

  if (cmd.state.category === null) {
    cmd.state.category = msg.content;
    const selfAssignableStatus = await getSelfAssignable(msg, cmd);
    if (!selfAssignableStatus) return;
    if (cmd.state.selfAddable) {
      await getEmoji(msg, cmd);
    }
    const north = getNorthernOrder();
    const role = await north.roles.create({
      data: {
        name: cmd.state.name,
      },
    });
    if (cmd.state.selfAddable) {
      const rolesChannel = north.channels.cache.get(channels.roles) as TextChannel;
      const roleMsg = await rolesChannel.send(role.name);
      await roleMsg.react(cmd.state.emoji);
      await RoleReaction.create({
        msgID: roleMsg.id,
        emoji: cmd.state.emoji,
        roleID: role.id,
      }).save();
    }
    msg.channel.send('Role created');
    interactiveUsers.delete(msg.author.id);
  } else {
    interactiveUsers.delete(msg.author.id);
  }
};

const executor: Executor = async (message, args) => {
  if (message.channel.id === channels.roles) {
    await errorMsg(message, 'You may not add a role in the roles channel');
    return;
  }

  if (args.length === 0) {
    await errorMsg(message, 'You need to provide a name for the role to create');
    return;
  }

  const msg = await message.channel.send(
    `What is the category of the role? (Type ${P}cancel to cancel)`,
  );

  interactiveUsers.set(message.author.id, {
    channel: message.channel.id,
    callback,
    message: msg.id,
    state: {
      name: args.join(' '),
      category: null,
      selfAddable: null,
      emoji: null,
    },
  });
};

const addReactionRole: Command = {
  name: 'addRole',
  usage: 'addRole <name>',
  description: 'Creates a new role',
  permission: Permission.Admin,
  execute: executor,
};

export default addReactionRole;
