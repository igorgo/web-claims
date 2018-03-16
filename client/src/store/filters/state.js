const emptyFilter = {
  claimNumb: '',
  claimVersion: '',
  claimRelease: '',
  claimBuild: '',
  claimUnit: '',
  claimApp: '',
  imInitiator: null,
  imExecutor: null,
  claimContent: '',
  claimStatus: '',
  claimExecutor: '',
  claimAuthor: '',
  claimType: ''
}

export default {
  filters: [],
  emptyFilter,
  currentFilter: {
    rn: null,
    name: '',
    ...emptyFilter
  },
  invokedByClaims: false,
  listIndex: -1,
  doNotUpdate: false
}
