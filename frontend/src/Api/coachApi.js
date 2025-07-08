import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Cấu hình axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Đăng nhập dành cho huấn luyện viên
export const coachLogin = async (username, password) => {
  try {
    const response = await axiosInstance.post('/coaches/login', { username, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Đăng ký tài khoản huấn luyện viên
export const coachRegister = async (coachData) => {
  try {
    const response = await axiosInstance.post('/coaches/register', coachData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Lấy thông tin huấn luyện viên
export const getCoachProfile = async (coachId) => {
  try {
    const response = await axiosInstance.get(`/coaches/${coachId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Lấy danh sách người dùng được phân công
export const getAssignedUsers = async (coachId) => {
  try {
    const response = await axiosInstance.get(`/coaches/${coachId}/users`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Cập nhật thông tin huấn luyện viên
export const updateCoachProfile = async (coachId, updateData) => {
  try {
    const response = await axiosInstance.put(`/coaches/${coachId}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Lấy danh sách huấn luyện viên
export const getCoachList = async () => {
  try {
    const response = await axiosInstance.get('/coaches');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Lấy chi tiết huấn luyện viên
export const getCoachDetail = async (coachId) => {
  try {
    const response = await axiosInstance.get(`/coaches/${coachId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteCoach = async (coachId) => {
  try {
    const response = await axiosInstance.delete(`/coaches/${coachId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};