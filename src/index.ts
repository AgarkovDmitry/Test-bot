import bot from './api/telegram-bot'
import t from './locale'

import withUser from './utils/with-user'

import authHandler from './handlers/auth'
import bookingHandler from './handlers/booking'
import contactHandler from './handlers/contact'
import notFoundHandler from './handlers/not-found'
import scheduleHandler from './handlers/schedule'
import seasonPassHandler from './handlers/season-pass'

import reminderScheduler from './schedule/reminder'

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

reminderScheduler()