import { readUserByPhone, readUserByTelegramId, updateUserTelegramId } from '../api/user-spreadshit'
import bot from '../api/telegram-bot'
import t from '../locale'

export default async function contactHandler(msg: any) {
  if (msg.contact.user_id !== msg.chat.id) {
    /* handle case when user sent different contact */
    bot.sendMessage(msg.contact.user_id, 'invalid contact')
    return null
  }

  const u = await readUserByPhone(msg.contact.phone_number)
  if (!u) {
    /* handle case when user doesn't belong to system yet */
    bot.sendMessage(msg.contact.user_id, t('userNotFound'))
    return null
  }

  await updateUserTelegramId(msg.contact.phone_number, msg.contact.user_id)

  const user = await readUserByTelegramId(msg.contact.user_id)

  bot.sendMessage(
    msg.contact.user_id,
    t('authComplete', user),
    {
      reply_markup: {
        keyboard: [
          [{ text: t('menu.seasonPass') }],
          [{ text: t('menu.schedule') }],
          [{ text: t('menu.booking') }],
        ],
      },
    }
  )
}
