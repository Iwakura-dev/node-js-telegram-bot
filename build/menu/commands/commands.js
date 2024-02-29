export const Commands = async (ctx) => {
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
};
