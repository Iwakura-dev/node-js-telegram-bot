import { Context, HttpError } from 'grammy';
import { IVacanciesResponse } from '../types/types';

export async function sendHHVacancies(
  ctx: Context,
  direction: string,
  userSubscription: Record<number, string[]>,
) {
  if (ctx.from?.id) {
    const userId = ctx.from.id;
    if (
      userSubscription[userId] &&
      userSubscription[userId].includes(direction)
    ) {
      const randomPage = Math.floor(Math.random() * 20);
      const params = new URLSearchParams({
        text: direction,
        area: '1',
        per_page: '5',
        page: randomPage.toString(),
      });
      try {
        const response = await fetch(`https://api.hh.ru/vacancies?${params}`);
        const data: IVacanciesResponse = await response.json();
        let message = '';
        data.items.forEach((item, index) => {
          const salary = item.salary
            ? `${item.salary.from ? item.salary.from : ''} - ${item.salary.to ? item.salary.to : ''} ${item.salary.currency}`
            : 'Зарплата не указана';
          message += `${index + 1}. [${item.name}](${item.alternate_url}) (${item.employer.name})\nЗарплата: ${salary}\n\n`;
        });
        await ctx.reply(message, {
          parse_mode: 'Markdown',
        });
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error', error);
        }
      }
    } else {
      await ctx.reply('Error');
    }
  }
}
