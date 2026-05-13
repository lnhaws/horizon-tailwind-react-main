// src/api/paymentApi.js
import axiosClient from './axiosClient';

const paymentApi = {
    createVnPayUrl: (orderId, amount) => {
        return axiosClient.get(`/api/payment/create-vnpay?amount=${amount}&orderId=${orderId}`);
    },
    
    verifyPayment: (queryString) => {
        return axiosClient.get(`/api/payment/verify-vnpay?${queryString}`);
    }
};

export default paymentApi;