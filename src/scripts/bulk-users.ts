import dotenv from 'dotenv'
import GoogleSpreadsheet from 'google-spreadsheet'
import { MongoClient } from 'mongodb'
import _ from 'lodash'

dotenv.config()
const doc = new GoogleSpreadsheet(process.env.GOOGLE_DRIVE_JH_USERS_SPREADSHEET)

const name = 'імя'
const surname = 'прізвище'
const childName = 'імядитининік'
const phone = 'телефон'
const altPhone = 'альтернативнийтелефон'
const source = 'звідкидізнавсяпронас'
const birthday = 'датанародження'
const type = 'типклієнта'
const questionaryNumber = 'номеранкети'
const fullName = 'прізвищеімяімядитининікномеранкети'

interface IJHUser {
  name: string
  surname: string
  childName: string
  phone: string
  altPhone: string
  source: string
  birthday: string
  type: string
  questionaryNumber: string
  fullName: string
  note: string
  errors?: any
}

const capitalize = (s: string) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

const readUsersRows = () => new Promise(res => {
  doc.useServiceAccountAuth(JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS), () => {
    doc.getRows(1, (err, rows) => {
      const parsedRows = rows
        .map(r => ({
          name: r[name],
          surname: r[surname],
          childName: r[childName],
          phone: r[phone],
          altPhone: r[altPhone],
          source: r[source],
          birthday: r[birthday],
          type: r[type],
          questionaryNumber: r[questionaryNumber],
          fullName: r[fullName],
        }))

      res(parsedRows)
    })
  })
})

const validatePhones = (rows: IJHUser[]) => {
  const invalidPhones = [
    'отказ', 'хз', 'отказался категорически', '?', 'нету', 'нет данных', 'немає', 'нет укр номер', '0',
  ]

  const mappedRows = rows.map(r => {
    if (invalidPhones.includes(r.phone)) {
      return {
        ...r,
        phone: '',
        errors: {
          phone: r.phone,
        },
      }
    }

    let phone = r.phone.replace(/[\-()_ ]/gi, '')

    if (phone[0] !== '0' && phone.length === 9) {
      phone = `0${phone}`
    }

    if (phone[0] === '0' && phone.length === 10) {
      phone = `+38${phone}`
    }

    if (phone[0] !== '+' && phone !== '') {
      return {
        ...r,
        phone: '',
        errors: {
          phone: r.phone,
        },
      }
    }

    return {
      ...r,
      phone,
    }
  })

  return mappedRows
}

const validateAltPhones = (rows: IJHUser[]) => {
  const invalidPhones = [
    'отказ', 'хз', 'отказался категорически', '?', 'нету', 'нет данных', 'немає', 'нет укр номер', '0',
  ]

  const mappedRows = rows.map(r => {
    if (invalidPhones.includes(r.altPhone)) {
      return {
        ...r,
        altPhone: '',
        errors: {
          altPhone: r.altPhone,
        },
      }
    }

    let phone = r.altPhone.replace(/[\-()_ ]/gi, '')

    if (phone[0] !== '0' && phone.length === 9) {
      phone = `0${phone}`
    }

    if (phone[0] === '0' && phone.length === 10) {
      phone = `+38${phone}`
    }

    if (phone[0] !== '+' && phone !== '') {
      return {
        ...r,
        altPhone: '',
        errors: {
          altPhone: r.altPhone,
        },
      }
    }

    return {
      ...r,
      altPhone: phone,
    }
  })

  return mappedRows
}

const validateDates = (rows: IJHUser[]) => {
  return rows.map(r => {
    let birthday = r.birthday

    birthday = birthday.replace('..', '.')

    if (birthday === '-') {
      return {
        ...r,
        birthday: '',
      }
    }

    if (birthday.length !== 10) {
      return {
        ...r,
        birthday: '',
        errors: {
          birthday,
        },
      }
    }

    return {
      ...r, birthday,
    }
  })
}

const parseRows = (rows: IJHUser[]) => {
  let validatedRows = validatePhones(rows)
  validatedRows = validateAltPhones(validatedRows)
  validatedRows = validatedRows.map(r => ({
    ...r,
    type: capitalize(r.type),
  }))
  validatedRows = validateDates(validatedRows)
  validatedRows = validatedRows.map(r => ({
    ...r,
    note: JSON.stringify(r.errors),
    errors: null,
  }))

  validatedRows.forEach(r => {
    r.note = JSON.stringify(r.errors)
    delete r.errors
  })

  return validatedRows
}

readUsersRows().then((rows: IJHUser[]) => {
  const parsedRows = parseRows(rows)
  const dbName = process.env.MONGO_DB_NAME
  const url = process.env.MONGO_DB_URL
  MongoClient.connect(url, (err, client) => {
    if (err) {
      console.log(err)
      return
    }

    const db = client.db(dbName)
    const collection = db.collection('users')
    collection.drop(() => {
      collection.insertMany(parsedRows, (err: any) => {
        if (err) {
          console.log(err)
          return
        }
      })
    })
  })
})