import { bot } from '..';
import { Event, MessageEventHandler } from '../types/Event';

const handler: MessageEventHandler = async (msg) => {
  // ignore messages sent by a bot
  if (msg.author.bot) return;

  // no DMs yet
  if (!msg.member || !msg.guild) return;

  if (msg.content.toLowerCase() === 'f') {
    const FEmoji = bot.emojis.cache.get('682623831726227542');
    if (!FEmoji) return;
    await msg.react(FEmoji);
    return;
  }
};

const messageEvent: Event = {
  name: 'message',
  handler,
};

export default messageEvent;
