import {date} from 'quasar'

const DAY_NAMES = [
  'неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'п\'ятниця', 'субота'
]

const MONTH_NAMES = [
  'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
  'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
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

export default {
  formatDate: formatDate,
  formatDateFull: formatDateFull
}
