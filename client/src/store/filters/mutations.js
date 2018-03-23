export const setFiltersList = (state, filters) => {
  state.filters = filters
  if (filters.length) {
    if (state.newFilterRn) {
      const i = filters.findIndex(f => f.rn === state.newFilterRn)
      state.listIndex = (i > -1) ? i : 0
      state.newFilterRn = null
    } else if (state.listIndex === -1 || state.listIndex > filters.length) {
      state.listIndex = 0
    }
  } else {
    state.listIndex = -1
  }
}

export const setNewFilterRn = (state, rn) => {
  state.newFilterRn = rn
}

export const filtersListScrollTo = (state, pos) => {
  state.listIndex = state.filters.length > pos ? pos : -1
}

export const filtersListScroll = (state, shift) => {
  const i = state.listIndex + shift
  if ((i >= 0) && (i < state.filters.length)) state.listIndex = i
}
