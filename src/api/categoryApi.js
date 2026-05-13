import axiosClient from './axiosClient';

const BASE_URL = '/api/cate/categories';

const categoryApi = {
  getAllCategories: () => axiosClient.get(BASE_URL),
  getCategoryById: (id) => axiosClient.get(`${BASE_URL}/${id}`),
  addCategory: (data) => axiosClient.post(BASE_URL, data),
  updateCategory: (id, data) => axiosClient.put(`${BASE_URL}/${id}`, data),
  deleteCategory: (id) => axiosClient.delete(`${BASE_URL}/${id}`) 
};

export default categoryApi;