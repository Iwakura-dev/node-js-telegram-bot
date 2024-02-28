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
exports.Commands = void 0;
const Commands = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.api.setMyCommands([
        {
            command: 'help',
            description: 'Помощь с ботом',
        },
        {
            command: 'unsubscribe',
            description: 'Отписаться от направления',
        },
        {
            command: 'settings',
            description: 'Настройки профиля',
        },
    ]);
});
exports.Commands = Commands;