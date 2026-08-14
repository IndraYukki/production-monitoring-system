import api from './api'

export const searchOperators = async (keyword) => {
  const response = await api.get('/operators/search', {
    params: {
      keyword,
    },
  })

  return response.data
}

export const getOperators = async ({
  halaman = 0,
  jumlah = 10,
  keyword = '',
  groub = '',
}) => {
  const response = await api.get('/operators', {
    params: {
      halaman,
      jumlah,
      keyword,
      groub,
    },
  })

  return response.data
}

export const addOperator = async (data) => {
  const response = await api.post('/operators', data)
  return response.data
}

export const updateOperator = async (id, data) => {
  const response = await api.put(`/operators/${id}`, data)
  return response.data
}

export const deleteOperator = async (id) => {
  const response = await api.delete(`/operators/${id}`)
  return response.data
}