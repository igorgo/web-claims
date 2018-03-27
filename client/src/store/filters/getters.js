export const filtersNames = (state) => {
  return state.filters.map(i => i.name)
}

export const filtersOptions = (state) => {
  return [
    {
      label: 'поточний',
      value: null
    },
    ...state.filters.map(i => ({
      label: i.name,
      value: i.rn
    }))
  ]
}
