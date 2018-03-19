import {date} from 'quasar'

const DAY_NAMES = [
  'неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'п\'ятниця', 'субота'
]

const MONTH_NAMES = [
  'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
  'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
]

const SORT_OPTIONS = [
  {
    label: 'без сортування',
    field: ''
  },
  {
    label: 'Дата реєстрації',
    field: 'REG_DATE'
  },
  {
    label: 'Дата зміни',
    field: 'CHANGE_DATE'
  },
  {
    label: 'Виконавець',
    field: 'EXECUTOR'
  },
  {
    label: 'Автор',
    field: 'INITIATOR'
  },
  {
    label: 'Пріоритет',
    field: 'PRIORITY'
  }
]

const HELP_STATUS = {
  0: 'Не вирішено',
  1: 'Немає необхідності',
  2: 'Необхідно',
  3: 'Включити в альбом',
  4: 'Описано в іншій рекламації',
  5: 'Поки пропущу',
  21: 'Включено',
  22: 'Не включено',
  23: 'Відкладено',
  24: 'Не треба',
  25: 'Включено в альбом'
}

const HELP_NEED_OPTIONS = [
  {
    label: 'Не вирішено',
    value: 0
  },
  {
    label: 'Немає необхідності',
    value: 1
  },
  {
    label: 'Необхідно',
    value: 2
  },
  {
    label: 'Включити в альбом',
    value: 3
  },
  {
    label: 'Описано в іншій рекламації',
    value: 4
  },
  {
    label: 'Поки пропущу',
    value: 5
  }
]

const HELP_STATUS_OPTIONS = [
  {
    label: 'Включено',
    value: 21
  },
  {
    label: 'Не включено',
    value: 22
  },
  {
    label: 'Відкладено',
    value: 23
  },
  {
    label: 'Не треба',
    value: 24
  },
  {
    label: 'Включено в альбом',
    value: 25
  }
]

const CLAIM_TYPE_BY_ID = {
  4440: 'ПОМИЛКА',
  4412: 'ДОРОБКА',
  4424: 'ЗАУВАЖЕННЯ'
}

const CLAIM_TYPE_OPTIONS = [
  {
    label: 'ДОРОБКА',
    value: 'ДОРАБОТКА'
  },
  {
    label: 'ЗАУВАЖЕННЯ',
    value: 'ЗАМЕЧАНИЕ'
  },
  {
    label: 'ПОМИЛКА',
    value: 'ОШИБКА'
  }
]

const NOTES_HEADER_OPTIONS = [
  {
    label: 'Коментар',
    value: 'Примечание'
  },
  {
    label: 'Новини релізу',
    value: 'Инсталлятор'
  },
  {
    label: 'Документування',
    value: 'Документування'
  },
  {
    label: 'Уточнення',
    value: 'Уточнение'
  }
]

function formatDate (str) {
  return date.isValid(str) ? date.formatDate(new Date(str), 'DD.MM.YYYY') : str
}

function formatDateFull (str) {
  return date.isValid(str)
    ? date.formatDate(
      new Date(str),
      'D MMMM YYYY, dddd',
      {dayNames: DAY_NAMES, monthNames: MONTH_NAMES}
    )
    : str
}

function mapEvents ({eventsMap, $root}, listen) {
  if (!eventsMap) return
  for (let i in eventsMap) {
    if (eventsMap.hasOwnProperty(i)) {
      if (listen) $root.$on('globalKey:' + i, eventsMap[i])
      else $root.$off('globalKey:' + i, eventsMap[i])
    }
  }
}

export default {
  formatDate: formatDate,
  formatDateFull: formatDateFull,
  mapEvents: mapEvents,
  SORT_OPTIONS,
  HELP_STATUS,
  HELP_NEED_OPTIONS,
  HELP_STATUS_OPTIONS,
  CLAIM_TYPE_BY_ID,
  CLAIM_TYPE_OPTIONS,
  NOTES_HEADER_OPTIONS
}
