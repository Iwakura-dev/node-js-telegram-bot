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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendHHVacancies = void 0;
function sendHHVacancies(ctx, direction, userSubscription) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if ((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id) {
            const userId = ctx.from.id;
            if (userSubscription[userId] &&
                userSubscription[userId].includes(direction)) {
                const randomPage = Math.floor(Math.random() * 20);
                const params = new URLSearchParams({
                    text: direction,
                    area: '1',
                    per_page: '5',
                    page: randomPage.toString(),
                });
                try {
                    const response = yield fetch(`https://api.hh.ru/vacancies?${params}`);
                    const data = yield response.json();
                    let message = '';
                    data.items.forEach((item, index) => {
                        const salary = item.salary
                            ? `${item.salary.from ? item.salary.from : ''} - ${item.salary.to ? item.salary.to : ''} ${item.salary.currency}`
                            : 'Зарплата не указана';
                        message += `${index + 1}. [${item.name}](${item.alternate_url}) (${item.employer.name})\nЗарплата: ${salary}\n\n`;
                    });
                    yield ctx.reply(message, {
                        parse_mode: 'Markdown',
                    });
                }
                catch (error) {
                    if (error instanceof Error) {
                        console.error('Error', error);
                    }
                }
            }
            else {
                yield ctx.reply('Error');
            }
        }
    });
}
exports.sendHHVacancies = sendHHVacancies;
