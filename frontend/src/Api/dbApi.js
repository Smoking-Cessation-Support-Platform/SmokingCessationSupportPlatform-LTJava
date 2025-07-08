import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Lấy tất cả người dùng
export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    const response = await axiosInstance.get('/users', {
      headers: {
        'Authorization': Bearer ${token}
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Xóa người dùng
export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem('adminToken');
    const response = await axiosInstance.delete(/admin/users/${userId}, {
      headers: {
        'Authorization': Bearer ${token}
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export default {
  getAllUsers,
  deleteUser
};