import { Context } from 'grammy';

export const Commands = async (ctx: Context) => {
  ctx.api.setMyCommands([
    {
      command: 'help',
      description: 'Помощь с ботом',
    },
    {
      command: 'donate',
      description: 'Поддержать автора проекта',
    },
    {
      command: 'unsubscribe',
      description: 'Отписаться от направления',
    },
    {
      command: 'settings',
      description: 'Настройки профиля',
    },
  ]);
};
