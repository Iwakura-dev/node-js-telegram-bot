import 'dotenv/config';
export const constants = {
    token: process.env.API_TOKEN_TELEGRAM_BOT ?? '',
    buyMeCoffe: process.env.URL_BY_ME_A_COFFEE ?? '',
    ko_fi: process.env.URL_KO_FI ?? '',
};
