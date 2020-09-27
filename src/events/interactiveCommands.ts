import { Message } from 'discord.js';

import { Event, MessageEventHandler } from '../types/Event';

export type InteractiveCallback = (
  message: Message,
  command: InteractiveCommand,
) => Promise<void> | void;
export interface InteractiveCommand {
  channel: string;
  callback: InteractiveCallback;
  message: string;
  state: Record<string, any>;
}

export const interactiveUsers = new Map<string, InteractiveCommand>();

const handler: MessageEventHandler = async (msg) => {
  // ignore messages sent by a bot
  if (msg.author.bot) return;

  // no DMs yet
  if (!msg.member || !msg.guild) return;

  const interactive = interactiveUsers.get(msg.author.id);
  if (!interactive || msg.channel.id !== interactive.channel) return;

  interactive.callback(msg, interactive);
};

const messageEvent: Event = {
  name: 'message',
  handler,
};

export default messageEvent;
