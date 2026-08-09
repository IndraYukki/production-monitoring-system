import api from './api'

export const getCustomers = async () => {
  const response = await api.get('/customer')
  return response.data
}