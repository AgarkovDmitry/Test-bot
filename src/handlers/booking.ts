import bot from '../api/telegram-bot'

export default function seasonPassHandler(msg) {
  /* TODO: develop logic to reserve training */
  return bot.sendMessage(msg.chat.id, 'Not supported yet')
}
