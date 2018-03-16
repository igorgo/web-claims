const emptyRelease = {
  releaseName: null,
  releaseDate: null,
  lastBuildNumber: null,
  lastBuildDate: null,
  openedIssues: null,
  closedIssues: null,
  version: null
}

export default {
  emptyRelease,
  stableRelease: emptyRelease,
  betaRelease: emptyRelease,
  releasesLoaded: false
}
