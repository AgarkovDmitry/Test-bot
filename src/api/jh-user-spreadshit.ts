import dotenv from 'dotenv'
import GoogleSpreadsheet from 'google-spreadsheet'

dotenv.config()
const doc = new GoogleSpreadsheet(process.env.GOOGLE_DRIVE_JH_USERS_SPREADSHEET)

const name = 'імя'
const surname = 'прізвище'
const phone = 'телефон'

const readUsersRows = () => new Promise(res => {
  doc.useServiceAccountAuth(JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS), () => {
    doc.getRows(1, (err, rows) => {
      const parsedRows = rows
        .filter(r => r[name] && r[surname] && r[phone])
        .map(r => ({
          name: r[name],
          surname: r[surname],
          phone: r[phone],
        }))

      res(parsedRows)
    })
  })
})

export const findUsersByScheduleName = async (names: string[]) => {
  const users: any = await readUsersRows()

  return names.map(name => {
    const u = users.find(u => name.includes(`${u.surname} ${u.name}`))

    return {
      ...u,
      searchedName: name,
    }
  })
}

export default readUsersRows