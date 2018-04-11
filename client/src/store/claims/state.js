import { SessionStorage } from 'quasar'

export default {
  claimList: [],
  doNotUpdateList: false,
  doNotUpdateRecord: false,
  currentClaimPage: SessionStorage.has('currentClaimPage') ? SessionStorage.get.item('currentClaimPage') : 1,
  newAddedClaimId: null,
  claimListPages: 1,
  activeRecordIndex: null,
  claimRecord: { id: null },
  claimFiles: [],
  claimHistory: [],
  actionsMask: 0
}
