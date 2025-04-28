// src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:5000/api"; // URL backend của bạn

export const registerUser = async (data) => {
  const response = await axios.post(`${API_URL}/auth/register`, data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await axios.post(`${API_URL}/auth/login`, data);
  return response.data; // trả về token khi đăng nhập thành công
};

export const getProfile = async (token) => {
  const response = await axios.get(`${API_URL}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
