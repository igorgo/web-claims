import Routines from '../../plugins/routines'

export const setCurrentReleases = (state, currentReleases) => {
  const mapRelease = (r) => ({
    releaseName: r.n,
    releaseDate: Routines.formatDate(r.rd),
    lastBuildNumber: r.b,
    lastBuildDate: Routines.formatDate(r.bd),
    openedIssues: r.o,
    closedIssues: r.c,
    version: r.v
  })
  if (currentReleases.length > 1) {
    state.betaRelease = mapRelease(currentReleases[0])
    state.stableRelease = mapRelease(currentReleases[1])
  } else if (currentReleases.length === 1) {
    state.stableRelease = mapRelease(currentReleases[0])
  }
  state.releasesLoaded = true
}

export const resetCurrentReleases = (state) => {
  state.stableRelease = state.emptyRelease
  state.betaRelease = state.emptyRelease
  state.releasesLoaded = false
}
