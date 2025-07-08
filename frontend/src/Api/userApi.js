import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('Response error:', error);
    
    if (!error.response) {
      // Network error
      return Promise.reject(new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.'));
    }

    if (error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('isMember');
      localStorage.removeItem('userProfile');
      window.location.href = '/login';
      return Promise.reject(new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'));
    }

    return Promise.reject(error.response.data || error);
  }
);

// Đăng ký tài khoản người dùng
export const register = async (userData) => {
  try {
    // Log the request
    console.log('Sending registration request:', { ...userData, password: '***' });

    // Make the API call with retry logic
    let retries = 3;
    let lastError = null;

    while (retries > 0) {
      try {
        const response = await axiosInstance.post('/users/register', userData);
        console.log('Server response:', response);

        if (!response || !response.data) {
          throw new Error('Không nhận được phản hồi từ máy chủ');
        }

        const data = response.data;

        if (!data) {
          throw new Error('Dữ liệu phản hồi không hợp lệ');
        }
        
        if (data.error || (typeof data === 'string' && data.includes && data.includes('error'))) {
          throw new Error(data.error || data);
        }

        const userId = data.userId || (data.user && data.user.id);
        
        if (!userId) {
          console.error('Invalid response format:', data);
          throw new Error('Không nhận được ID người dùng từ máy chủ');
        }

        return {
          userId: userId,
          email: userData.email,
          username: userData.username,
          success: true
        };
      } catch (error) {
        lastError = error;
        retries--;
        if (retries > 0) {
          console.log(`Registration attempt failed. Retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
        }
      }
    }

    // If we get here, all retries failed
    console.error('Registration error after all retries:', lastError);
    
    if (lastError.response) {
      const errorMessage = lastError.response.data?.message || lastError.response.data || 'Đăng ký thất bại';
      throw new Error(errorMessage);
    } else if (lastError.request) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    } else {
      throw lastError;
    }
  } catch (error) {
    console.error('Final registration error:', error);
    throw error;
  }
};

// Đăng nhập người dùng
export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post('/users/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.id);
      localStorage.setItem('isMember', 'true');
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
  }
};

// Lấy thông tin người dùng
export const getUserProfile = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Vui lòng đăng nhập để tiếp tục');
    if (!userId || isNaN(parseInt(userId))) throw new Error('ID người dùng không hợp lệ');
    const response = await axiosInstance.get(`/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.data) throw new Error('Không tìm thấy thông tin người dùng');
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('isMember');
        throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      }
      throw new Error(error.response.data?.message || 'Không thể lấy thông tin người dùng');
    }
    throw error;
  }
};

// Cập nhật thông tin người dùng
export const updateProfile = async (userId, profileData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Vui lòng đăng nhập để tiếp tục');
    if (!userId || isNaN(parseInt(userId))) throw new Error('ID người dùng không hợp lệ');
    const response = await axiosInstance.put(`/users/${userId}`, profileData, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('isMember');
        throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      }
      throw new Error(error.response.data?.message || 'Cập nhật thông tin thất bại');
    }
    throw error;
  }
};

// Đăng xuất
export const logout = () => {
  // Xóa thông tin lưu trữ
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('isMember');
  localStorage.removeItem('userProfile');
  
  // Redirect to login
  window.location.href = '/login';
  
  return true;
};

// Lấy kế hoạch cai thuốc
export const getQuitPlans = async (userId) => {
  try {
    if (!userId) {
      throw new Error('Vui lòng đăng nhập để xem kế hoạch');
    }

    // Đảm bảo userId là số hợp lệ
    const numericUserId = parseInt(userId);
    if (isNaN(numericUserId)) {
      throw new Error('ID người dùng không hợp lệ');
    }

    console.log('Fetching quit plans for user ID:', numericUserId);
    const response = await axiosInstance.get(`/quit-plans/${numericUserId}`);
    
    if (!response.data) {
      return []; // Trả về mảng rỗng nếu không có kế hoạch
    }
    
    return response.data;
  } catch (error) {
    console.error('Error in getQuitPlans:', error);
    if (error.response?.status === 404) {
      return []; // Trả về mảng rỗng nếu không tìm thấy
    }
    throw new Error(error.response?.data?.message || 'Không thể lấy kế hoạch cai thuốc. Vui lòng thử lại sau.');
  }
};

// Lưu kế hoạch cai thuốc
export const saveQuitPlans = async (userId, plans) => {
  try {
    if (!userId) {
      throw new Error('Vui lòng đăng nhập để lưu kế hoạch');
    }

    // Đảm bảo userId là số hợp lệ
    const numericUserId = parseInt(userId);
    if (isNaN(numericUserId)) {
      throw new Error('ID người dùng không hợp lệ');
    }

    // Validate plans data
    if (!Array.isArray(plans) || plans.length === 0) {
      throw new Error('Dữ liệu kế hoạch không hợp lệ');
    }

    const response = await axiosInstance.post(`/quit-plans/${numericUserId}`, plans);
    return response.data;
  } catch (error) {
    console.error('Error in saveQuitPlans:', error);
    throw new Error(error.response?.data?.message || 'Không thể lưu kế hoạch cai thuốc. Vui lòng thử lại sau.');
  }
};

// Xóa kế hoạch cai thuốc
export const deleteQuitPlans = async (userId) => {
  try {
    await axiosInstance.delete(`/quit-plans/${userId}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể xóa kế hoạch cai thuốc');
  }
};

// Lấy thông tin mức độ nghiện thuốc
export const getAddictionLevel = async (userId) => {
  try {
    const response = await axiosInstance.get(`/smoking-data/addiction/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy thông tin mức độ nghiện');
  }
};

// Lấy thông tin cam kết
export const getCommitments = async (userId) => {
  if (!userId) {
    throw new Error('userId is required');
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios({
      method: 'GET',
      url: `http://localhost:8080/api/commitments/${userId}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.data) {
      return [];
    }

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching commitments:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn');
    }
    
    if (error.response?.status === 404) {
      return [];
    }
    
    throw new Error(error.response?.data?.message || 'Không thể lấy thông tin cam kết');
  }
};

export const updateCommitment = async (commitmentId, data) => {
  try {
    const response = await axiosInstance.put(`/commitments/${commitmentId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể cập nhật cam kết');
  }
};

export const deleteCommitment = async (commitmentId, userId) => {
  try {
    const response = await axiosInstance.delete(`/commitments/${commitmentId}?userId=${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể xóa cam kết');
  }
}; 