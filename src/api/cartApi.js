
import axiosClient from './axiosClient';

const getCartId = () => {
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
        try {
            const user = JSON.parse(currentUserStr);
            if (user && user.id) {
                return user.id.toString(); 
            }
        } catch (e) {}
    }

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
        
    addToCart: (productId, variantId, quantity) => {
        let url = `${BASE_URL}?productId=${productId}&quantity=${quantity}`;
        if (variantId) url += `&variantId=${variantId}`;
        return axiosClient.post(url, null, { headers: { 'Cart-Id': getCartId() } });
    },
        
    removeFromCart: (productId, variantId) => {
        let url = `${BASE_URL}?productId=${productId}`;
        if (variantId) url += `&variantId=${variantId}`;
        return axiosClient.delete(url, { headers: { 'Cart-Id': getCartId() } });
    },
        
    mergeCart: (guestCartId, userCartId) => 
        axiosClient.post(`${BASE_URL}/merge?guestCartId=${guestCartId}&userCartId=${userCartId}`)
};

export default cartApi;