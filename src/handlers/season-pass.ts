import bot from '../api/telegram-bot'

export default function seasonPassHandler(msg) {
  return bot.sendMessage(msg.chat.id, 'Not supported yet')
}
