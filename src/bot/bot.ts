import 'dotenv/config';
import {
  Bot,
  Context,
  GrammyError,
  HttpError,
  InlineKeyboard,
  Keyboard,
} from 'grammy';
import { rootKeyboard, vacancyKeyboard } from '../menu/menu';
// import { sendHHVacancies } from '../utils/utils';

const token = process.env.API_TOKEN_TELEGRAM_BOT ?? '';

const bot = new Bot(token);

let subscriptions: Record<string, string[]> = {};
let lastRequestTime: Record<string, number> = {};

bot.command('start', async (ctx: Context) => {
  await ctx.reply(
    '👋 Привет!\nТы все-таки решился автоматизировать свои потраченные часы?\nТогда скорее выбирай своё направление и следи за вакансиями с сайта <b>HeadHunter.ru</b>',
    {
      reply_markup: rootKeyboard,
      parse_mode: 'HTML',
    },
  );
});

bot.on(':text', async (ctx: Context) => {
  switch (ctx.msg?.text) {
    case 'Направление':
      await ctx.reply(
        'Выберите из списка направления в котором вы заинтересованы!',
        {
          reply_markup: vacancyKeyboard,
        },
      );
      break;
    case 'Назад':
      await ctx.reply('Выходим на главное меню', {
        reply_markup: rootKeyboard,
      });
      break;
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
