import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [countdown, setCountdown] = useState(15 * 60); // 15 phút
    const [error, setError] = useState('');

    useEffect(() => {
        const userId = localStorage.getItem('pendingUserId');
        const email = localStorage.getItem('pendingUserEmail');
        
        console.log('Payment page loaded with userId:', userId, 'email:', email);
        
        if (!userId || !email) {
            console.error('Missing pending user data. Redirecting to register page.');
            alert('Thông tin đăng ký không đầy đủ. Vui lòng đăng ký lại.');
            navigate('/register');
            return;
        }

        const fetchUserData = async () => {
            try {
                console.log('Fetching user data for ID:', userId);
                const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                console.log('User data received:', response.data);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                if (error.response) {
                    console.error('Error response:', error.response.data);
                    console.error('Status:', error.response.status);
                }
                alert('Không thể tải thông tin người dùng. Vui lòng thử lại.');
                navigate('/register');
            }
        };

        fetchUserData();

        // Bắt đầu đếm ngược
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    alert('Hết thời gian thanh toán! Vui lòng thực hiện lại.');
                    navigate('/register');
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
        if (!userData || !userData.id) {
            const errorMsg = !userData ? 'Không tìm thấy thông tin đăng ký' : 'Thiếu ID người dùng';
            console.error('Payment error:', errorMsg, userData);
            setError(`${errorMsg}. Vui lòng đăng ký lại.`);
            navigate('/register');
            return;
        }

        try {
            console.log('Creating payment for user ID:', userData.id);
            const paymentResponse = await axios.post(
                `http://localhost:8080/api/payments/user/${userData.id}`,
                {
                    paymentMethod: 'banking',
                    amount: 699000, // 699,000 VND
                    currency: 'VND',
                    description: 'Thanh toán gói thành viên'
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    timeout: 10000 // 10 seconds timeout
                }
            );

            console.log('Payment creation response:', paymentResponse.data);

            if (paymentResponse.status === 200 && paymentResponse.data && paymentResponse.data.orderCode) {
                console.log('Confirming payment with order code:', paymentResponse.data.orderCode);
                
                // Then confirm the payment using the order code
                const confirmResponse = await axios.post(
                    `http://localhost:8080/api/payments/confirm/${paymentResponse.data.orderCode}`,
                    {},
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        timeout: 10000 // 10 seconds timeout
                    }
                );

                console.log('Payment confirmation response:', confirmResponse.data);

                if (confirmResponse.status === 200) {
                    // Get saved credentials
                    const email = localStorage.getItem('pendingUserEmail');
                    const password = localStorage.getItem('pendingUserPassword');
                    
                    if (!email || !password) {
                        throw new Error('Thiếu thông tin đăng nhập. Vui lòng đăng nhập thủ công.');
                    }
                    
                    console.log('Attempting auto-login for:', email);
                    
                    // Auto login after successful payment
                    try {
                        const loginResponse = await axios.post(
                            'http://localhost:8080/api/users/login',
                            { email, password },
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json'
                                },
                                timeout: 10000 // 10 seconds timeout
                            }
                        );
                        
                        console.log('Login response:', loginResponse.data);
                        
                        if (loginResponse.data && loginResponse.data.token) {
                            // Clean up only after successful login
                            localStorage.removeItem('pendingUserId');
                            localStorage.removeItem('pendingUserEmail');
                            localStorage.removeItem('pendingUserPassword');
                            
                            // Save login info
                            localStorage.setItem('token', loginResponse.data.token);
                            localStorage.setItem('userId', loginResponse.data.id || userData.id);
                            localStorage.setItem('isMember', 'true');
                            
                            console.log('Login successful, redirecting to home page');
                            alert('Thanh toán và đăng nhập thành công!');
                            navigate('/');
                        } else {
                            throw new Error('Thông tin đăng nhập không hợp lệ');
                        }
                    } catch (loginError) {
                        console.error('Auto login error:', loginError);
                        // Don't clear pending data here to allow manual login
                        alert('Thanh toán thành công! Vui lòng đăng nhập bằng tài khoản của bạn.');
                        navigate('/login');
                    }
                } else {
                    setError('Xác nhận thanh toán thất bại. Vui lòng thử lại.');
                }
            } else {
                setError('Tạo đơn thanh toán thất bại. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Payment error:', error);
            if (error.response) {
                setError(error.response.data || 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.');
            } else if (error.request) {
                setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
            } else {
                setError('Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.');
            }
        }
    };

    if (!userData) {
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
                .benefits {
                    background: #e8f5e9;
                    padding: 15px;
                    border-radius: 8px;
                    margin-top: 20px;
                }
                .benefits h3 {
                    color: #2e7d32;
                    margin-bottom: 10px;
                }
                .benefits ul {
                    list-style-type: none;
                    padding: 0;
                    margin: 0;
                }
                .benefits li {
                    margin: 8px 0;
                    color: #1b5e20;
                    padding-left: 20px;
                    position: relative;
                }
                .benefits li:before {
                    content: "✓";
                    position: absolute;
                    left: 0;
                    color: #4caf50;
                }
            `}</style>

            <div className="left">
                <h1>OKPay</h1>
                <p style={{ textAlign: 'center', color: '#1976d2' }}>Pay With Ease, Like Saying Ok</p>
                <img src="/images1/qr.jpg" alt="QR Code thanh toán" />
                <div className="amount">699.000 VND</div>

                <div className="notes">
                    <h3>Xin lưu ý :</h3>
                    <ol>
                        <li>Kiểm tra chính xác tài khoản và họ tên người nhận tiền.</li>
                        <li>Nhập nội dung chuyển khoản chính xác.</li>
                        <li><strong>Chuyển chính xác số tiền 699.000 VND</strong>.</li>
                        <li>Không lưu thông tin tài khoản ngân hàng để tránh rủi ro.</li>
                    </ol>
                </div>

                <div className="benefits">
                    <h3>Quyền lợi của bạn:</h3>
                    <ul>
                        <li>Được tư vấn 1-1 với huấn luyện viên</li>
                        <li>Truy cập đầy đủ tính năng ứng dụng</li>
                        <li>Theo dõi tiến trình cai thuốc</li>
                        <li>Nhận thông báo và lời khuyên</li>
                        <li>Tham gia cộng đồng hỗ trợ</li>
                        <li>Bảo hành hoàn tiền trong 30 ngày</li>
                    </ul>
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
                    <div className="info-value">699.000 VND</div>
                </div>

                <div className="info-item">
                    <div className="info-label">Nội dung chuyển khoản:</div>
                    <div className="info-value">
                        USER_{userData.username}
                        <span className="info-copy" onClick={() => copyText(`USER_${userData.username}`)}>Copy</span>
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

export default Payment;