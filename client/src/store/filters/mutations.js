export const setCurrentReleases = (state, filters) => {
  state.filters = filters
  if (filters.length) {
    if (state.currentFilter.rn) {
      const i = filters.findIndex(f => f['RN'] === state.currentFilter.rn)
      state.listIndex = (i > -1) ? i : 0
    } else state.listIndex = 0
  }
}
