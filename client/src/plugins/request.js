import restClient from './restClient'

// leave the export, even if you don't use it
export default ({ app, store, router, Vue }) => {
  restClient.$store = store
  Vue.prototype.$request = restClient
}
