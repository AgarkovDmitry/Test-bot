const translations = {
  contactRequired: 'Для авторизацii у системi, нам потрiбнi вашi контактнi данi',
  userNotFound: 'Користувача з вашим номером телефона не було знайдено',
  userNotAuthorized: 'Ви не авторизованi',
  sendContact: 'Вiдправити контактнi данi',
  seasonPass: 'У вас залишилось {{amountoftraining}} тренуваннь, срок дii до {{availabletill}}',
  authComplete: 'Дякую {{name}} {{surname}}, тепер ви можете переглянути статус вашого абонементу та записуватись на тренування',
  'menu.seasonPass': 'Мой абонимент',
  'menu.schedule': 'Мои тренировки',
  'menu.booking': 'Записаться на тренировку',
  'menu.yes': 'Так',
  'menu.no': 'Нi',

  'reminder.greetings': 'Добрий день, {{name}}! Нагадуэмо, у вас заняття завтра({{date}}):',
  'reminder.question': 'Все вiрно?',
  'reminder.hours': 'В {{time}}',
  'reminder.gym': 'на {{gym}}',
  'reminder.trampolines.1': '1 батут',
  'reminder.trampolines.2': '2 батути',
  'reminder.trampolines.3': '3 батути',
  'reminder.trampolines.4': '4 батути',
  'reminder.trampolines.5': '5 батутiв',
  'reminder.trampolines.6': '6 батутiв',
  'reminder.trampolines.7': '7 батутiв',
  'reminder.trainer.true': 'Ваш тренер {{trainer}}',
  'reminder.trainer.false': 'Без тренера',
}

export default function (token: string, params?) {
  let tr = translations[token]

  if (params) {
    Object.keys(params).forEach(key => {
      tr = tr.replace(`{{${key}}}`, params[key])
    })
  }

  return tr
}