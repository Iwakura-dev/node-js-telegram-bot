import 'dotenv/config';
import { Bot, Context, GrammyError, HttpError } from 'grammy';
import { inlineKeyboardVacancy, rootKeyboard } from '../menu/menu';
import { author, greeting } from '../constants/text/text';
import { Commands } from '../menu/commands/commands';
import { sendHHVacancies } from '../utils/utils';

const token = process.env.API_TOKEN_TELEGRAM_BOT ?? '';

const bot = new Bot<Context>(token);

let userSubscriptions: Record<number, string[]> = {};
let lastRequestTime: Record<string, number> = {};

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
    case 'Об авторе':
      await ctx.reply(author);
      break;
    case 'Назад':
      await ctx.reply('Выходим на главное меню', {
        reply_markup: rootKeyboard,
      });
      break;
  }
});
bot.callbackQuery('subscribe_frontend', async (ctx) => {
  const userId = ctx.from.id;
  if (!userSubscriptions[userId]) {
    userSubscriptions[userId] = [];
  }
  if (!userSubscriptions[userId].includes('Front-End')) {
    userSubscriptions[userId].push('Front-End');
    await ctx.answerCallbackQuery({
      text: 'Вы подписались на вакансии по направлению "Front-end',
    });
    await sendHHVacancies(ctx, 'Front-End');
    setInterval(async () => {
      if (
        Date.now() - (lastRequestTime[userId.toString()] ?? 0) >
        10 * 60 * 1000
      ) {
        lastRequestTime[userId.toString()] = Date.now();
        await sendHHVacancies(ctx, 'Front-End');
      }
    }, 600000); // 10 minutes
  } else {
    await ctx.answerCallbackQuery({
      text: 'Вы уже подписались на данное событие!',
    });
  }
});
bot.callbackQuery('subscribe_backend', async (ctx) => {
  if (ctx.chat?.id) {
    const userId = ctx.chat.id;
    if (!userSubscriptions[userId]) {
      userSubscriptions[userId] = [];
    }
    if (!userSubscriptions[userId].includes('Back-End')) {
      userSubscriptions[userId].push('Back-End');
      await ctx.answerCallbackQuery({
        text: 'Вы подписались на вакансии по направлению "Back-end',
      });
      await sendHHVacancies(ctx, 'Back-End');
      setInterval(async () => {
        if (
          Date.now() - (lastRequestTime[userId.toString()] ?? 0) >
          10 * 60 * 1000
        ) {
          lastRequestTime[userId.toString()] = Date.now();
          await sendHHVacancies(ctx, 'Back-End');
        }
      }, 600000); // 10 minutes
    } else {
      await ctx.answerCallbackQuery({
        text: 'Вы уже подписались на данное событие!',
      });
    }
  }
});
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
