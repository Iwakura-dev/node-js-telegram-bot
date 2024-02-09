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
  .text('Back-End разработка', 'subscribe_backend');

export const inlineUnsubscribeKeyboard = new InlineKeyboard()
  .text('Отписаться от Front-End', 'unsubscribe_frontend')
  .row()
  .text('Отписаться от Back-End', 'unsubscribe_backend');
