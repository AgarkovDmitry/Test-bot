const translations = {
  contactRequired: 'Для авторизацii у системi, нам потрiбнi вашi контактнi данi',
  userNotFound: 'Користувача з вашим номером телефона не було знайдено',
  userNotAuthorized: 'Ви не авторизованi',
  sendContact: 'Вiдправити контактнi данi',
  seasonPass: 'У вас залишилось {{amountoftraining}} тренуваннь, срок дii до {{availabletill}}',
  authComplete: 'Дякую {{name}}, тепер ви можете переглянути статус вашого абонементу та записуватись на тренування',
  'menu.seasonPass': 'Мой абонимент',
  'menu.schedule': 'Мои тренировки',
  'menu.booking': 'Записаться на тренировку',
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