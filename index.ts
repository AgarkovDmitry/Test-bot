import bot from './src/api/telegram-bot'
import t from './src/locale'

import withUser from './src/utils/with-user'

import authHandler from './src/handlers/auth'
import bookingHandler from './src/handlers/booking'
import contactHandler from './src/handlers/contact'
import notFoundHandler from './src/handlers/not-found'
import scheduleHandler from './src/handlers/schedule'
import seasonPassHandler from './src/handlers/season-pass'

bot.onText(/^\/start/, authHandler)

const messageHandlers = {
  [t('menu.seasonPass')]: (msg: any) => withUser(msg, seasonPassHandler),
  [t('menu.schedule')]: scheduleHandler,
  [t('menu.booking')]: bookingHandler,
}

bot.once('contact', contactHandler)

bot.on('message', async msg => {
  if (!msg.text || msg.text[0] === '/') {
    return
  }

  const handler = messageHandlers[msg.text] || notFoundHandler

  handler(msg)
})