// src/api/userApi.js
import axiosClient from './axiosClient';

const userApi = {
    getAllUsers: () => axiosClient.get('/api/accounts/users'),
    addUser: (data) => axiosClient.post('/api/accounts/users', data),
    updateUser: (id, data) => axiosClient.put(`/api/accounts/users/${id}`, data),
    deleteUser: (id) => axiosClient.delete(`/api/accounts/users/${id}`),
};

export default userApi;