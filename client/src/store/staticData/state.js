import { SessionStorage } from 'quasar'

const savedStaticData = SessionStorage.has('staticData') ? SessionStorage.get.item('staticData') : {
  claimStatuses: [],
  unitList: [],
  appList: []
}

export default {
  ...savedStaticData
}
