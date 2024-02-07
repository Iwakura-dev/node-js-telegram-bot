import 'dotenv/config';
import { Bot, Context, GrammyError, HttpError } from 'grammy';
import { inlineKeyboardVacancy, rootKeyboard } from '../menu/menu';
import { author, greeting } from '../constants/text/text';
import { Commands } from '../menu/commands/commands';
import { sendHHVacancies } from '../utils/utils';
// import { sendHHVacancies } from '../utils/utils';

const token = process.env.API_TOKEN_TELEGRAM_BOT ?? '';

const bot = new Bot<Context>(token);

let userSubscriptions: Record<number, string> = {};
let lastRequestTime: Record<string, number> = {};

bot.command('start', async (ctx: Context) => {
  await ctx.reply(greeting, {
    reply_markup: rootKeyboard,
    parse_mode: 'HTML',
  });
  Commands(ctx);
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
