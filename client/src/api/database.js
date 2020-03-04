import axios from 'axios';

export const server = 'http://localhost:3010'

const axiosInstance = axios.create({
    baseURL: server
})

export default axiosInstance;