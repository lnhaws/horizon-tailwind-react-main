// src/api/orderApi.js
import axiosClient from './axiosClient';

const getCartId = () => {
    let cartId = localStorage.getItem('cartId');
    return cartId;
};

const orderApi = {
    createOrder: (userId, payload) => {
        return axiosClient.post(`/api/shop/order/${userId}`, payload, {
            headers: { 'Cart-Id': getCartId() }
        });
    },

    getAllOrders: () => axiosClient.get('/api/shop/orders'),
    updateOrderStatus: (orderId, status) => axiosClient.put(`/api/shop/order/${orderId}/status?status=${status}`),
    getOrderDetails: (orderId) => axiosClient.get(`/api/shop/order/details/${orderId}`)
};

export default orderApi;