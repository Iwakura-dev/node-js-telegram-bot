"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inlineUnsubscribeKeyboard = exports.inlineKeyboardVacancy = exports.rootKeyboard = void 0;
const grammy_1 = require("grammy");
exports.rootKeyboard = new grammy_1.Keyboard()
    .text('Направление')
    .row()
    .text('Об авторе')
    .row()
    .text('Донат')
    .resized();
exports.inlineKeyboardVacancy = new grammy_1.InlineKeyboard()
    .text('Front-End разработка', 'subscribe_frontend')
    .row()
    .text('Back-End разработка', 'subscribe_backend');
exports.inlineUnsubscribeKeyboard = new grammy_1.InlineKeyboard()
    .text('Отписаться от Front-End', 'unsubscribe_frontend')
    .row()
    .text('Отписаться от Back-End', 'unsubscribe_backend');
