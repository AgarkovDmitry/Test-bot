import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'

// import { getUserByPhoneNumber, getUserByTelegramId, attachTelegramIdToUser } from './data/users'
import t from './src/locale'

import { readUserByPhone, readUserByTelegramId, updateUserTelegramId } from './src/api/user-spreadshit'

dotenv.config()
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true})

const requestContact = (id: number, message: string) => new Promise(async res => {
  await bot.sendMessage(id, message, {
    reply_markup: {
      one_time_keyboard: true,
      resize_keyboard: true,
      keyboard: [
        [{
          text: t('sendContact'),
          request_contact: true,
        }],
      ],
    },
  })

  bot.once('contact', async (msg: any) => {
    if (msg.contact.user_id !== msg.chat.id) {
      res(null)
    }

    const u = await readUserByPhone(msg.contact.phone_number)
    if (!u) {
      /* handle case when user doesn't belong to system yet */
      bot.sendMessage(msg.contact.user_id, t('userNotFound'))
      res(null)
    } else {
      await updateUserTelegramId(msg.contact.phone_number, msg.contact.user_id)
      const user = await readUserByTelegramId(msg.contact.user_id)
      bot.sendMessage(
        msg.contact.user_id,
        t('authComplete', { name: user.name }),
        {
          reply_markup: {
            remove_keyboard: true,
          },
        }
      )

      res(user)
    }
  })
})

const sendSeasonPass = (user: any) => bot.sendMessage(
  user.telegramid,
  t('seasonPass', user)
)

bot.onText(/^\/start/, async (msg: any) => {
  const user: any = await requestContact(msg.chat.id, t('contantRequired'))
  if (user) {
    bot.sendMessage(msg.chat.id, t('authComplete', { name: user.name }))
  }
})


bot.onText(/^\/status/, async(msg: any) => {
  const user = await readUserByTelegramId(msg.chat.id)
  if (user) {
    sendSeasonPass(user)
  } else {
    const u: any = await requestContact(msg.chat.id, t('userNotAuthorized'))
    if (u) {
      sendSeasonPass(u)
    }
  }
})
