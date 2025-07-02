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
      question: "Để cai thuốc lá người ta thường sử dụng những cách nào?",
      answer: "Có thể sử dụng thuốc hỗ trợ, tư vấn tâm lý, tập thể dục, hoặc thay đổi môi trường sống."
    },
    {
      question: "Cai thuốc có khó không?",
      answer: "Khó hay dễ tùy người, nhưng với hỗ trợ đúng cách, nhiều người đã cai thành công."
    }
  ];

  return (
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
      </div>

      <h2>💬 Tư vấn trực tuyến</h2>

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
        >
          Đặt câu hỏi
        </button>
      </div>

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
            </div>
          </div>
        ))}
      </div>

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