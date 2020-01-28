import bot from '../api/telegram-bot'

export default function notFoundHandler(msg) {
  /* TODO: develop logic to reserve training */
  return bot.sendMessage(msg.chat.id, 'Command not found')
}
