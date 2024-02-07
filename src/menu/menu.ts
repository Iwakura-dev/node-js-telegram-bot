import { Keyboard } from 'grammy';

export const rootKeyboard = new Keyboard()
  .text('Направление')
  .row()
  .text('Об авторе')
  .resized();

export const vacancyKeyboard = new Keyboard()
  .text('Front-End разработка')
  .row()
  .text('Back-End разработка')
  .row()
  .text('Назад')
  .resized();
