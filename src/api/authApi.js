// src/api/authApi.js
import axiosClient from "./axiosClient";

const authApi = {
  register: (data) => {
    return axiosClient.post('/api/accounts/registration', data);
  },
  
  login: (data) => {
    return axiosClient.post('/api/accounts/login', data);
  }
};

export default authApi;