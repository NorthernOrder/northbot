import 'reflect-metadata';
import 'dotenv/config';

import fs from 'fs';
import path from 'path';

import { Client, Guild } from 'discord.js';
import { createConnection } from 'typeorm';

import { Event } from './types/Event';
import RoleReaction from './entities/RoleReaction';

const isDev = process.env.NODE_ENV !== 'production';

export const P = process.env.PREFIX;

export const bot = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

export const getNorthernOrder = (): Guild => bot.guilds.cache.get('175474010409271297') as Guild;

bot.on('ready', () => {
  console.log('Ready!');
  bot.user?.setActivity('Northern Order', { type: 'WATCHING' });
});

bot.on('warn', console.warn);
bot.on('error', console.error);

// bootstrap function to start the bot
const bootstrap = async () => {
  // connect to the database
  await createConnection({
    type: 'postgres',
    url: process.env.DB_URL,
    logging: true,
    synchronize: isDev,
    entities: [RoleReaction],
  });
  console.log('DB Connected');

  // get list of files that implement bot events
  const eventFiles = fs.readdirSync(path.join(__dirname, 'events'));

  // load all events to bot
  eventFiles.forEach(async (file) => {
    const eventImport = await import(path.join(__dirname, 'events', file));
    const event = eventImport.default as Event;
    bot.on(event.name as any, event.handler);
  });

  // login the bot
  await bot.login(process.env.BOT_TOKEN);
  console.log('Logged In');
};

bootstrap();
