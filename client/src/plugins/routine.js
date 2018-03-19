// import something here

// leave the export, even if you don't use it
import Routines from './routines'

export default ({ app, router, Vue }) => {
  Vue.prototype.$routines = Routines
}
