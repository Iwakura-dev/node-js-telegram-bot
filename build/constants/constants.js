"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ko_fi = exports.buyMeCoffee = exports.token = void 0;
require("dotenv/config");
exports.token = (_a = process.env.API_TOKEN_TELEGRAM_BOT) !== null && _a !== void 0 ? _a : '';
exports.buyMeCoffee = (_b = process.env.URL_BY_ME_A_COFFEE) !== null && _b !== void 0 ? _b : '';
exports.ko_fi = (_c = process.env.URL_KO_FI) !== null && _c !== void 0 ? _c : '';
