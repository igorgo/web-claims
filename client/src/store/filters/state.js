const emptyFilter = {
  claimNumb: '',
  claimVersion: '',
  claimRelease: '',
  claimBuild: '',
  claimUnit: '',
  claimApp: '',
  imInitiator: 0,
  imExecutor: 0,
  claimContent: '',
  claimStatus: '',
  claimExecutor: '',
  claimAuthor: '',
  claimType: '',
  helpSign: ''
}

export default {
  filters: [],
  emptyFilter,
  newFilterRn: null,
  invokedByClaims: false,
  listIndex: -1,
  doNotUpdate: false
}
