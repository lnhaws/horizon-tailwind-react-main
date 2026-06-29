// src/api/productApi.js
import axiosClient from './axiosClient';

const BASE_URL = '/api/catalog'; // Prefix tuỳ thuộc vào Gateway của ông

const productApi = {
    getAllProducts: () => axiosClient.get(`${BASE_URL}/products`),
    getProductById: (id) => axiosClient.get(`${BASE_URL}/products/${id}`),
    
    // 🌟 Đã sửa: Truyền categoryId theo chuẩn Backend mới
    getProductsByCategory: (categoryId) => axiosClient.get(`${BASE_URL}/products?categoryId=${categoryId}`),
    searchProducts: (name) => axiosClient.get(`${BASE_URL}/products?name=${name}`),

    // Cho Admin
    addProduct: (product) => axiosClient.post(`${BASE_URL}/admin/products`, product),
    updateProduct: (id, product) => axiosClient.put(`${BASE_URL}/admin/products/${id}`, product),
    deleteProduct: (id) => axiosClient.delete(`${BASE_URL}/admin/products/${id}`),
    
    uploadImage: (productId, file) => {
        const formData = new FormData();
        formData.append("image", file);
        
        return axiosClient.post(`${BASE_URL}/admin/products/${productId}/image`, formData);
    }
};

export default productApi;