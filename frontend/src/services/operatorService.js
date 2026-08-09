import api from './api'

export const searchOperators = async (keyword) => {
  const response = await api.get('/operators/search', {
    params: {
      keyword,
    },
  })

  return response.data
}