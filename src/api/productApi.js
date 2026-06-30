import axiosClient from './axiosClient';
import axios from 'axios'; 

const BASE_URL = '/api/catalog'; 

const productApi = {
    getAllProducts: () => axiosClient.get(`${BASE_URL}/products`),
    getProductById: (id) => axiosClient.get(`${BASE_URL}/products/${id}`),
    getProductsByCategory: (categoryId) => axiosClient.get(`${BASE_URL}/products?categoryId=${categoryId}`),
    searchProducts: (name) => axiosClient.get(`${BASE_URL}/products?name=${name}`),

    getRelatedProducts: (categoryId, excludeId) => axiosClient.get(`${BASE_URL}/products/category/${categoryId}/related/${excludeId}`),

    addProduct: (product) => axiosClient.post(`${BASE_URL}/admin/products`, product),
    updateProduct: (id, product) => axiosClient.put(`${BASE_URL}/admin/products/${id}`, product),
    deleteProduct: (id) => axiosClient.delete(`${BASE_URL}/admin/products/${id}`),
    
    uploadImage: async (productId, fileObj) => {
        let actualFile = fileObj;

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
        else if (fileObj && fileObj.target && fileObj.target.files) {
            actualFile = fileObj.target.files[0];
        } 
        else if (Array.isArray(fileObj)) {
            actualFile = fileObj[0];
        }

        const formData = new FormData();
        formData.append("image", actualFile); 

        return axios.post(`http://localhost:8900${BASE_URL}/admin/products/${productId}/image`, formData);
    }
};

export default productApi;