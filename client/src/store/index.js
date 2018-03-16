import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import main from './main'
import filters from './filters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    main,
    filters
  }
})

if (module.hot) {
  // accept actions and mutations as hot modules
  module.hot.accept(['./auth'], () => {
    // require the updated modules
    // have to add .default here due to babel 6 module output
    const newModuleAuth = require('./auth').default
    // swap in the new actions and mutations
    store.hotUpdate({
      modules: {
        auth: newModuleAuth
      }
    })
  })
}

export default store
