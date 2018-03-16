import restClient from '../../plugins/restClient'

export const getFiltersList = async ({commit}) => {
  const res = await restClient.get('filters/my-list', {})
  commit('setFiltersList', res.data)
}
