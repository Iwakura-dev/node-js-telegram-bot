import { Context } from 'grammy';
import { IVacanciesResponse } from '../types/types';

export async function sendHHVacancies(ctx: Context, subscriptions: string) {
  const url = 'https://api.hh.ru/vacancies';

  const params = new URLSearchParams({
    text: subscriptions,
    area: '1',
    per_page: '5',
    page: '0',
  });

  try {
    const response = await fetch(`${url}?${params}`);
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
      console.error(`Ошибка: ${error.message}`);
    }
  }
}
