export interface IGym {
  id: string
  name: string
  shortName: string
  trampolines: ITrampoline[]
}

export interface ITrampoline {
  id: string
  name: string
  note: string
}

export interface ITrainer {
  id: string
  firstName: string
  lastName: string
  phone: string
  birthday: string
  featuares: string[]
  avatar?: string
  schudule: ITrainerScheduleRow[]
  telegramId: string
}

export interface ITrainerScheduleRow {
  gym: IGym
  date: string
  hours: string[]
}

export interface ITrainee {
  id: string
  firstName: string
  lastName: string
  phone: string
  birthday: string
  telegramId: string
  contactPhone: string
  contactFirstName: string
  contactLastName: string
  type: 'child' | 'private client'
  source: string // 'bodo' | 'internet | 'friends'
  queryNumber: string
  seasonPass: ISeasonPass
  addedAt: string
  debt: number
}

export interface ISeasonPass {
  id: string
  marks: number
  availableTill: string
}

export interface ITraining {
  gym: IGym
  date: string
  startTime: string
  endTime: string
  duration: string
  trainer: ITrainer
  trampolines: ITrampoline[]
  records: {
    trainee: ITrainee
    status: 'RESERVED' | 'CANCELED' | 'CONFIRMED'
    paymentMethod: 'SINGLE_PAYMENT' | 'SEASON_PASS' | 'DEBT'
    paid: boolean
  }[],
  type: 'GROUP' | 'EVENT' | 'RENT' | 'RENT_WITH_TRAINER | INDIVIDUAL_TRAINING'
  name: string /* ? */
  note: string
}