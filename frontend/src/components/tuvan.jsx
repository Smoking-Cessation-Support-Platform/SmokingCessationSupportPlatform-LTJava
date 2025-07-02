<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

const TuVan = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('faq');

  const [faqOpenState, setFaqOpenState] = useState({});

  const [captchaCode, setCaptchaCode] = useState("");

  const generateCaptcha = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 7; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
  };

  useEffect(() => {
    const isMember = localStorage.getItem('isMember') === 'true';
    if (!isMember) {
      alert("Bạn cần đăng nhập để truy cập.");
      navigate("/login"); 
    }

    generateCaptcha();
  }, [navigate]); 

  const switchTab = (tabId) => {
    setActiveTab(tabId);
    setFaqOpenState({});
  };

  const toggleAnswer = (index) => {
    setFaqOpenState(prevState => ({
      ...prevState,
      [index]: !prevState[index] 
    }));
  };

  const validateForm = (event) => {
    event.preventDefault(); 

    const captchaInput = document.getElementById("captcha").value.trim().toUpperCase();
    if (captchaInput !== captchaCode) { 
      alert("Sai mã bảo vệ. Vui lòng thử lại.");
      generateCaptcha();
      return false;
    }
    alert("Câu hỏi của bạn đã được gửi. Cảm ơn!");
    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("email").value = "";
    document.getElementById("question").value = "";
    document.getElementById("captcha").value = "";
    generateCaptcha(); 
    return true;
  };

  const goBack = () => {
    navigate("/"); 
  };

  const faqData = [
    {
=======
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const Tuvan = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('faq');
  const [captcha, setCaptcha] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    content: '',
    captchaInput: ''
  });
  const [visibleAnswers, setVisibleAnswers] = useState({});

  // Kiểm tra đăng nhập khi component mount
  useEffect(() => {
    const checkAuth = () => {
      const isMember = localStorage.getItem('isMember') === 'true';
      const token = localStorage.getItem('token');
      
      if (!isMember || !token) {
        alert("Bạn cần đăng nhập để sử dụng tính năng này.");
        navigate("/login");
        return;
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Khởi tạo captcha khi component mount
  useEffect(() => {
    updateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars[Math.floor(Math.random() * chars.length)];
    }
    return captcha;
  };

  const updateCaptcha = () => {
    const newCaptcha = generateCaptcha();
    setCaptcha(newCaptcha);
    return newCaptcha;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.captchaInput.trim().toUpperCase() !== captcha) {
      alert("Mã bảo vệ không đúng!");
      updateCaptcha();
      setFormData(prev => ({ ...prev, captchaInput: '' }));
      return;
    }

    try {
      // Tạo dữ liệu câu hỏi
      const questionData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        content: formData.content.trim()
      };

      console.log('Sending question data:', questionData);

      // Gửi câu hỏi đến backend
      const response = await axios.post(`${API_URL}/consult/questions`, questionData);
      console.log('Response:', response.data);
      
      // Reset form và tạo captcha mới
      setFormData({
        name: '',
        phone: '',
        email: '',
        content: '',
        captchaInput: ''
      });
      updateCaptcha();
      
      alert("Câu hỏi của bạn đã được gửi thành công!");
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = 'Có lỗi xảy ra khi gửi câu hỏi: ';
      if (error.response?.data) {
        errorMessage += error.response.data;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Vui lòng thử lại sau.';
      }
      
      alert(errorMessage);
    }
  };

  const dangXuat = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('isMember');
      localStorage.removeItem('username');
      navigate('/');
    }
  };

  const toggleAnswer = (questionId) => {
    setVisibleAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const faqQuestions = [
    {
      id: 1,
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
      question: "Để cai thuốc lá người ta thường sử dụng những cách nào?",
      answer: "Có thể sử dụng thuốc hỗ trợ, tư vấn tâm lý, tập thể dục, hoặc thay đổi môi trường sống."
    },
    {
<<<<<<< HEAD
=======
      id: 2,
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
      question: "Cai thuốc có khó không?",
      answer: "Khó hay dễ tùy người, nhưng với hỗ trợ đúng cách, nhiều người đã cai thành công."
    }
  ];

  return (
<<<<<<< HEAD
    <>
      <style>{`
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: auto;
          padding: 20px;
        }

        .tabs {
          margin-bottom: 20px;
        }

        .tab-btn {
          padding: 10px 20px;
          border: 1px solid #b00;
          background-color: white;
          color: #b00;
          cursor: pointer;
          font-weight: bold;
          border-radius: 5px 5px 0 0;
          margin-right: 5px;
        }

        .tab-btn.active {
          background-color: #b00;
          color: white;
        }

        .tab-content {
          display: none;
        }

        .tab-content.active {
          display: block;
        }

        .question-box {
          border: 1px solid #ccc;
          padding: 10px 15px;
          margin-bottom: 10px;
          border-radius: 5px;
          position: relative;
        }

        .question-number {
          background-color: red;
          color: white;
          border-radius: 50%;
          display: inline-block;
          width: 25px;
          height: 25px;
          text-align: center;
          line-height: 25px;
          margin-right: 10px;
          font-weight: bold;
        }

        .question-title {
          display: inline-block;
          font-weight: bold;
          cursor: pointer;
        }

        .answer {
          display: none;
          margin-top: 10px;
          color: #333;
        }

        .answer.show { /* Thêm lớp 'show' vào answer */
          display: block;
        }

        .toggle-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          font-size: 18px;
          cursor: pointer;
          color: #777;
        }

        .ask-form {
          border: 1px solid #ccc;
          padding: 20px;
          border-radius: 10px;
        }

        .ask-form h3 {
          color: #b00;
        }

        .ask-form label {
          font-weight: bold;
          display: block;
          margin: 10px 0 5px;
        }

        .ask-form input,
        .ask-form textarea {
          width: 100%;
          padding: 8px;
          font-size: 14px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .captcha-box {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .captcha-code {
          font-weight: bold;
          background-color: #eee;
          padding: 5px 10px;
          letter-spacing: 2px;
          border: 1px solid #aaa;
          user-select: none;
        }

        .ask-form button {
          background-color: #b00;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .ask-form button:hover {
          background-color: #900;
        }

        .container {
          max-width: 1200px;
          margin: auto;
          position: relative;
        }

        .back-btn {
          position: absolute;
          top: 0;
          right: 0;
          background-color: #009688;
          color: white;
          border: none;
          padding: 8px 14px;
          border-radius: 5px;
          cursor: pointer;
        }

        .back-btn:hover {
          background-color: #00796b;
        }

        @media screen and (max-width: 768px) {
          .back-btn {
            position: relative;
            margin-bottom: 10px;
          }
        }
      `}</style>

      <div className="container">
        <button className="back-btn" onClick={goBack}>← Quay lại</button>
=======
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>← Quay lại</button>
        <button style={styles.logoutBtn} onClick={dangXuat}>Đăng xuất</button>
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
      </div>

      <h2>💬 Tư vấn trực tuyến</h2>

<<<<<<< HEAD
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
          onClick={() => switchTab('faq')}
        >
          Câu hỏi thường gặp
        </button>
        <button
          className={`tab-btn ${activeTab === 'ask' ? 'active' : ''}`}
          onClick={() => switchTab('ask')}
=======
      <div style={styles.tabs}>
        <button 
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'faq' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('faq')}
        >
          Câu hỏi thường gặp
        </button>
        <button 
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'ask' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('ask')}
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
        >
          Đặt câu hỏi
        </button>
      </div>

<<<<<<< HEAD
      <div className={`tab-content ${activeTab === 'faq' ? 'active' : ''}`} id="faq">
        {faqData.map((item, index) => (
          <div className="question-box" key={index}>
            <span className="question-number">{index + 1}</span>
            <span className="question-title" onClick={() => toggleAnswer(index)}>
              Câu hỏi: {item.question}
            </span>
            <div className="toggle-btn">{faqOpenState[index] ? '-' : '+'}</div>
            <div className={`answer ${faqOpenState[index] ? 'show' : ''}`}>
              Trả lời: {item.answer}
=======
      <div style={{
        ...styles.tabContent,
        display: activeTab === 'faq' ? 'block' : 'none'
      }} id="faq">
        {faqQuestions.map((q) => (
          <div style={styles.questionBox} key={q.id}>
            <span style={styles.questionNumber}>{q.id}</span>
            <span style={styles.questionTitle} onClick={() => toggleAnswer(q.id)}>
              Câu hỏi: {q.question}
            </span>
            <div style={styles.toggleBtn} onClick={() => toggleAnswer(q.id)}>
              {visibleAnswers[q.id] ? '-' : '+'}
            </div>
            <div style={{
              ...styles.answer,
              display: visibleAnswers[q.id] ? 'block' : 'none'
            }}>
              Trả lời: {q.answer}
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
            </div>
          </div>
        ))}
      </div>

<<<<<<< HEAD
      <div className={`tab-content ${activeTab === 'ask' ? 'active' : ''}`} id="ask">
        <form className="ask-form" onSubmit={validateForm}>
          <h3>Câu hỏi của bạn</h3>
          <label>Họ và tên:</label>
          <input type="text" id="name" required />

          <label>Điện thoại:</label>
          <input type="text" id="phone" required />

          <label>Email:</label>
          <input type="email" id="email" required />

          <label>Câu hỏi:</label>
          <textarea id="question" rows="5" required></textarea>

          <label>Mã bảo vệ:</label>
          <div className="captcha-box">
            <input type="text" id="captcha" placeholder="Nhập mã" required />
            <div className="captcha-code" id="captcha-code">{captchaCode}</div>
          </div>

          <button type="submit">Gửi câu hỏi</button>
        </form>
      </div>
    </>
  );
};

export default TuVan;
=======
      <div style={{
        ...styles.tabContent,
        display: activeTab === 'ask' ? 'block' : 'none'
      }} id="ask">
        <form style={styles.askForm} onSubmit={handleSubmit}>
          <h3 style={styles.formTitle}>Câu hỏi của bạn</h3>
          
          <label style={styles.label}>Họ và tên:</label>
          <input
            style={styles.input}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <label style={styles.label}>Điện thoại:</label>
          <input
            style={styles.input}
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />

          <label style={styles.label}>Email:</label>
          <input
            style={styles.input}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <label style={styles.label}>Câu hỏi:</label>
          <textarea
            style={styles.textarea}
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows="5"
            required
          />

          <label style={styles.label}>Mã bảo vệ:</label>
          <div style={styles.captchaBox}>
            <input
              style={styles.input}
              type="text"
              name="captchaInput"
              value={formData.captchaInput}
              onChange={handleInputChange}
              placeholder="Nhập mã"
              required
            />
            <div style={styles.captchaCode} onClick={updateCaptcha}>
              {captcha || 'Loading...'}
            </div>
          </div>

          <button style={styles.submitBtn} type="submit">Gửi câu hỏi</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: 'auto',
    padding: '20px',
    position: 'relative'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    width: '100%'
  },
  tabs: {
    marginBottom: '20px'
  },
  tabBtn: {
    padding: '10px 20px',
    border: '1px solid #b00',
    backgroundColor: 'white',
    color: '#b00',
    cursor: 'pointer',
    fontWeight: 'bold',
    borderRadius: '5px 5px 0 0',
    marginRight: '5px'
  },
  activeTab: {
    backgroundColor: '#b00',
    color: 'white'
  },
  tabContent: {
    display: 'none'
  },
  questionBox: {
    border: '1px solid #ccc',
    padding: '10px 15px',
    marginBottom: '10px',
    borderRadius: '5px',
    position: 'relative'
  },
  questionNumber: {
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
    display: 'inline-block',
    width: '25px',
    height: '25px',
    textAlign: 'center',
    lineHeight: '25px',
    marginRight: '10px',
    fontWeight: 'bold'
  },
  questionTitle: {
    display: 'inline-block',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  answer: {
    marginTop: '10px',
    color: '#333'
  },
  toggleBtn: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#777'
  },
  askForm: {
    border: '1px solid #ccc',
    padding: '20px',
    borderRadius: '10px'
  },
  formTitle: {
    color: '#b00',
    marginTop: 0
  },
  label: {
    fontWeight: 'bold',
    display: 'block',
    margin: '10px 0 5px'
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    minHeight: '100px',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  captchaBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px'
  },
  captchaCode: {
    fontWeight: 'bold',
    backgroundColor: '#eee',
    padding: '5px 10px',
    letterSpacing: '2px',
    border: '1px solid #aaa',
    userSelect: 'none',
    cursor: 'pointer',
    fontFamily: 'Courier New, monospace',
    fontSize: '18px',
    minWidth: '100px',
    textAlign: 'center'
  },
  submitBtn: {
    backgroundColor: '#b00',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '100%'
  },
  backBtn: {
    backgroundColor: '#009688',
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  logoutBtn: {
    backgroundColor: '#b00',
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease'
  },
  '@media screen and (max-width: 768px)': {
    header: {
      flexDirection: 'row',
      gap: '10px'
    },
    backBtn: {
      position: 'relative',
      marginBottom: '0'
    },
    logoutBtn: {
      marginBottom: '0'
    }
  }
};

export default Tuvan;
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
