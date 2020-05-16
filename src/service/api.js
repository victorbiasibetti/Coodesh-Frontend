import axios from 'axios'

const api = axios.create({
  baseURL: 'https://coodesh-backend.herokuapp.com'
})

export default api;