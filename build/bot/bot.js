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
const constants_1 = require("../constants/constants");
const text_1 = require("../constants/text/text");
const commands_1 = require("../menu/commands/commands");
const menu_1 = require("../menu/menu");
const utils_1 = require("../utils/utils");
const bot = (_a = new grammy_1.Bot(constants_1.token)) !== null && _a !== void 0 ? _a : 'Error parse token!';
let userSubscriptions = {};
let lastRequestTime = {};
let coolDown = 10 * 60 * 1000;
let direction;
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
bot.command('unsubscribe', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    if ((_d = ctx.from) === null || _d === void 0 ? void 0 : _d.id) {
        const userId = (_e = ctx.from) === null || _e === void 0 ? void 0 : _e.id;
        if (!userSubscriptions[userId]) {
            yield ctx.reply('<b>Для начала подпишетесь на направление, чтобы в будущем отписаться от него!</b>', {
                parse_mode: 'HTML',
            });
        }
        else {
            yield ctx.reply('<b>Отписаться от какого-либо события:</b>', {
                parse_mode: 'HTML',
                reply_markup: menu_1.inlineUnsubscribeKeyboard,
            });
        }
    }
}));
bot.command('help', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply(text_1.help, {
        parse_mode: 'HTML',
    });
}));
bot.on(':text', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    switch ((_f = ctx.msg) === null || _f === void 0 ? void 0 : _f.text) {
        case 'Направление':
            yield ctx.reply('<b>Выберите из списка направления в котором вы заинтересованы!</b>', {
                reply_markup: menu_1.inlineKeyboardVacancy,
                parse_mode: 'HTML',
            });
            break;
        case 'Донат':
            yield ctx.reply(`<b>Если ты хочешь поддержать автора данного проекта, автор будет рад угоститься кружечкой горячего кофе</b>\n\nBuy Me A Coffee - ${constants_1.buyMeCoffee}\n\nKo-Fi - ${constants_1.ko_fi}`, {
                parse_mode: 'HTML',
            });
            break;
        case 'Об авторе':
            yield ctx.reply(text_1.author);
            break;
    }
}));
bot.callbackQuery(['subscribe_frontend', 'subscribe_backend', 'subscribe_fullstack'], (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = ctx.from.id;
    if (!userSubscriptions[userId]) {
        userSubscriptions[userId] = [];
    }
    switch (ctx.match) {
        case 'subscribe_frontend':
            direction = 'Front-End';
            break;
        case 'subscribe_backend':
            direction = 'Back-End';
            break;
        case 'subscribe_fullstack':
            direction = 'Full-Stack';
            break;
        default:
            direction = '';
    }
    if (!userSubscriptions[userId].includes(direction)) {
        userSubscriptions[userId].push(direction);
        yield ctx.answerCallbackQuery({
            text: `Вы подписались на событие по направлению "${direction}"`,
        });
        yield (0, utils_1.sendHHVacancies)(ctx, direction, userSubscriptions);
        setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            var _g;
            if (Date.now() - ((_g = lastRequestTime[userId.toString()]) !== null && _g !== void 0 ? _g : 0) > coolDown) {
                lastRequestTime[userId.toString()] = Date.now();
                yield (0, utils_1.sendHHVacancies)(ctx, direction, userSubscriptions);
            }
        }), coolDown);
    }
    else {
        yield ctx.answerCallbackQuery({
            text: 'Вы уже подписаны на данное событие!',
        });
    }
}));
bot.callbackQuery(['unsubscribe_frontend', 'unsubscribe_backend', 'unsubscribe_fullstack'], (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    if ((_h = ctx.chat) === null || _h === void 0 ? void 0 : _h.id) {
        const userId = ctx.chat.id;
        const userSubscription = userSubscriptions[userId];
        const directions = ['Front-End', 'Back-End', 'Full-Stack'];
        if (userSubscription &&
            directions.some((direction) => userSubscription.includes(direction))) {
            const direction = directions.find((direction) => userSubscription.includes(direction));
            const index = userSubscription.indexOf(direction);
            if (index !== -1) {
                userSubscription.splice(index, 1);
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
addEventListener('fetch', (0, grammy_1.webhookCallback)(bot, 'cloudflare'));
bot.start();
