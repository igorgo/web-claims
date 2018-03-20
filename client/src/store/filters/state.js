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
