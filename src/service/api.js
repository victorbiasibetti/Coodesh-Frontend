import axios from 'axios'

const api = axios.create({
  // baseURL: 'https://coodesh-backend.herokuapp.com'
  baseURL: 'http://localhost:4000'
})

export default api;