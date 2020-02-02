import schedule from 'node-schedule'
import _ from 'lodash'

import bot from '../api/telegram-bot'
import readScheduleRows from '../api/schedule-spreadshit'
import { findUsersByScheduleName } from '../api/jh-user-spreadshit'
import { readUsersByPhones } from '../api/user-spreadshit'
import t from '../locale'

const getTrainings = async (date?: string) => {
  const trainings = await readScheduleRows(date)
  const users = await findUsersByScheduleName(trainings.map(tr => tr.trainee))
  const telegrams = await readUsersByPhones(users.map(u => u.phone))

  return trainings.map(tr => {
    const u = users.find(u => u.searchedName === tr.trainee)
    const telegram = telegrams.find(ph => ph.phone === u.phone)

    return {
      telegramId: telegram.telegramId,
      name: u.name,
      surname: u.surname,
      fullName: `${u.surname} ${u.name}`,
      trainer: tr.trainer,
      startTime: tr.startTime,
    }
  }).filter(tr => tr.telegramId)
}

const mergeTrainings = (trainings: any[]) => {
  const uniqueTrainings = _.uniqWith(trainings,
    (a, b) => a.startTime === b.startTime && a.trainer === b.trainer
  )

  return uniqueTrainings.map(tr => {
    const trampolineCount = trainings.filter(t => t.startTime === tr.startTime && t.trainer === tr.trainer).length

    return {
      ...tr,
      trampolineCount,
    }
  })
}

export default async () => {
  const date = '31.01'

  schedule.scheduleJob('* 9 * * *', async () => {
    const trs = await getTrainings(date)

    const uniqueUsers = _.uniq(trs.map(tr => tr.fullName))

    Promise.all(
      uniqueUsers.map(async (u: string) => {
        const userTrainings = trs.filter(tr => tr.fullName === u)
        const uniqueTrainings = mergeTrainings(userTrainings)
        const id = uniqueTrainings[0].telegramId
        const name = uniqueTrainings[0].name

        await bot.sendMessage(id, t('reminder.greetings', { name, date }))
        uniqueTrainings.map(tr => bot.sendMessage(
          id,
          `${t('reminder.hours', { time: tr.startTime })}, ` +
          `${t(`reminder.trampolines.${tr.trampolineCount}`)}, ` +
          `${t(`reminder.gym`, { gym: 'Берестейськiй' })}.\n` +
          `${t(`reminder.trainer.${JSON.stringify(!!tr.trainer)}`, { trainer: tr.trainer })}\n` +
          `${t(`reminder.question`)}`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: t('menu.yes'), callback_data: JSON.stringify({ type: 'CONFIRM_BOOKING', time: tr.startTime, trainer: tr.trainee }) },
                  { text: t('menu.no'), callback_data: JSON.stringify({ type: 'CANCEL_BOOKING', time: tr.startTime, trainer: tr.trainee }) },
                ],
              ],
            },
          }
        ))
      })
    )
  })
}