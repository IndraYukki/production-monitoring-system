import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.letscodingindra.my.id/api',
})

export default api