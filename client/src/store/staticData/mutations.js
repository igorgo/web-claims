import { SessionStorage } from 'quasar'
import Routines from '../../plugins/routines'

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

export const setPersons = (state, personList) => {
  state.personList = personList.map(i => ({label: i.l, value: i.v}))
  saveStaticData(state)
}

export const setReleases = (state, buildList) => {
  let releases = {}
  for (let i = 0; i < buildList.length; i++) {
    if (!releases.hasOwnProperty(buildList[i].v)) {
      releases[buildList[i].v] = {}
    }
    if (!releases[buildList[i].v].hasOwnProperty(buildList[i].r)) {
      releases[buildList[i].v][buildList[i].r] = {}
    }
    releases[buildList[i].v][buildList[i].r][buildList[i].b] = Routines.formatDate(buildList[i].d)
  }
  state.releases = releases
  saveStaticData(state)
}

export const clearUnitAppAndFunc = (state) => {
  state.unitApps = []
  state.unitFuncs = []
}

export const setUnitApps = (state, apps) => {
  state.unitApps = apps
}

export const setUnitFunc = (state, func) => {
  state.unitFuncs = func
}

export const resetStaticData = (state) => {
  state.claimStatuses = []
  state.appList = []
  state.unitList = []
  state.releases = {}
  state.personList = {}
  SessionStorage.remove('staticData')
}
