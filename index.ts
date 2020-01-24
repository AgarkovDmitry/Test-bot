import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'

import IUser from './interfaces/user'
import { getUserByPhoneNumber, getUserByTelegramId, attachTelegramIdToUser } from './data/users'
import t from './locale'

import './src/api/user-spreadshit'

dotenv.config()
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true})

const requestContact = (id: number, message: string) => bot.sendMessage(id, message, {
  'parse_mode': 'Markdown',
  'reply_markup': {
    'one_time_keyboard': true,
    'resize_keyboard': true,
    'keyboard': [
      [{
        text: t('sendContact'),
        request_contact: true,
      }],
    ],
  },
}).then(() => new Promise(res => {
  bot.once('contact', msg => {
    const u = getUserByPhoneNumber(msg.contact.phone_number)
    if (!u) {
      /* handle case when user doesn't belong to system yet */
      bot.sendMessage(msg.contact.user_id, t('userNotFound'))
      res(null)
    }

    attachTelegramIdToUser(msg.contact.phone_number, msg.contact.user_id)
    res(getUserByTelegramId(msg.contact.user_id))
  })
}))

const sendSeasonPass = (user: IUser) => bot.sendMessage(
  user.telegramId,
  t('seasonPass', user.seasonPass)
)

bot.onText(/^\/start/, msg => {
  requestContact(msg.chat.id, t('contantRequired'))
  .then((user: IUser) => {
    bot.sendMessage(msg.chat.id, t('authComplete', { name: user.name }))
  })
})


bot.onText(/^\/status/, msg => {
  const user = getUserByTelegramId(msg.chat.id)
  if (user) {
    sendSeasonPass(user)
  } else {
    requestContact(msg.chat.id, t('userNotAuthorized'))
      .then((user: IUser) => {
        sendSeasonPass(user)
      })
  }
})
