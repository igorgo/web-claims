export const userData = (state) => state.userData

export const currentCondition = (state) => (state.userData && state.userData.hasOwnProperty('LAST_COND'))
  ? state.userData['LAST_COND']
  : null
