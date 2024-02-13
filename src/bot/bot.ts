import 'dotenv/config';
import { Bot, Context, GrammyError, HttpError } from 'grammy';
import {
  inlineKeyboardVacancy,
  inlineUnsubscribeKeyboard,
  rootKeyboard,
} from '../menu/menu';
import { author, greeting } from '../constants/text/text';
import { Commands } from '../menu/commands/commands';
import { sendHHVacancies } from '../utils/utils';
import { buyMeCoffee, token } from '../constants/constants';

const bot = new Bot<Context>(token);

let userSubscriptions: Record<number, string[]> = {};
let lastRequestTime: Record<string, number> = {};
let coolDown = 10 * 60 * 1000;
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
bot.command('help', async (ctx: Context) => {
  await ctx.reply(
    '<b>Если вам необходима помощь, обратитесь по данному адрессу: kozhemyakokirill@gmail.com</b>',
    {
      parse_mode: 'HTML',
    },
  );
});
bot.command('unsubscribe', async (ctx: Context) => {
  await ctx.reply('<b>Отписаться от какого-либо события:</b>', {
    parse_mode: 'HTML',
    reply_markup: inlineUnsubscribeKeyboard,
  });
});
bot.on(':text', async (ctx: Context) => {
  switch (ctx.msg?.text) {
    case 'Направление':
      await ctx.reply(
        'Выберите из списка направления в котором вы заинтересованы!',
        {
          reply_markup: inlineKeyboardVacancy,
        },
      );
      break;
    case 'Донат':
      await ctx.reply(
        `<b>Если ты хочешь поддержать автора данного проекта, автор будет рад угоститься кружечкой горячего кофе</b>\n\nBuy Me A Coffee - ${buyMeCoffee}`,
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

bot.callbackQuery(['subscribe_frontend', 'subscribe_backend'], async (ctx) => {
  const userId = ctx.from.id;

  if (!userSubscriptions[userId]) {
    userSubscriptions[userId] = [];
  }

  const direction =
    ctx.match === 'subscribe_frontend' ? 'Front-End' : 'Back-End';

  if (!userSubscriptions[userId].includes(direction)) {
    userSubscriptions[userId].push(direction);
    await ctx.answerCallbackQuery({
      text: `Вы подписались на вакансии по направлению "${direction}"`,
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
      text: 'Вы уже подписались на данное событие!',
    });
  }
});

bot.callbackQuery(
  ['unsubscribe_frontend', 'unsubscribe_backend'],
  async (ctx) => {
    if (ctx.chat?.id) {
      const userId = ctx.chat.id;
      if (
        (userSubscriptions[userId] &&
          userSubscriptions[userId]?.includes('Front-End')) ||
        userSubscriptions[userId]?.includes('Back-End')
      ) {
        const direction = userSubscriptions[userId].includes('Front-End')
          ? 'Front-End'
          : 'Back-End';
        const index = userSubscriptions[userId]?.indexOf(
          'Front-End' ? 'Front-End' : 'Back-End',
        );
        if (index >= -1) {
          userSubscriptions[userId].splice(index, 1);
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
