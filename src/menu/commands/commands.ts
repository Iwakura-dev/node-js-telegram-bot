import { Context } from 'grammy';

export const Commands = async (ctx: Context) => {
  ctx.api.setMyCommands([
    {
      command: 'help',
      description: 'Помощь с ботом',
    },
    {
      command: 'settings',
      description: 'Настройки профиля',
    },
    {
      command: 'unsubscribe',
      description: 'Отписаться от направления',
    },
  ]);
};
