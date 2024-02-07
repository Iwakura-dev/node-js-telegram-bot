import 'dotenv/config';
import { Bot, Context, GrammyError, HttpError, InlineKeyboard } from 'grammy';
import { sendVacancies } from '../utils/utils';

const token = process.env.API_TOKEN_TELEGRAM_BOT ?? '';

const bot = new Bot(token);
let subscriptions: Record<string, string[]> = {};
let lastRequestTime: Record<string, number> = {};

bot.command('start', async (ctx: Context) => {
  const inlineKeyboard = new InlineKeyboard()
    .text('Направление Front-End', 'subscribe_frontend')
    .text('Направление Back-End', 'subscribe_backend');
  await ctx.reply(
    'Привет ✋!\nСпасибо что воспользовался данным телеграмм ботом для поиска своей заветной вакансии!\nДанный бот был сделан с иницитивой помощи юным разработчиком, которые горят желанием найти свое первое рабочее место\nЕсли вас интересует автор данного бота, то пропишите на своей клавиатуре команду <b>/author</b>\nПеред началом работы, пожалуйста подпишись на направление которое тебя интересует 👇!',
    {
      reply_markup: inlineKeyboard,
      parse_mode: 'HTML',
    },
  );
});

bot.command('settings', async (ctx: Context) => {
  const inlineKeyboard = new InlineKeyboard()
    .text('Отписаться от Front-End', 'unsubscribe_frontend')
    .text('Отписаться от Back-End', 'unsubscribe_backend');
  await ctx.reply(
    'Данная секция предназначена для отписки от какого либо события!',
    {
      reply_markup: inlineKeyboard,
    },
  );
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
