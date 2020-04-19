import { Message } from 'discord.js';

export type Executor = (message: Message, args: string[]) => Promise<void>;

export enum Permission {
  Everyone = 'Everyone',
  Staff = 'Staff',
  Admin = 'Admin',
  Owner = 'Owner',
}

export interface Command {
  name: string;
  description: string;
  permission: Permission;
  execute: (message: Message, args: string[]) => Promise<void>;
}
