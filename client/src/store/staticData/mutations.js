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

export const setReleases = (state, buildList) => {
  let releases = new Map()
  for (let i = 0; i < buildList.length; i++) {
    if (!releases.has(buildList[i].v)) {
      releases.set(buildList[i].v, new Map())
    }
    if (!releases.get(buildList[i].v).has(buildList[i].r)) {
      releases.get(buildList[i].v).set(buildList[i].r, new Map())
    }
    releases.get(buildList[i].v).get(buildList[i].r).set(buildList[i].b, Routines.formatDate(buildList[i].d))
  }
  console.log(releases)
  state.releases = releases
  saveStaticData(state)
}

export const resetStaticData = (state) => {
  state.claimStatuses = []
  state.appList = []
  state.unitList = []
  state.releases = new Map()
  SessionStorage.remove('staticData')
}
