import { MessageEmbed } from 'discord.js';

import { Executor, Command, Permission } from '../types/Command';

interface Roll {
  dice: string;
  results: string;
}

const diceStringRegex = /^(\d*)[dD](\d+)$/;

const rollADice = (size: number) => {
  return Math.floor(Math.random() * size) + 1;
};

const executor: Executor = async (msg, args) => {
  if (args.length < 1) {
    const reply = await msg.reply('You need to provide atlest one argument');
    setTimeout(() => {
      reply.delete();
    }, 2000);
    return;
  }

  if (!args.every((arg) => diceStringRegex.test(arg))) {
    const reply = await msg.reply('Some argument(s) are not dices');
    setTimeout(() => {
      reply.delete();
    }, 2000);
    return;
  }

  const rolls = args.map(
    (arg): Roll => {
      const result = diceStringRegex.exec(arg);
      if (!result)
        return {
          dice: arg,
          results: '0',
        };

      const amount = result[1] === '' ? 1 : parseInt(result[1]);
      const size = parseInt(result[2]);

      if (amount === 0 || size < 3 || (amount > 100 && size > 9) || size > 1000) {
        return {
          dice: 'None',
          results: 'None',
        };
      }
      const results: number[] = [];

      for (let i = 0; i < amount; i++) {
        results.push(rollADice(size));
      }

      return {
        dice: `${amount} x D${size}`,
        results: results.join(', '),
      };
    },
  );

  const embed = new MessageEmbed({ title: 'Roll Results:' });

  rolls.forEach((roll) => {
    embed.addField(roll.dice, roll.results);
  });

  await msg.channel.send(embed);
};

const roll: Command = {
  name: 'roll',
  usage: 'roll <dices>...',
  description:
    'Roll dices. \n\nExamples: \n4d20 - rolls 4 D20 dices \n3D6 d12 - rolls 3 D6 dices and 1 D12 dice',
  permission: Permission.Everyone,
  execute: executor,
};

export default roll;
