import { Command, Executor, Permission } from '../Command';

const executor: Executor = async (msg, [amount]) => {
  await msg.channel.bulkDelete(parseInt(amount, 10) || 1);
};

const deleteCommand: Command = {
  name: 'delete',
  description: 'Delete messages',
  permission: Permission.Staff,
  execute: executor,
};

export default deleteCommand;
