import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentCoach = () => {
    const navigate = useNavigate();
    const [registrationData, setRegistrationData] = useState(null);
    const [countdown, setCountdown] = useState(15 * 60); // 15 phút
    const [error, setError] = useState('');

    useEffect(() => {
        const coachId = localStorage.getItem('pendingCoachId');
        if (!coachId) {
            navigate('/register-coach');
            return;
        }

        const fetchCoachData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/coaches/${coachId}`);
                setRegistrationData(response.data);
            } catch (error) {
                console.error('Error fetching coach data:', error);
                navigate('/register-coach');
            }
        };

        fetchCoachData();

        // Bắt đầu đếm ngược
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    alert('Hết thời gian thanh toán! Vui lòng thực hiện lại.');
                    navigate('/register-coach');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}:00`;
    };

    const copyText = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert("Đã sao chép: " + text);
        }).catch(err => {
            console.error('Không thể sao chép văn bản: ', err);
            alert('Không thể sao chép văn bản. Vui lòng sao chép thủ công.');
        });
    };

    const confirmPayment = async () => {
        if (!registrationData) {
            setError("Không tìm thấy thông tin đăng ký. Vui lòng đăng ký lại.");
            navigate('/register-coach');
            return;
        }

        try {
            // First create the payment
            const paymentResponse = await axios.post(
                `http://localhost:8080/api/payments/coach/${registrationData.id}`,
                {
                    paymentMethod: 'banking'
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );

            if (paymentResponse.status === 200 && paymentResponse.data) {
                // Then confirm the payment using the order code
                const confirmResponse = await axios.post(
                    `http://localhost:8080/api/payments/confirm/${paymentResponse.data.orderCode}`,
                    {},
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    }
                );

                if (confirmResponse.status === 200) {
                    localStorage.removeItem('pendingCoachId');
                    alert('Thanh toán thành công! Vui lòng đăng nhập để bắt đầu.');
                    navigate('/login-coach');
                }
            }
        } catch (error) {
            console.error('Error confirming payment:', error);
            setError(error.response?.data || 'Có lỗi xảy ra khi xác nhận thanh toán. Vui lòng thử lại.');
        }
    };

    if (!registrationData) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải...</div>;
    }

    return (
        <div className="container">
            <style>{`
                * { box-sizing: border-box; }
                body {
                    font-family: Arial, sans-serif;
                    background: #f5f5f5;
                    margin: 0;
                    padding: 20px;
                    color: #333;
                }
                .container {
                    max-width: 1000px;
                    margin: auto;
                    background: white;
                    border-radius: 12px;
                    padding: 30px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 30px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                .left, .right {
                    flex: 1;
                    min-width: 300px;
                }
                .left img {
                    width: 100%;
                    max-width: 300px;
                    display: block;
                    margin: auto;
                }
                .amount {
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                    color: #f2a900;
                    margin-top: 10px;
                }
                .notes {
                    margin-top: 30px;
                    font-size: 14px;
                }
                .notes strong {
                    color: #d32f2f;
                }
                .info-item {
                    margin-bottom: 20px;
                }
                .info-label {
                    font-weight: bold;
                    margin-bottom: 5px;
                    color: #555;
                }
                .info-value {
                    font-size: 20px;
                    color: #f2a900;
                    word-break: break-word;
                }
                .info-copy {
                    display: inline-block;
                    background: #03a9f4;
                    color: white;
                    padding: 4px 12px;
                    border-radius: 4px;
                    margin-left: 10px;
                    font-size: 14px;
                    cursor: pointer;
                }
                .countdown {
                    color: #f57c00;
                    font-size: 20px;
                    font-weight: bold;
                }
                h1 {
                    font-size: 26px;
                    color: #1976d2;
                }
                .confirm-payment {
                    text-align: center;
                    margin-top: 40px;
                }
                .confirm-payment button {
                    padding: 12px 24px;
                    font-size: 18px;
                    background: #4caf50;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                }
                .confirm-payment button:hover {
                    background: #388e3c;
                }
                .error-message {
                    color: #d32f2f;
                    text-align: center;
                    margin-top: 10px;
                }
            `}</style>

            <div className="left">
                <h1>OKPay</h1>
                <p style={{ textAlign: 'center', color: '#1976d2' }}>Pay With Ease, Like Saying Ok</p>
                <img src="/images1/qr.jpg" alt="QR Code thanh toán" />
                <div className="amount">500.000 VND</div>

                <div className="notes">
                    <h3>Xin lưu ý :</h3>
                    <ol>
                        <li>Kiểm tra chính xác tài khoản và họ tên người nhận tiền.</li>
                        <li>Nhập nội dung chuyển khoản chính xác.</li>
                        <li><strong>Chuyển chính xác số tiền 500.000 VND</strong>.</li>
                        <li>Không lưu thông tin tài khoản ngân hàng để tránh rủi ro.</li>
                    </ol>
                </div>
            </div>

            <div className="right">
                <div className="info-item">
                    <div className="info-label">Thời gian còn lại:</div>
                    <div className="countdown">{formatTime(countdown)}</div>
                </div>

                <div className="info-item">
                    <div className="info-label">Tên ngân hàng:</div>
                    <div className="info-value" style={{ color: '#2196f3' }}>
                        Ngân hàng thương mại cổ phần Sài Gòn Thương Tín
                    </div>
                </div>

                <div className="info-item">
                    <div className="info-label">Số tài khoản:</div>
                    <div className="info-value">
                        056610042005
                        <span className="info-copy" onClick={() => copyText('056610042005')}>Copy</span>
                    </div>
                </div>

                <div className="info-item">
                    <div className="info-label">Chủ tài khoản:</div>
                    <div className="info-value" style={{ textTransform: 'uppercase' }}>
                        HOANG DANG VAN KY
                    </div>
                </div>

                <div className="info-item">
                    <div className="info-label">Số tiền:</div>
                    <div className="info-value">500.000 VND</div>
                </div>

                <div className="info-item">
                    <div className="info-label">Nội dung chuyển khoản:</div>
                    <div className="info-value">
                        HLV_{registrationData.username}
                        <span className="info-copy" onClick={() => copyText(`HLV_${registrationData.username}`)}>Copy</span>
                    </div>
                </div>

                <div className="confirm-payment">
                    <button onClick={confirmPayment}>Tôi đã thanh toán</button>
                </div>

                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
};

export default PaymentCoach;