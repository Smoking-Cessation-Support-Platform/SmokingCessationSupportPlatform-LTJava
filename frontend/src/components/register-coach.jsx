import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { coachRegister } from '../api/coachApi';

const RegisterCoach = () => {
    const navigate = useNavigate();

    // State cho các trường của form đăng ký
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [formError, setFormError] = useState(''); // Để hiển thị lỗi của form đăng ký

    // Hàm xử lý submit form đăng ký
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setFormError(''); // Reset lỗi của form đăng ký

        // Validate form inputs
        if (password !== confirmPassword) {
            setFormError('Mật khẩu xác nhận không khớp!');
            return;
        }
        if (!/(?=.*[0-9])(?=.*[a-zA-Z]).{6,}/.test(password)) {
            setFormError("Mật khẩu phải ít nhất 6 ký tự, bao gồm cả chữ và số.");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setFormError("Email không hợp lệ!");
            return;
        }
        const phoneRegex = /^(0|\+84)(\d{9,10})$/;
        if (!phoneRegex.test(phone)) {
            setFormError("Số điện thoại không hợp lệ!");
            return;
        }

        try {
            // Tạo đối tượng dữ liệu đăng ký
            const registrationData = {
                fullName: fullname.trim(),
                username: username.trim(),
                password: password.trim(),
                email: email.trim(),
                phone: phone.trim()
            };

            // Sử dụng coachRegister API
            const response = await coachRegister(registrationData);
            
            if (response && response.id) {
                // Lưu ID huấn luyện viên vào localStorage để trang thanh toán có thể truy cập
                localStorage.setItem('pendingCoachId', response.id);
                // Chuyển hướng đến trang thanh toán
                navigate('/payment-coach');
            } else {
                setFormError('Không nhận được phản hồi hợp lệ từ máy chủ');
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            if (typeof error === 'string') {
                setFormError(error);
            } else if (error.response && error.response.data) {
                setFormError(error.response.data);
            } else {
                setFormError('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.');
            }
        }
    };

    return (
        <>
            {/* CSS nhúng */}
            <style>{`
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .register-container {
                    background: white;
                    padding: 30px 40px;
                    border-radius: 10px;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
                    width: 380px;
                }
                h2 {
                    text-align: center;
                    margin-bottom: 25px;
                    color: #333;
                }
                label {
                    font-weight: bold;
                    display: block;
                    margin-bottom: 8px;
                    margin-top: 15px;
                    color: #555;
                }
                input[type="text"],
                input[type="password"],
                input[type="email"],
                input[type="tel"] {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    font-size: 16px;
                    box-sizing: border-box;
                }
                button {
                    width: 100%;
                    background-color: #004d40;
                    border: none;
                    color: white;
                    padding: 12px 0;
                    margin-top: 25px;
                    font-size: 18px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                button:hover {
                    background-color: #00332b;
                }
                .link-login {
                    text-align: center;
                    margin-top: 15px;
                }
                .link-login a {
                    color: #004d40;
                    text-decoration: none;
                    font-weight: bold;
                }
                .link-login a:hover {
                    text-decoration: underline;
                }
                .error-message { /* Style cho thông báo lỗi */
                    color: red;
                    text-align: center;
                    margin-top: 10px;
                    font-weight: bold;
                }
            `}</style>

            <div className="register-container">
                <h2>Đăng ký huấn luyện viên</h2>
                <form onSubmit={handleRegisterSubmit}>
                    <label htmlFor="fullname">Họ và tên</label>
                    <input
                        type="text"
                        id="fullname"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        required
                    />

                    <label htmlFor="username">Tên đăng nhập</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <label htmlFor="password">Mật khẩu</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="phone">Số điện thoại</label>
                    <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />

                    <button type="submit">Đăng ký</button>
                    {formError && <div className="error-message">{formError}</div>}
                </form>
                <div className="link-login">
                    <Link to="/login-coach">Đã có tài khoản? Đăng nhập</Link>
                </div>
            </div>
            {/* Modal thanh toán đã bị loại bỏ khỏi RegisterCoach.jsx */}
        </>
    );
};

export default RegisterCoach;