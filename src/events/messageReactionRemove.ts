import { MessageReaction, User, PartialUser, TextChannel, GuildMember, Role } from 'discord.js';

import RoleReaction from '../entities/RoleReaction';
import { EventHandler, Event } from '../Event';
import { getNorthernOrder } from '..';

const handler: EventHandler = async (reaction: MessageReaction, user: User | PartialUser) => {
  const north = getNorthernOrder();
  if (!north) throw new Error('No NRTH, WTF?');
  if (user.bot) return;
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.log(error);
      return;
    }
  }

  const roleReactions = await RoleReaction.find({ cache: 60000 });
  if (roleReactions.length === 0) return;

  const roleReaction = roleReactions.find((role) => role.emoji === reaction.emoji.name);
  if (!roleReaction) return;

  const member = north.members.cache.get(user.id) as GuildMember;
  const role = north.roles.cache.get(roleReaction.roleID) as Role;

  await member.roles.remove(role);

  const responseMsg = await (north.channels.cache.get('683063308827361342') as TextChannel).send(
    `Removed '${role.name}' role from user <@${user.id}>!`,
  );

  setTimeout(() => {
    responseMsg.delete();
  }, 5000);
};

const messageReactionRemove: Event = {
  name: 'messageReactionRemove',
  handler,
};

export default messageReactionRemove;
