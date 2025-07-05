import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Lấy câu hỏi gần đây
export const getRecentQuestions = async (limit = 5) => {
  try {
    const response = await axios.get(${API_URL}/consult/questions/recent?limit=${limit});
    return response.data;
  } catch (error) {
    throw error.response?.data  error.message;
  }
};

// Gửi câu hỏi tư vấn
export const sendQuestion = async (questionData) => {
  try {
    const response = await axios.post(${API_URL}/consult/questions, questionData);
    return response.data;
  } catch (error) {
    throw error.response?.data  error.message;
  }
};

// Lấy danh sách câu hỏi của người dùng
export const getUserQuestions = async (userId) => {
  try {
    const response = await axios.get(${API_URL}/consult/questions/user/${userId});
    return response.data;
  } catch (error) {
    throw error.response?.data  error.message;
  }
};

// Lấy danh sách câu hỏi chưa được trả lời (cho huấn luyện viên)
export const getUnansweredQuestions = async () => {
  try {
    const response = await axios.get(${API_URL}/consult/questions/unanswered);
    return response.data;
  } catch (error) {
    throw error.response?.data  error.message;
  }
};

// Trả lời câu hỏi (dành cho huấn luyện viên)
export const answerQuestion = async (questionId, answerData) => {
  try {
    const response = await axios.post(${API_URL}/consult/questions/${questionId}/answer, answerData);
    return response.data;
  } catch (error) {
    throw error.response?.data  error.message;
  }
};

// Lấy chi tiết một câu hỏi
export const getQuestionDetail = async (questionId) => {
  try {
    const response = await axios.get(${API_URL}/consult/questions/${questionId});
    return response.data;
  } catch (error) {
    throw error.response?.data  error.message;
  }
}; 