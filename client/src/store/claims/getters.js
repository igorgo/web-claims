import Routines from '../../plugins/routines'

const actionsFlags = {
  'edit': 0b00000000001,
  'delete': 0b00000000010,
  'status': 0b00000000100,
  'assign': 0b00000001000,
  'return': 0b00000010000,
  'annul': 0b00000100000,
  'comment': 0b00001000000,
  'attach': 0b00010000000,
  'prioritize': 0b00100000000,
  'setHelpNeed': 0b01000000000,
  'setHelpStatus': 0b10000000000
}

export const currentCondition = (state, getters, rootState) => rootState.auth.userData['LAST_COND']

export const currentClaimSort = (state, getters, rootState) => rootState.auth.userData['CLAIM_SORT']

export const currentClaimLimit = (state, getters, rootState) => rootState.auth.userData['LIST_LIMIT']

export const isSortOrderDesc = (state, getters, rootState) => !!rootState.auth.userData['CLAIM_SORT_ORDER']

export const sessionID = (state, getters, rootState) => rootState.auth.sessionID

export const activeClaimRecord = (state, getters, rootState) => state.activeRecordIndex >= 0
  ? state.claimList[state.activeRecordIndex]
  : {}

export const isFirstRecord = state =>
  (state.currentClaimPage === 1) &&
  (state.activeRecordIndex === 0)

export const isLastRecord = state =>
  (state.currentClaimPage === state.claimListPages) &&
  (state.activeRecordIndex === (state.claimList.length - 1))

export const historyByDay = state => {
  let result = []
  let onDay = null
  let j = -1
  for (let i = state.claimHistory.length - 1; i > -1; i--) {
    const rec = state.claimHistory[i]
    const day = Routines.formatDate(rec.date)
    if (day !== onDay) {
      result.push({
        day: Routines.formatDateFull(rec.date),
        content: []
      })
      j++
      onDay = day
    }
    let { date, ...restRec } = rec
    result[j].content.push({
      time: Routines.formatOnlyTime(date, false),
      ...restRec
    })
  }
  return result
}

export const availableActions = state => {
  const isActionAvail = action => (state.actionsMask & actionsFlags[action]) === actionsFlags[action]
  let result = []
  isActionAvail('status') && result.push({
    code: 'status',
    label: 'змінити статус',
    icon: 'assignment turned in'
  })
  isActionAvail('return') && result.push({
    code: 'return',
    label: 'повернути попередній статус',
    icon: 'assignment return'
  })
  isActionAvail('comment') && result.push({
    code: 'comment',
    label: 'коментувати',
    icon: 'speaker notes'
  })
  isActionAvail('assign') && result.push({
    code: 'assign',
    label: 'змінити виконавця',
    icon: 'assignment ind'
  })
  isActionAvail('attach') && result.push({
    code: 'attach',
    label: 'додати файл(и)',
    icon: 'attach file'
  })
  isActionAvail('prioritize') && result.push({
    code: 'prioritize',
    label: 'змінити пріоритет',
    icon: 'swap vert'
  })
  isActionAvail('edit') && result.push({
    code: 'edit',
    label: 'виправити',
    icon: 'mode edit'
  })
  isActionAvail('annul') && result.push({
    code: 'annul',
    label: 'анулювати',
    icon: 'block'
  })
  isActionAvail('delete') && result.push({
    code: 'delete',
    label: 'видалити',
    icon: 'delete'
  })
  isActionAvail('setHelpNeed') && result.push({
    code: 'setHelpNeed',
    label: 'вказати необхідність довідки',
    icon: 'help'
  })
  isActionAvail('setHelpStatus') && result.push({
    code: 'setHelpStatus',
    label: 'вказати статус довідки',
    icon: 'live help'
  })
  return result
}
