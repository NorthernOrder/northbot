import { MessageEmbed } from 'discord.js';

import { Executor, Command, Permission } from '../Command';

const coinflip = () => Math.random() >= 0.5;

const coinify = (heads: boolean) => (heads ? 'heads' : 'tails');

const executor: Executor = async (msg, args) => {
  const embed = new MessageEmbed({ title: 'Coin Flip' });

  if (args.length === 0) {
    if (Math.random() < 0.03) {
      embed.setDescription("It landed on it's side.");
    } else {
      embed.setDescription(`It landed on ${coinify(coinflip())}.`);
    }

    await msg.channel.send(embed);

    return;
  }

  if (args[0].length > 7) {
    embed.setDescription('WTF amount of coins are you trying to flip?');

    await msg.channel.send(embed);

    return;
  }

  const amount = parseInt(args[0]);

  if (amount < 2) {
    embed.setDescription('WTF amount of coins are you trying to flip?');

    await msg.channel.send(embed);

    return;
  }

  const flips: boolean[] = [];

  for (let i = 0; i < amount; i++) {
    flips.push(coinflip());
  }

  let heads = 0;
  let tails = 0;

  flips.forEach((f) => {
    f ? heads++ : tails++;
  });

  embed.addField('Heads:', heads);
  embed.addField('Tails:', tails);

  await msg.channel.send(embed);
};

const flip: Command = {
  name: 'flip',
  usage: 'flip [amount]',
  description: 'Flip coins',
  permission: Permission.Everyone,
  execute: executor,
};

export default flip;
