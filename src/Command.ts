import { Message } from 'discord.js';

export type Executor = (message: Message, args: string[]) => Promise<void>;

export interface Command {
  name: string;
  description: string;
  execute: (message: Message, args: string[]) => Promise<void>;
}
