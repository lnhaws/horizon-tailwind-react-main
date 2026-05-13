// src/api/productApi.js
import axiosClient from './axiosClient';

const productApi = {
    // Lấy danh sách
    getAllProducts: () => axiosClient.get('/api/catalog/products'),

    // Lấy chi tiết
    getProductById: (id) => axiosClient.get(`/api/catalog/products/${id}`),

    // Thêm mới
    addProduct: (data) => axiosClient.post('/api/catalog/admin/products', data),

    // Cập nhật
    updateProduct: (id, data) => axiosClient.put(`/api/catalog/admin/products/${id}`, data),

    // Xóa
    deleteProduct: (id) => axiosClient.delete(`/api/catalog/admin/products/${id}`),

    // Đẩy ảnh lên
    uploadImage: (id, formData) => axiosClient.post(`/api/catalog/admin/products/${id}/image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
};

export default productApi;