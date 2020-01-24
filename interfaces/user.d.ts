export default interface IUser {
  name: string
  phoneNumber: string
  seasonPass: {
    availableTill: string,
    amountOfTraining: number
  }
  telegramId?: number
}
