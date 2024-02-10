"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const grammy_1 = require("grammy");
const menu_1 = require("../menu/menu");
const text_1 = require("../constants/text/text");
const commands_1 = require("../menu/commands/commands");
const utils_1 = require("../utils/utils");
const token = (_a = process.env.API_TOKEN_TELEGRAM_BOT) !== null && _a !== void 0 ? _a : '';
const bot = new grammy_1.Bot(token);
let userSubscriptions = {};
let lastRequestTime = {};
let coolDown = 10 * 60 * 1000;
bot.command('start', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply(text_1.greeting, {
        reply_markup: menu_1.rootKeyboard,
        parse_mode: 'HTML',
    });
    (0, commands_1.Commands)(ctx);
}));
bot.command('settings', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    if ((_b = ctx.from) === null || _b === void 0 ? void 0 : _b.id) {
        const userId = (_c = ctx.from) === null || _c === void 0 ? void 0 : _c.id;
        if (userSubscriptions[userId] && userSubscriptions[userId].length > 0) {
            const userDirection = userSubscriptions[userId].join(', ');
            yield ctx.reply(`Ваш профиль:\n\nВаше выбранное направление: <b>${userDirection}</b>`, {
                parse_mode: 'HTML',
            });
        }
        else {
            yield ctx.reply('<b>Вы не можете просматривать свой профиль, выберите свое направление!</b>', {
                parse_mode: 'HTML',
            });
        }
    }
}));
bot.command('help', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply('<b>Если вам необходима помощь, обратитесь по данному адрессу: kozhemyakokirill@gmail.com</b>', {
        parse_mode: 'HTML',
    });
}));
bot.command('unsubscribe', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply('<b>Отписаться от какого-либо события:</b>', {
        parse_mode: 'HTML',
        reply_markup: menu_1.inlineUnsubscribeKeyboard,
    });
}));
bot.on(':text', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    switch ((_d = ctx.msg) === null || _d === void 0 ? void 0 : _d.text) {
        case 'Направление':
            yield ctx.reply('Выберите из списка направления в котором вы заинтересованы!', {
                reply_markup: menu_1.inlineKeyboardVacancy,
            });
            break;
        case 'Об авторе':
            yield ctx.reply(text_1.author);
            break;
        case 'Назад':
            yield ctx.reply('Выходим на главное меню', {
                reply_markup: menu_1.rootKeyboard,
            });
            break;
    }
}));
bot.callbackQuery('subscribe_frontend', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = ctx.from.id;
    if (!userSubscriptions[userId]) {
        userSubscriptions[userId] = [];
    }
    if (!userSubscriptions[userId].includes('Front-End')) {
        userSubscriptions[userId].push('Front-End');
        yield ctx.answerCallbackQuery({
            text: 'Вы подписались на вакансии по направлению "Front-end"',
        });
        yield (0, utils_1.sendHHVacancies)(ctx, 'Front-End', userSubscriptions);
        setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            var _e;
            if (Date.now() - ((_e = lastRequestTime[userId.toString()]) !== null && _e !== void 0 ? _e : 0) > coolDown) {
                lastRequestTime[userId.toString()] = Date.now();
                yield (0, utils_1.sendHHVacancies)(ctx, 'Front-End', userSubscriptions);
            }
        }), coolDown); // 10 minutes cooldown
    }
    else {
        yield ctx.answerCallbackQuery({
            text: 'Вы уже подписались на данное событие!',
        });
    }
}));
bot.callbackQuery('subscribe_backend', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    if ((_f = ctx.chat) === null || _f === void 0 ? void 0 : _f.id) {
        const userId = ctx.chat.id;
        if (!userSubscriptions[userId]) {
            userSubscriptions[userId] = [];
        }
        if (!userSubscriptions[userId].includes('Back-End')) {
            userSubscriptions[userId].push('Back-End');
            yield ctx.answerCallbackQuery({
                text: 'Вы подписались на вакансии по направлению "Back-end"',
            });
            yield (0, utils_1.sendHHVacancies)(ctx, 'Back-End', userSubscriptions);
            setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
                var _g;
                if (Date.now() - ((_g = lastRequestTime[userId.toString()]) !== null && _g !== void 0 ? _g : 0) > coolDown) {
                    lastRequestTime[userId.toString()] = Date.now();
                    yield (0, utils_1.sendHHVacancies)(ctx, 'Back-End', userSubscriptions);
                }
            }), coolDown); // 10 minutes cooldown
        }
        else {
            yield ctx.answerCallbackQuery({
                text: 'Вы уже подписались на данное событие!',
            });
        }
    }
}));
bot.callbackQuery(['unsubscribe_frontend', 'unsubscribe_backend'], (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j, _k, _l;
    if ((_h = ctx.chat) === null || _h === void 0 ? void 0 : _h.id) {
        const userId = ctx.chat.id;
        if ((userSubscriptions[userId] &&
            ((_j = userSubscriptions[userId]) === null || _j === void 0 ? void 0 : _j.includes('Front-End'))) ||
            ((_k = userSubscriptions[userId]) === null || _k === void 0 ? void 0 : _k.includes('Back-End'))) {
            const direction = userSubscriptions[userId].includes('Front-End')
                ? 'Front-End'
                : 'Back-End';
            const index = (_l = userSubscriptions[userId]) === null || _l === void 0 ? void 0 : _l.indexOf('Front-End' ? 'Front-End' : 'Back-End');
            if (index >= -1) {
                userSubscriptions[userId].splice(index, 1);
                yield ctx.answerCallbackQuery({
                    text: `Вы отписались от вакансии с направлением: ${direction}`,
                });
            }
        }
        else {
            yield ctx.answerCallbackQuery({
                text: 'Вы не подписаны на данное направление!',
            });
        }
    }
}));
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling input ${ctx.update.update_id}`);
    const e = err.error;
    if (e instanceof grammy_1.GrammyError) {
        console.error('Error in request', e.description);
    }
    else if (e instanceof grammy_1.HttpError) {
        console.error('Could not contact Telegram', e);
    }
    else {
        console.error('Unknown error', e);
    }
});
bot.start();
