import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'

dotenv.config()
export default new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true})
