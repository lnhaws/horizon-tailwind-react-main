import axiosClient from './axiosClient';

const getCartId = () => {
    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
        cartId = Date.now().toString(); 
        localStorage.setItem('cartId', cartId);
    }
    return cartId;
};

const BASE_URL = '/api/shop/cart';

const cartApi = {
    getCart: () => 
        axiosClient.get(BASE_URL, { headers: { 'Cart-Id': getCartId() } }),
        
    addToCart: (productId, quantity) => 
        axiosClient.post(`${BASE_URL}?productId=${productId}&quantity=${quantity}`, null, { headers: { 'Cart-Id': getCartId() } }),
        
    removeFromCart: (productId) => 
        axiosClient.delete(`${BASE_URL}?productId=${productId}`, { headers: { 'Cart-Id': getCartId() } }),
        
    // HÀM MỚI: Khớp chính xác với @PostMapping("/cart/merge") của Backend
    mergeCart: (guestCartId, userCartId) => 
        axiosClient.post(`${BASE_URL}/merge?guestCartId=${guestCartId}&userCartId=${userCartId}`)
};

export default cartApi;