function arrayToOptions (arr) {
  return arr.map(i => ({ label: i, value: i }))
}

function mapToOptions (amap) {
  const arr = []
  for (let key in amap) {
    arr.push({ label: key, value: key })
  }
  return arr
}

export const statusesForSelect = state => arrayToOptions(state.claimStatuses)

export const appsForSelect = state => arrayToOptions(state.appList)

export const unitsForSelect = state => arrayToOptions(state.unitList)

export const versionsForSelect = state => mapToOptions(state.releases)

export const releasesForSelect = state => (version) => {
  return state.releases.hasOwnProperty(version) ? mapToOptions(state.releases[version]) : []
}

export const personsForSelect = state => state.personList

export const buildsForSelect = state => (version, release) => {
  return state.releases.hasOwnProperty(version) && state.releases[version].hasOwnProperty(release)
    ? mapToOptions(state.releases[version][release])
    : []
}

export const initiatorSelect = state => state.personList.map((pers, idx) => ({ label: pers.label, value: idx }))
