import api from './api'

export const searchProducts = async (keyword) => {
  const response = await api.get('/products/search', {
    params: {
      keyword,
    },
  })

  return response.data
}