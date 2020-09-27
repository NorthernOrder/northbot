import { TextChannel } from 'discord.js';

import { getNorthernOrder } from '..';
import { channels, freeGameFilters } from '../config';
import { Event, MessageEventHandler } from '../types/Event';

const handler: MessageEventHandler = (msg) => {
  const north = getNorthernOrder();
  if (msg.channel.id !== channels.privateFreeGames) return;

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

const messageEvent: Event = {
  name: 'message',
  handler,
};

export default messageEvent;
