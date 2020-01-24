const translations = {
  contantRequired: 'Для авторизацii у системi, нам потрiбнi вашi контактнi данi',
  userNotFound: 'Користувача з вашим номером телефона не було знайдено',
  userNotAuthorized: 'Ви не авторизованi',
  sendContact: 'Вiдправити контактнi данi',
  seasonPass: 'У вас залишилось {{amountOfTraining}} тренуваннь, срок дii до {{availableTill}}',
  authComplete: 'Дякую {{name}}, тепер ви можете переглянути статус вашого абонементу та записуватись на тренування'
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