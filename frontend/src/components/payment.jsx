import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Payment = () => {
  const [countdownSeconds, setCountdownSeconds] = useState(15 * 60); 
  const [transferNote, setTransferNote] = useState('DH2505294461612'); 
  const intervalRef = useRef(null); 

  const navigate = useNavigate(); 

  const bodyStyle = {
    fontFamily: 'Arial, sans-serif',
    background: '#f5f5f5',
    margin: 0,
    padding: '20px',
    color: '#333',
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center',
    minHeight: '100vh',
  };

  const containerStyle = {
    maxWidth: '1000px',
    margin: 'auto',
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '30px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  };

  const leftRightBaseStyle = {
    flex: 1,
    minWidth: '300px',
  };

  const leftImgStyle = {
    width: '100%',
    maxWidth: '300px',
    display: 'block',
    margin: 'auto',
  };

  const amountStyle = {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#f2a900',
    marginTop: '10px',
  };

  const notesStyle = {
    marginTop: '30px',
    fontSize: '14px',
  };

  const notesStrongStyle = {
    color: '#d32f2f',
  };

  const infoItemStyle = {
    marginBottom: '20px',
  };

  const infoLabelStyle = {
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#555',
  };

  const infoValueStyle = {
    fontSize: '20px',
    color: '#f2a900',
    wordBreak: 'break-word',
  };

  const infoCopyStyle = {
    display: 'inline-block',
    background: '#03a9f4',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '4px',
    marginLeft: '10px',
    fontSize: '14px',
    cursor: 'pointer',
  };

  const countdownStyle = {
    color: '#f57c00',
    fontSize: '20px',
    fontWeight: 'bold',
  };

  const h1Style = {
    fontSize: '26px',
    color: '#1976d2',
  };

  const confirmPaymentDivStyle = {
    textAlign: 'center',
    marginTop: '40px',
  };

  const confirmPaymentButtonStyle = {
    padding: '12px 24px',
    fontSize: '18px',
    background: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  };


  const copyText = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      window.alert("Đã sao chép: " + text); 
    }).catch(err => {
      console.error('Không thể sao chép văn bản: ', err);
      window.alert('Không thể sao chép văn bản. Vui lòng sao chép thủ công.');
    });
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCountdownSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); 

  const handleConfirmPayment = () => {
    const user = sessionStorage.getItem('registeredUser');
    if (user) {
      window.alert("✅ Thanh toán thành công cho tài khoản: " + user);
      sessionStorage.removeItem('registeredUser'); 
      navigate('/login'); 
    } else {
      window.alert("Không tìm thấy thông tin đăng ký. Vui lòng đăng ký lại.");
      navigate('/register'); 
    }
  };

  return (
    <div style={bodyStyle}>
      <div style={containerStyle}>
        <div style={leftRightBaseStyle}>
          <h1 style={h1Style}>OKPay</h1>
          <p style={{textAlign: 'center', color: '#1976d2'}}>Pay With Ease, Like Saying Ok</p>
          <img src="/images1/qr.jpg" alt="QR Code thanh toán" style={leftImgStyle} />
          <div style={amountStyle}>699.000 VND</div>

          <div style={notesStyle}>
            <h3>Xin lưu ý :</h3>
            <ol>
              <li>Kiểm tra chính xác tài khoản và họ tên người nhận tiền.</li>
              <li>
                Nhập nội dung{' '}
                <strong id="transferNote">{transferNote}</strong>.
              </li>
              <li>
                <strong style={notesStrongStyle}>Chuyển chính xác số tiền</strong>, chỉ hỗ trợ các khoản nạp trên{' '}
                <strong style={notesStrongStyle}>50.000 VND</strong>.
              </li>
              <li>Không lưu thông tin tài khoản ngân hàng để tránh rủi ro.</li>
            </ol>
          </div>
        </div>

        <div style={leftRightBaseStyle}>
          <div style={infoItemStyle}>
            <div style={infoLabelStyle}>Thời gian nhận tiền còn lại :</div>
            <div style={countdownStyle} id="countdown">
              {formatTime(countdownSeconds)}
            </div>
          </div>

          <div style={infoItemStyle}>
            <div style={infoLabelStyle}>Tên ngân hàng:</div>
            <div style={{ ...infoValueStyle, color: '#2196f3' }}>
              Ngân hàng thương mại cổ phần Sài Gòn Thương Tín
            </div>
          </div>

          <div style={infoItemStyle}>
            <div style={infoLabelStyle}>Số tài khoản ngân hàng:</div>
            <div style={infoValueStyle}>
              056610042005
              <span style={infoCopyStyle} onClick={() => copyText('056610042005')}>Copy</span>
            </div>
          </div>

          <div style={infoItemStyle}>
            <div style={infoLabelStyle}>Người nhận tiền:</div>
            <div style={{ ...infoValueStyle, textTransform: 'uppercase' }}>HOANG DANG VAN KY</div>
          </div>

          <div style={infoItemStyle}>
            <div style={infoLabelStyle}>Số tiền đơn hàng:</div>
            <div style={infoValueStyle}>699.000 VND</div>
          </div>

          <div style={infoItemStyle}>
            <div style={infoLabelStyle}>Nội dung chuyển khoản:</div>
            <div style={infoValueStyle}>
              Chuyển tiền cai nghiện
              <span style={infoCopyStyle} onClick={() => copyText('Chuyển tiền cai nghiện')}>Copy</span>
            </div>
          </div>

          <div style={confirmPaymentDivStyle}>
            <button style={confirmPaymentButtonStyle} onClick={handleConfirmPayment}>
              Tôi đã thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;