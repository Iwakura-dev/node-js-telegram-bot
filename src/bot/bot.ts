import 'dotenv/config';
import { Bot, Context, GrammyError, HttpError } from 'grammy';
import { constants } from '../constants/constants';
import { author, greeting, help } from '../constants/text/text';
import { Commands } from '../menu/commands/commands';
import {
  inlineKeyboardVacancy,
  inlineUnsubscribeKeyboard,
  rootKeyboard,
} from '../menu/menu';
import { sendHHVacancies } from '../utils/utils';

export const bot =
  new Bot<Context>(constants.token as string, {
    botInfo: {
      id: 6871508134,
      is_bot: true,
      first_name: 'Career Compass',
      username: 'work_seaarch_it_bot',
      can_join_groups: true,
      can_read_all_group_messages: false,
      supports_inline_queries: true,
    },
  }) ?? 'Error parse token!';

let userSubscriptions: Record<number, string[]> = {};
let lastRequestTime: Record<string, number> = {};
let coolDown = 10 * 60 * 1000;
let direction: any;

bot.command('start', async (ctx: Context) => {
  await ctx.reply(greeting, {
    reply_markup: rootKeyboard,
    parse_mode: 'HTML',
  });
  Commands(ctx);
});
bot.command('settings', async (ctx: Context) => {
  if (ctx.from?.id) {
    const userId = ctx.from?.id;
    if (userSubscriptions[userId] && userSubscriptions[userId].length > 0) {
      const userDirection = userSubscriptions[userId].join(', ');
      await ctx.reply(
        `Ваш профиль:\n\nВаше выбранное направление: <b>${userDirection}</b>`,
        {
          parse_mode: 'HTML',
        },
      );
    } else {
      await ctx.reply(
        '<b>Вы не можете просматривать свой профиль, выберите свое направление!</b>',
        {
          parse_mode: 'HTML',
        },
      );
    }
  }
});

bot.command('unsubscribe', async (ctx: Context) => {
  if (ctx.from?.id) {
    const userId = ctx.from?.id;
    if (!userSubscriptions[userId]) {
      await ctx.reply(
        '<b>Для начала подпишетесь на направление, чтобы в будущем отписаться от него!</b>',
        {
          parse_mode: 'HTML',
        },
      );
    } else {
      await ctx.reply('<b>Отписаться от какого-либо события:</b>', {
        parse_mode: 'HTML',
        reply_markup: inlineUnsubscribeKeyboard,
      });
    }
  }
});
bot.command('help', async (ctx: Context) => {
  await ctx.reply(help, {
    parse_mode: 'HTML',
  });
});
bot.on(':text', async (ctx: Context) => {
  switch (ctx.msg?.text) {
    case 'Направление':
      await ctx.reply(
        '<b>Выберите из списка направления в котором вы заинтересованы!</b>',
        {
          reply_markup: inlineKeyboardVacancy,
          parse_mode: 'HTML',
        },
      );
      break;
    case 'Донат':
      await ctx.reply(
        `<b>Если ты хочешь поддержать автора данного проекта, автор будет рад угоститься кружечкой горячего кофе</b>\n\nBuy Me A Coffee - ${constants.buyMeCoffe}\n\nKo-Fi - ${constants.ko_fi}`,
        {
          parse_mode: 'HTML',
        },
      );
      break;
    case 'Об авторе':
      await ctx.reply(author);
      break;
  }
});

bot.callbackQuery(
  ['subscribe_frontend', 'subscribe_backend', 'subscribe_fullstack'],
  async (ctx) => {
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
      await ctx.answerCallbackQuery({
        text: `Вы подписались на событие по направлению "${direction}"`,
      });
      await sendHHVacancies(ctx, direction, userSubscriptions);

      setInterval(async () => {
        if (Date.now() - (lastRequestTime[userId.toString()] ?? 0) > coolDown) {
          lastRequestTime[userId.toString()] = Date.now();
          await sendHHVacancies(ctx, direction, userSubscriptions);
        }
      }, coolDown);
    } else {
      await ctx.answerCallbackQuery({
        text: 'Вы уже подписаны на данное событие!',
      });
    }
  },
);

bot.callbackQuery(
  ['unsubscribe_frontend', 'unsubscribe_backend', 'unsubscribe_fullstack'],
  async (ctx) => {
    if (ctx.chat?.id) {
      const userId = ctx.chat.id;
      const userSubscription = userSubscriptions[userId];
      const directions = ['Front-End', 'Back-End', 'Full-Stack'];

      if (
        userSubscription &&
        directions.some((direction) => userSubscription.includes(direction))
      ) {
        const direction = directions.find((direction) =>
          userSubscription.includes(direction),
        );
        const index = userSubscription.indexOf(direction as string);

        if (index !== -1) {
          userSubscription.splice(index, 1);
          await ctx.answerCallbackQuery({
            text: `Вы отписались от вакансии с направлением: ${direction}`,
          });
        }
      } else {
        await ctx.answerCallbackQuery({
          text: 'Вы не подписаны на данное направление!',
        });
      }
    }
  },
);

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling input ${ctx.update.update_id}`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error('Error in request', e.description);
  } else if (e instanceof HttpError) {
    console.error('Could not contact Telegram', e);
  } else {
    console.error('Unknown error', e);
  }
});

bot.start();
