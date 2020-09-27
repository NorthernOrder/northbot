import { Message } from 'discord.js';

export const bold = (str: string) => `**${str}**`;
export const italic = (str: string) => `_${str}_`;
export const underline = (str: string) => `__${str}__`;
export const strikethrough = (str: string) => `~~${str}~~`;
export const quote = (str: string) => `> ${str}`;
export const spoiler = (str: string) => `||${str}||`;

export const errorMsg = async (msgObj: Message, msgStr: string) => {
  const msg = await msgObj.channel.send(msgStr);
  setTimeout(() => {
    msg.delete();
  }, 2000);
};
