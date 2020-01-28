import bot from '../api/telegram-bot'

export default function seasonPassHandler(msg) {
  /* TODO: display trainings for 1 week ahead */
  return bot.sendMessage(msg.chat.id, 'Not supported yet')
}
