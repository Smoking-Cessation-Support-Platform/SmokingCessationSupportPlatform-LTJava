import axios from 'axios';

// Payment types from database schema
export const PAYMENT_TYPES = {
  USER_SUBSCRIPTION: 'USER_SUBSCRIPTION',
  COACH_REGISTRATION: 'COACH_REGISTRATION'
};

// Payment statuses from database schema
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  EXPIRED: 'EXPIRED'
};

const API_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for logging
axiosInstance.interceptors.request.use(
  config => {
    console.log(`[Payment API] ${config.method.toUpperCase()} ${config.url}`, 
      config.data ? 'Data:' : '', config.data || '');
    return config;
  },
  error => {
    console.error('[Payment API] Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
axiosInstance.interceptors.response.use(
  response => {
    console.log(`[Payment API] Response from ${response.config.url}:`, response.data);
    return response;
  },
  error => {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('[Payment API] Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: errorMessage
    });
    return Promise.reject(error);
  }
);

/**
 * Create a new payment
 * @param {Object} paymentData - Payment details
 * @param {string} paymentData.userId - ID of the user making the payment (required for USER_SUBSCRIPTION)
 * @param {string} paymentData.coachId - ID of the coach (required for COACH_REGISTRATION)
 * @param {number} paymentData.amount - Payment amount in VND (required)
 * @param {string} paymentData.paymentMethod - Payment method (e.g., 'bank_transfer', 'momo') (required)
 * @param {string} paymentData.paymentType - Type of payment (USER_SUBSCRIPTION or COACH_REGISTRATION) (required)
 * @param {string} [paymentData.notes] - Optional notes about the payment
 * @returns {Promise<Object>} Payment details including orderCode for verification
 */
export const createPayment = async (paymentData) => {
  try {
    // Validate required fields
    if (!paymentData.amount || isNaN(paymentData.amount)) {
      throw new Error('Số tiền thanh toán không hợp lệ');
    }
    
    if (!paymentData.paymentMethod) {
      throw new Error('Vui lòng chọn phương thức thanh toán');
    }
    
    if (!paymentData.paymentType || !Object.values(PAYMENT_TYPES).includes(paymentData.paymentType)) {
      throw new Error('Loại thanh toán không hợp lệ');
    }
    
    // Validate user/coach ID based on payment type
    if (paymentData.paymentType === PAYMENT_TYPES.USER_SUBSCRIPTION && !paymentData.userId) {
      throw new Error('Thiếu thông tin người dùng');
    }
    
    if (paymentData.paymentType === PAYMENT_TYPES.COACH_REGISTRATION && !paymentData.coachId) {
      throw new Error('Thiếu thông tin huấn luyện viên');
    }
    
    let url = '';
    if (paymentData.paymentType === PAYMENT_TYPES.USER_SUBSCRIPTION) {
      url = `/payments/user/${paymentData.userId}`;
    } else if (paymentData.paymentType === PAYMENT_TYPES.COACH_REGISTRATION) {
      url = `/payments/coach/${paymentData.coachId}`;
    } else {
      throw new Error('Loại thanh toán không hợp lệ');
    }

    const payload = {
      amount: paymentData.amount,
      paymentMethod: paymentData.paymentMethod,
      notes: paymentData.notes || ''
    };

    const response = await axiosInstance.post(url, payload);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi tạo thanh toán';
    console.error('[Payment API] Create payment error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get payment history for a user
 * @param {string} userId - ID of the user
 * @returns {Promise<Array>} List of user's payments
 */
export const getUserPayments = async (userId) => {
  try {
    if (!userId) {
      throw new Error('Thiếu thông tin người dùng');
    }
    const response = await axiosInstance.get(`/payments/user/${userId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Lỗi khi lấy lịch sử thanh toán';
    console.error('[Payment API] Get user payments error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get payment details by ID
 * @param {string} paymentId - ID of the payment
 * @returns {Promise<Object>} Payment details
 */
export const getPaymentDetail = async (paymentId) => {
  try {
    if (!paymentId) {
      throw new Error('Thiếu thông tin thanh toán');
    }
    const response = await axiosInstance.get(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Lỗi khi lấy thông tin thanh toán';
    console.error('[Payment API] Get payment detail error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Update payment status
 * @param {string} paymentId - ID of the payment
 * @param {Object} statusData - Status update data
 * @param {string} statusData.status - New status (e.g., 'pending', 'completed', 'failed')
 * @param {string} [statusData.note] - Optional note about the status update
 * @returns {Promise<Object>} Updated payment details
 */
export const updatePaymentStatus = async (paymentId, statusData) => {
  try {
    if (!paymentId || !statusData?.status) {
      throw new Error('Thiếu thông tin cập nhật trạng thái');
    }
    const response = await axiosInstance.put(`/payments/${paymentId}/status`, statusData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Lỗi khi cập nhật trạng thái thanh toán';
    console.error('[Payment API] Update payment status error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Confirm payment completion
 * @param {string} paymentId - ID of the payment to confirm
 * @returns {Promise<Object>} Confirmation result
 */
export const confirmPayment = async (paymentId) => {
  try {
    if (!paymentId) {
      throw new Error('Thiếu thông tin thanh toán');
    }
    const response = await axiosInstance.post(`/payments/${paymentId}/confirm`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Lỗi khi xác nhận thanh toán';
    console.error('[Payment API] Confirm payment error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get available payment methods
 * @returns {Promise<Array>} List of available payment methods
 */
export const getPaymentMethods = async () => {
  try {
    // In a real app, this would call your backend
    // For now, return a static list of payment methods
    return Promise.resolve([
      {
        id: 'bank_transfer',
        name: 'Chuyển khoản ngân hàng',
        description: 'Thanh toán qua chuyển khoản ngân hàng',
        icon: '��',
        fee: 0,
        minAmount: 10000 // 10,000 VND minimum
      },
      {
        id: 'momo',
        name: 'Ví điện tử MoMo',
        description: 'Thanh toán qua ví điện tử MoMo',
        icon: '💜',
        fee: 0,
        minAmount: 1000 // 1,000 VND minimum
      },
      {
        id: 'vnpay',
        name: 'VNPay',
        description: 'Thanh toán qua VNPay',
        icon: '💳',
        fee: 0,
        minAmount: 1000 // 1,000 VND minimum
      }
    ]);
  } catch (error) {
    console.error('[Payment API] Get payment methods error:', error);
    return [];
  }
};

/**
 * Get payment status text in Vietnamese
 * @param {string} status - Payment status from API
 * @returns {string} Human-readable status in Vietnamese
 */
export const getPaymentStatusText = (status) => {
  const statusMap = {
    [PAYMENT_STATUS.PENDING]: 'Đang chờ xử lý',
    [PAYMENT_STATUS.COMPLETED]: 'Đã thanh toán',
    [PAYMENT_STATUS.FAILED]: 'Thanh toán thất bại',
    [PAYMENT_STATUS.EXPIRED]: 'Đã hết hạn'
  };
  return statusMap[status] || 'Không xác định';
};

/**
 * Get payment type text in Vietnamese
 * @param {string} type - Payment type from API
 * @returns {string} Human-readable type in Vietnamese
 */
export const getPaymentTypeText = (type) => {
  const typeMap = {
    [PAYMENT_TYPES.USER_SUBSCRIPTION]: 'Gia hạn tài khoản',
    [PAYMENT_TYPES.COACH_REGISTRATION]: 'Đăng ký huấn luyện viên'
  };
  return typeMap[type] || 'Không xác định';
};

/**
 * Verify payment
 * @param {string} paymentId - ID of the payment to verify
 * @returns {Promise<Object>} Verification result
 */
export const verifyPayment = async (paymentId) => {
  try {
    if (!paymentId) {
      throw new Error('Thiếu thông tin thanh toán');
    }
    const response = await axiosInstance.get(`/payments/${paymentId}/verify`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Lỗi khi xác minh thanh toán';
    console.error('[Payment API] Verify payment error:', errorMessage);
    throw new Error(errorMessage);
  }
};