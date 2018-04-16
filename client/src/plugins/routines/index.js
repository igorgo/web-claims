import {date} from 'quasar'
import {Base64} from 'js-base64'
const DAY_NAMES = [
  'неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'п\'ятниця', 'субота'
]

const b64encode = s => Base64.encode(s)

const b64decode = s => Base64.decode(s)

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

const FORM_CLAIM_HELP_MODE = {
  NEED: 'need',
  STATUS: 'state'
}

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

const DEFAULT_HEADER = 'Примечание'
const DEFAULT_HEADER_INST = 'Инсталлятор'

function formatDate (str) {
  return date.isValid(str) ? date.formatDate(new Date(str), 'DD.MM.YYYY') : str
}

function formatDateTime (str) {
  return date.isValid(str) ? date.formatDate(new Date(str), 'DD.MM.YYYY HH:mm:ss') : str
}

function formatOnlyTime (str, sec = true) {
  const fs = sec ? 'HH:mm:ss' : 'HH:mm'
  return date.isValid(str) ? date.formatDate(new Date(str), fs) : str
}

function formatDateFull (str) {
  return date.isValid(str)
    ? date.formatDate(
      new Date(str),
      'D MMMM YYYY, dddd',
      { dayNames: DAY_NAMES, monthNames: MONTH_NAMES }
    )
    : str
}

function mapEvents ({ keysMap, $root }, listen) {
  if (!keysMap) return
  for (let i in keysMap) {
    if (keysMap.hasOwnProperty(i)) {
      if (listen) $root.$on('globalKey:' + i, keysMap[i])
      else $root.$off('globalKey:' + i, keysMap[i])
    }
  }
}

function hrFileSize (bites) {
  if (isNaN(bites)) {
    throw new Error('Invalid number')
  }

  let result = []

  const symbol = ['байт', 'Kб', 'Mб', 'Гб']
  let e = Math.floor(Math.log(bites) / Math.log(1024))
  if (e > 3) {
    e = 3
  }
  if (bites === 0) {
    result[0] = 0
    result[1] = symbol[0]
  } else {
    const val = bites / Math.pow(2, e * 10)
    result[0] = Number(val.toFixed(e > 0 ? 2 : 0))
    result[1] = symbol[e]
  }
  return result.join(' ')
}

function saveFile (data, filename, mime) {
  const blob = new Blob([data], {type: mime || 'application/octet-stream'})
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // IE workaround for "HTML7007: One or more blob URLs were
    // revoked by closing the blob for which they were created.
    // These URLs will no longer resolve as the data backing
    // the URL has been freed."
    window.navigator.msSaveBlob(blob, filename)
  } else {
    const blobURL = window.URL.createObjectURL(blob)
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', filename)

    // Safari thinks _blank anchor are pop ups. We only want to set _blank
    // target if the browser does not support the HTML5 download attribute.
    // This allows you to download files in desktop safari if pop up blocking
    // is enabled.
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }

    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    window.URL.revokeObjectURL(blobURL)
  }
}

export default {
  saveFile,
  formatDate,
  formatDateFull,
  formatDateTime,
  formatOnlyTime,
  mapEvents,
  hrFileSize,
  b64encode,
  b64decode,
  SORT_OPTIONS,
  HELP_STATUS,
  HELP_NEED_OPTIONS,
  HELP_STATUS_OPTIONS,
  CLAIM_TYPE_BY_ID,
  CLAIM_TYPE_OPTIONS,
  NOTES_HEADER_OPTIONS,
  DEFAULT_HEADER,
  DEFAULT_HEADER_INST,
  FORM_CLAIM_HELP_MODE
}
