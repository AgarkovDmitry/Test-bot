import bot from '../api/telegram-bot'
import t from '../locale'

export default function (msg) {
  return bot.sendMessage(msg.chat.id, t('contactRequired'), {
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