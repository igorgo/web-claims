import { SessionStorage } from 'quasar'

export default {
  claimList: [],
  doNotUpdate: false,
  currentClaimPage: SessionStorage.has('currentClaimPage') ? SessionStorage.get.item('currentClaimPage') : 1,
  newAddedClaimId: null,
  claimListPages: 1,
  activeRecordIndex: null
}
