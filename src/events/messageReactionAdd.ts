import { MessageReaction, User, PartialUser, GuildMember, Role, TextChannel } from 'discord.js';

import RoleReaction from '../entities/RoleReaction';
import { EventHandler, Event } from '../types/Event';
import { getNorthernOrder } from '..';
import { channels } from '../config';

const handler: EventHandler = async (reaction: MessageReaction, user: User | PartialUser) => {
  const north = getNorthernOrder();
  if (user.bot) return;
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.log(error);
      return;
    }
  }

  if (reaction.message.channel.id !== channels.roles) return;

  const roleReactions = await RoleReaction.find({ cache: 60000 });
  if (roleReactions.length === 0) return;

  const roleReaction = roleReactions.find((role) => role.emoji === reaction.emoji.name);
  if (!roleReaction) return;

  const member = north.members.cache.get(user.id) as GuildMember;
  const role = north.roles.cache.get(roleReaction.roleID) as Role;

  await member.roles.add(role);

  const responseMsg = await (north.channels.cache.get('683063308827361342') as TextChannel).send(
    `Added '${role.name}' role to user <@${user.id}>!`,
  );

  setTimeout(() => {
    responseMsg.delete();
  }, 5000);
};

const messageReactionAdd: Event = {
  name: 'messageReactionAdd',
  handler,
};

export default messageReactionAdd;
