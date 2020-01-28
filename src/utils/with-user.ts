import { readUserByTelegramId } from '../api/user-spreadshit'
import t from '../locale'
import bot from '../api/telegram-bot'

export default async function withUser(msg, cb) {
  const user = await readUserByTelegramId(msg.chat.id)

  if (!user) {
    return bot.sendMessage(msg.chat.id, t('userNotAuthorized'), {
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
  }

  return cb(msg, user)
}
