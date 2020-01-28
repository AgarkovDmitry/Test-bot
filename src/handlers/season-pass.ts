import bot from '../api/telegram-bot'
import t from '../locale'

export default function seasonPassHandler(msg, user?) {
  return bot.sendMessage(msg.chat.id, t('seasonPass', user))
}
