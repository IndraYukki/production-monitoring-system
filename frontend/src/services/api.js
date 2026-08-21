import axios from 'axios'

const api = axios.create({
       baseURL: 'https://api.letscodingindra.my.id/api',
    // baseURL: 'http://localhost:8080/api',
})

export default api