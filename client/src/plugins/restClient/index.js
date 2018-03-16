import axios from 'axios'
import { Notify } from 'quasar'

const fullEndPoint = ep => '/api/' + ep

const parseError = e => {
  const message = e.response ? e.response.data.message : e.message
  const m = message.match(/^ORA-\d+: (.+)/)
  return m.length > 1 ? m[1] : message
}

const restClient = {
  post: async (endPoint, data) => {
    try {
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
    }
  },
  get: async (endPoint, params) => {
    try {
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
    }
  }
}

export default restClient
