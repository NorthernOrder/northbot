import { Message } from 'discord.js';

export type EventHandler = (...args: any[]) => Promise<void> | void;
export type MessageEventHandler = (message: Message) => Promise<void> | void;

export interface Event {
  name: string;
  handler: EventHandler;
}
