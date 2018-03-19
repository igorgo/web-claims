import { SessionStorage } from 'quasar'
function saveStaticData (data) {
  SessionStorage.set('staticData', data)
}

export const setClaimStatuses = (state, statuses) => {
  state.claimStatuses = statuses.map(i => i.code)
  saveStaticData(state)
}

export const setAppList = (state, appList) => {
  state.appList = appList.map(i => i.app)
  saveStaticData(state)
}

export const setUnitList = (state, unitList) => {
  state.unitList = unitList.map(i => i.unit)
  saveStaticData(state)
}

export const resetStaticData = (state) => {
  state.claimStatuses = []
  state.appList = []
  state.unitList = []
  SessionStorage.remove('staticData')
}
