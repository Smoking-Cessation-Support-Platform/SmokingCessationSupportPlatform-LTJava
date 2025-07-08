import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Tạo instance axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 giây timeout
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Thêm interceptor để xử lý token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý lỗi chung
const handleError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  if (error.code === 'ECONNABORTED') {
    throw new Error('Yêu cầu quá thời gian chờ. Vui lòng thử lại sau.');
  }
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/login';
    throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
  }
  const errorMessage = error.response?.data?.message || 
                      error.message || 
                      'Đã xảy ra lỗi không xác định';
  throw new Error(errorMessage);
};

// Lưu dữ liệu hút thuốc mới
export const saveSmokingData = async (userId, smokingData) => {
  try {
    const response = await apiClient.post(`/smoking-data/log/${userId}`, smokingData);
    return response.data;
  } catch (error) {
    return handleError(error, 'Lỗi khi lưu dữ liệu hút thuốc:');
  }
};

// Cập nhật dữ liệu hút thuốc
// Cập nhật dữ liệu hút thuốc
export const updateSmokingData = async (userId, smokingDataId, updatedData) => {
  try {
    const response = await apiClient.put(
      `/smoking-data/${userId}/${smokingDataId}`, 
      updatedData
    );
    return response.data;
  } catch (error) {
    return handleError(error, 'Lỗi khi cập nhật dữ liệu hút thuốc:');
  }
};

// Lấy lịch sử hút thuốc của người dùng
export const getUserSmokingHistory = async (userId, params = {}) => {
  try {
    const response = await apiClient.get(`/smoking-data/${userId}/history`, { 
      params,
      paramsSerializer: params => {
        return Object.entries(params)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&');
      }
    });
    return response.data;
  } catch (error) {
    return handleError(error, 'Lỗi khi lấy lịch sử hút thuốc:');
  }
};

// Lấy thống kê hút thuốc
export const getSmokingStats = async (userId, period = 'week') => {
  try {
    const response = await apiClient.get(`/smoking-data/${userId}/stats`, { 
      params: { period } 
    });
    return response.data;
  } catch (error) {
    return handleError(error, 'Lỗi khi lấy thống kê hút thuốc:');
  }
};

// Xóa dữ liệu hút thuốc
export const deleteSmokingData = async (userId, recordId) => {
  try {
    const response = await apiClient.delete(`/smoking-data/${userId}/${recordId}`);
    return response.data;
  } catch (error) {
    return handleError(error, 'Lỗi khi xóa dữ liệu hút thuốc:');
  }
};

// Lấy dữ liệu hút thuốc theo ID
export const getSmokingDataById = async (userId, recordId) => {
  try {
    const response = await apiClient.get(`/smoking-data/${userId}/record/${recordId}`);
    return response.data;
  } catch (error) {
    return handleError(error, 'Lỗi khi lấy chi tiết dữ liệu hút thuốc:');
  }
};

// Cập nhật mục tiêu cai thuốc
export const updateSmokingGoal = async (userId, goalData) => {
  try {
    const response = await apiClient.put(
      `/smoking-data/${userId}/goal`,
      goalData
    );
    return response.data;
  } catch (error) {
    return handleError(error, 'Lỗi khi cập nhật mục tiêu cai thuốc:');
  }
};

// Lấy mục tiêu cai thuốc
export const getSmokingGoal = async (userId) => {
  try {
    const response = await apiClient.get(`/smoking-data/${userId}/goal`);
    return response.data;
  } catch (error) {
    return handleError(error, 'Lỗi khi lấy mục tiêu cai thuốc:');
  }
};

// Lấy tiến độ cai thuốc
export const getSmokingProgress = async (userId) => {
  try {
    const response = await apiClient.get(`/smoking-data/${userId}/progress`);
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Yêu cầu quá thời gian chờ. Vui lòng thử lại sau.');
    }
    return handleError(error, 'Lỗi khi lấy tiến độ cai thuốc:');
  }
};

// Tải xuống báo cáo hút thuốc
export const downloadSmokingReport = async (userId, format = 'pdf') => {
  try {
    const response = await apiClient.get(`/smoking-data/${userId}/report`, {
      responseType: 'blob',
      params: { format }
    });
    return response.data;
  } catch (error) {
    return handleError(error, 'Lỗi khi tải báo cáo:');
  }
}; 