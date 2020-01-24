import IUser from '../interfaces/user'

const users: IUser[] = [
  {
    name: 'Dima Agarkov',
    phoneNumber: '+380502745793',
    seasonPass: {
      availableTill: '01.02.2020',
      amountOfTraining: 10,
    },
  },
]

export function getUserByPhoneNumber(phoneNumber: string) {
  return users.find(u => u.phoneNumber === phoneNumber)
}

export function getUserByTelegramId(telegramId: number) {
  return users.find(u => u.telegramId === telegramId)
}

export function attachTelegramIdToUser(phoneNumber: string, telegramId: number) {
  const index = users.findIndex(u => u.phoneNumber === phoneNumber)
  users[index].telegramId = telegramId
}