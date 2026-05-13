import axios from 'axios';

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8900',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, 
});

axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        console.error("Lỗi gọi API:", error);
        return Promise.reject(error);
    }
);

export default axiosClient;