import schedule from 'node-schedule'

import bot from '../api/telegram-bot'
import readScheduleRows from '../api/schedule-spreadshit'
import t from '../locale'

export default async() => {
  schedule.scheduleJob('* 9 * * *', async () => {
    const trainings = await readScheduleRows()

    trainings.forEach(tr => {
      bot.sendMessage(
        '599097843',
        JSON.stringify(tr),
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: t('menu.yes'), callback_data: JSON.stringify({ type: 'CONFIRM_BOOKING', payload: '599097843'}) },
                { text: t('menu.no'), callback_data: JSON.stringify({ type: 'CANCEL_BOOKING', payload: '599097843'}) },
              ],
            ],
          },
        }
      )
    })
  })
}