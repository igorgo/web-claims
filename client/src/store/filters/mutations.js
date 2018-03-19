export const setFiltersList = (state, filters) => {
  state.filters = filters
  if (filters.length) {
    if (state.currentFilter.rn) {
      const i = filters.findIndex(f => f.rn === state.currentFilter.rn)
      state.listIndex = (i > -1) ? i : 0
    } else if (state.listIndex === -1 || state.listIndex > filters.length) {
      state.listIndex = 0
    }
  }
}

export const filtersListScrollTo = (state, pos) => {
  state.listIndex = pos
}
