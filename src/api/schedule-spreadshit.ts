import dotenv from 'dotenv'
import GoogleSpreadsheet from 'google-spreadsheet'
import _ from 'lodash'

dotenv.config()
const doc = new GoogleSpreadsheet(process.env.GOOGLE_DRIVE_USERS_SPREADSHEET)

const dateColumn = 2
const tranpolineColumnsCount = 13
const trampolineFirstColumn = 3
const trampolineTrainerColumn = 6
const trampolineTraineeColumn = 8


const readScheduleRows = () => new Promise(res => {
  doc.useServiceAccountAuth(JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS), () => {
    doc.getCells(4, {
      'min-row': 7,
      'min-col': 2,
    }, (err, cells) => {
      const maxColumn: number = _.max(cells.map(c => c.col))
      const tranpolinesCount = (maxColumn - trampolineFirstColumn + 1) % tranpolineColumnsCount + 1

      const rows = _.uniq(cells.map(c => c.row)).map((row: number) => ({
        row,
        cells: cells.filter(c => c.row === row),
      })).map(row => ({
        ...row,
        date: row.cells.find(c => c.col === dateColumn).value,
      })).map(row => {
        const trampolines = []

        for (let i = 0; i < (tranpolinesCount) % tranpolineColumnsCount; i++) {
          const minCol = trampolineFirstColumn + i * (tranpolineColumnsCount + 1)
          const maxCol = (trampolineFirstColumn + tranpolineColumnsCount) + i * (tranpolineColumnsCount + 1)
          const trainerColumn = trampolineTrainerColumn + i * (tranpolineColumnsCount + 1)
          const traineeColumn = trampolineTraineeColumn + i * (tranpolineColumnsCount + 1)

          const cells = row.cells.filter(c => c.col >= minCol && c.col < maxCol)

          trampolines.push({
            trainer: cells.find(c => c.col === trainerColumn)?.value,
            trainee: cells.find(c => c.col === traineeColumn)?.value,
            startTime: cells.find(c => c.col === minCol)?.value,
            trampolineId: i,
          })
        }

        return {
          row: row.row,
          date: row.date,
          trampolines,
        }
      })

      res(rows)
    })
  })
})

const readdScheduleByDate = async(date = '31.01') => {
  const rows: any = await readScheduleRows()

  const filteredRows = rows
    .filter(r => r.date === date)
    .map(r => {
      const trampolines = r.trampolines.filter((tr, i) => {

        return !!tr.trainee
      })

      return {
        ...r,
        trampolines,
      }
    }).filter(r => r.trampolines.length > 0)

  const trampolines = filteredRows.map(fr => fr.trampolines)

  trampolines.forEach((tramp, index) => {
    const startTime = tramp[0].startTime

    if (!startTime && index > 0) {
      const prevStartTime = trampolines[index - 1][0].startTime

      tramp.forEach(t => t.startTime = prevStartTime)
    }
  })

  const trainings = _.uniqWith(_.flatten(trampolines),
    (a: any, b: any) => a.trampolineId === b.trampolineId && a.startTime === b.startTime && a.trainee === b.trainee
  )

  return trainings
}

export default readdScheduleByDate