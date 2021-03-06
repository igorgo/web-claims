import axios from 'axios'
import store from '../../store'
import { Notify, Loading, QSpinnerHourglass } from 'quasar'

let reqCount = 0

const fullEndPoint = ep => '/api' + ((ep.charAt(0) === '/') ? '' : '/') + ep

const parseError = e => {
  const message = e.response ? e.response.data.message : e.message
  const m = message.match(/^ORA-\d+: (.+)/)
  return (m && (m.length > 1)) ? m[1] : message
}

const showLoading = () => {
  reqCount++
  if (reqCount > 1) return
  store.commit('setRestProgress')
  Loading.show({
    spinner: QSpinnerHourglass,
    delay: 50
  })
}

const hideLoading = () => {
  reqCount--
  if (reqCount > 0) return
  store.commit('unsetRestProgress')
  Loading.hide()
}

const restClient = {
  post: async (endPoint, data, sync = true) => {
    try {
      if (sync) showLoading()
      // noinspection UnnecessaryLocalVariableJS
      const resp = await axios.post(
        fullEndPoint(endPoint),
        data,
        {
          headers: { 'content-type': 'application/json' }
        }
      )
      return resp
    } catch (e) {
      const message = parseError(e)
      Notify.create({
        message,
        type: 'negative'
      })
      throw new Error(message)
    } finally {
      if (sync) hideLoading()
    }
  },
  get: async (endPoint, params, sync = true) => {
    try {
      if (sync) showLoading()
      // noinspection UnnecessaryLocalVariableJS
      const resp = await axios.request({
        url: fullEndPoint(endPoint),
        method: 'get',
        headers: { 'content-type': 'application/json' },
        params
      })
      return resp
    } catch (e) {
      const message = parseError(e)
      Notify.create({
        message,
        type: 'negative'
      })
      throw new Error(message)
    } finally {
      if (sync) hideLoading()
    }
  },
  down: async (endPoint, params) => {
    try {
      return await axios.request({
        url: fullEndPoint(endPoint),
        method: 'post',
        headers: { 'content-type': 'application/json' },
        responseType: 'blob',
        params
      })
    } catch (e) {
      const message = parseError(e)
      Notify.create({
        message,
        type: 'negative'
      })
      throw new Error(message)
    }
  }
}

export default restClient
