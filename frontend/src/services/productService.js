import api from './api'

export const searchProducts = async (keyword) => {
  const response = await api.get('/products/search', {
    params: {
      keyword,
    },
  })

  return response.data
}

export const getProducts = async ({
  halaman = 0,
  jumlah = 10,
  keyword = '',
  customerId = '',
  status = '',
} = {}) => {

  const response = await api.get('/products', {
    params: {
      halaman,
      jumlah,
      keyword: keyword || undefined,
      customerId: customerId || undefined,
      status: status || undefined,
    },
  })

  return response.data
}

export const addProduct = async (data) => {
  const response = await api.post('/products', data)

  return response.data
}

export const updateProduct = async (id, data) => {
  const response = await api.put(`/products/${id}`, data)

  return response.data
}