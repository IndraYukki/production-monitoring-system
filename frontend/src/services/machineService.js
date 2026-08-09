import api from './api'

export const getMachines = async () => {
  const response = await api.get('/machines')
  return response.data
}