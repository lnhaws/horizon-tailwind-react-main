// src/api/cartApi.js
import axiosClient from './axiosClient';

// Hàm lấy Cart-Id từ LocalStorage, nếu chưa có thì tự tạo 1 dãy số ngẫu nhiên
const getCartId = () => {
    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
        cartId = Date.now().toString(); // Tạo ID dựa trên thời gian thực
        localStorage.setItem('cartId', cartId);
    }
    return cartId;
};

// Cổng của Order Service trên Gateway là /shop/
const BASE_URL = '/api/shop/cart';

const cartApi = {
    getCart: () => 
        axiosClient.get(BASE_URL, { headers: { 'Cart-Id': getCartId() } }),
        
    addToCart: (productId, quantity) => 
        axiosClient.post(`${BASE_URL}?productId=${productId}&quantity=${quantity}`, null, { headers: { 'Cart-Id': getCartId() } }),
        
    removeFromCart: (productId) => 
        axiosClient.delete(`${BASE_URL}?productId=${productId}`, { headers: { 'Cart-Id': getCartId() } })
};

export default cartApi;