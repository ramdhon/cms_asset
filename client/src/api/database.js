import axios from 'axios';
import config from '../config';

export const server = config.serverAPI;

const axiosInstance = axios.create({
    baseURL: server
})

export default axiosInstance;