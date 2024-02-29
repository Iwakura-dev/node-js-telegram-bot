import 'dotenv/config';
import express from 'express';
import { webhookCallback } from 'grammy';
import { bot } from './bot/bot';

const domain = String(process.env.DOMAIN);
const secretPath = String(process.env.API_TOKEN_TELEGRAM_BOT);
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(`/${secretPath}`, webhookCallback(bot, 'express'));

app.listen(PORT, async () => {
  await bot.api.setWebhook(`https://${domain}/${secretPath}`);
});
