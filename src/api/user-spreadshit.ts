import dotenv from 'dotenv'
const GoogleSpreadsheet = require('google-spreadsheet')

dotenv.config()
const doc = new GoogleSpreadsheet(process.env.GOOGLE_DRIVE_USERS_SPREADSHEET)

const readInfo = () => {
  doc.useServiceAccountAuth(JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS), () => {
    doc.getRows(1, (err, rows) => {
      console.log(rows)
    })
  })
}

readInfo()

export default readInfo