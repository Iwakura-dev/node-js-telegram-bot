import { InlineKeyboard, Keyboard } from 'grammy';

export const rootKeyboard = new Keyboard()
  .text('Направление')
  .row()
  .text('Об авторе')
  .row()
  .text('Донат')
  .resized();

export const inlineKeyboardVacancy = new InlineKeyboard()
  .text('Front-End разработка', 'subscribe_frontend')
  .row()
  .text('Back-End разработка', 'subscribe_frontend');
