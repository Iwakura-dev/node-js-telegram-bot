# Career Compass

This project was writting in the next technology:

- [TypeScript](https://www.typescriptlang.org/)
- [Grammy.js](https://grammy.dev/)

## What's does this bot doing

This bot has functionality that sends job vacancies from the 'hh.ru' website to customers.
And it also sends 5 vacancies every 10 minutes depending on the user's subscription.
The user subscribes himself, the user chooses for himself the direction for tracking vacancies from the site.
It is also possible to unsubscribe from the current direction of the user, thus the bot stops sending jobs to the unsubscribed user.
Also there is no limitation in the number of subscriptions, the user can subscribe to all directions, but in the future it is necessary to limit this functionality so that the servers 'hh.ru' not overloaded from the influx of requests from the user to the bot and from the bot to the server 'hh.ru'.

## Roadmap folders

<pre>
├── build  
├── node_modules  
├── src  
 ├── bot
├── constants
  ├── text
├── menu
  ├── commands
├── types
└── utils
</pre>

## Structured project

- build (which don't pushing in guthub)
  In this folder build safe the all files from the ts and converted to js
- node_modules (which don't pushing in github)
  In this folder modules save the all items from the dependepcies or packages
- src
  In this folders saves the all other folders for the works with bots
- bot
  In this folders saves the all functionallity with bots (commands, functions, keyboard and etc...)
- constants
  In this folders saves the all constants for the working bots (text, env)
- menu
  In this folders saves the all keyboard for the working bots (inline, default <-- keyboard)
- types
  In this folders saves the all types for the typescript which working bots
- utils
  In this folders saves the primary functionallity for the working with API from the 'hh.ru'
