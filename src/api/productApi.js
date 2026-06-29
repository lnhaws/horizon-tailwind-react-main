// src/api/productApi.js
import axiosClient from './axiosClient';
import axios from 'axios'; // 🌟 ĐỪNG QUÊN IMPORT THẰNG NÀY ĐỂ DÙNG AXIOS GỐC

const BASE_URL = '/api/catalog'; 

const productApi = {
    getAllProducts: () => axiosClient.get(`${BASE_URL}/products`),
    getProductById: (id) => axiosClient.get(`${BASE_URL}/products/${id}`),
    getProductsByCategory: (categoryId) => axiosClient.get(`${BASE_URL}/products?categoryId=${categoryId}`),
    searchProducts: (name) => axiosClient.get(`${BASE_URL}/products?name=${name}`),

    addProduct: (product) => axiosClient.post(`${BASE_URL}/admin/products`, product),
    updateProduct: (id, product) => axiosClient.put(`${BASE_URL}/admin/products/${id}`, product),
    deleteProduct: (id) => axiosClient.delete(`${BASE_URL}/admin/products/${id}`),
    
    // 🌟 BẢN FIX "TRÙM CUỐI": TỰ ĐỘNG ÉP MỌI THỂ LOẠI DATA THÀNH FILE CHUẨN
    uploadImage: async (productId, fileObj) => {
        let actualFile = fileObj;

        // BẪY 1: Nếu UI đang truyền vào chuỗi chữ Base64 (Từ chức năng xem trước ảnh)
        if (typeof fileObj === 'string' && fileObj.startsWith('data:image')) {
            const arr = fileObj.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while(n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            actualFile = new File([u8arr], "product_image.jpg", { type: mime });
        } 
        // BẪY 2: Nếu UI vô tình truyền nguyên cái Sự kiện (Event) của thẻ <input>
        else if (fileObj && fileObj.target && fileObj.target.files) {
            actualFile = fileObj.target.files[0];
        } 
        // BẪY 3: Nếu dữ liệu bị bọc trong một Mảng (Array)
        else if (Array.isArray(fileObj)) {
            actualFile = fileObj[0];
        }

        // Đóng gói an toàn để gửi đi
        const formData = new FormData();
        formData.append("image", actualFile); // Backend bắt buộc phải tìm chữ "image" này

        // Bắn bằng axios gốc (Bỏ qua màng lọc axiosClient để không bị ép Header thành JSON)
        return axios.post(`http://localhost:8900${BASE_URL}/admin/products/${productId}/image`, formData);
    }
};

export default productApi;