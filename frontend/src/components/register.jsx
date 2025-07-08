import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/userApi';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [subscription, setSubscription] = useState('paid');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    console.log('Register component initialized');

    const bodyStyle = {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        margin: 0,
    };

    const registerContainerStyle = {
        background: 'white',
        padding: '30px 40px',
        borderRadius: '10px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        width: '350px',
    };

    const h2Style = {
        textAlign: 'center',
        marginBottom: '25px',
        color: '#333',
    };

    const labelStyle = {
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '8px',
        marginTop: '15px',
        color: '#555',
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        fontSize: '16px',
        boxSizing: 'border-box',
    };

    const selectStyle = {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        fontSize: '16px',
        boxSizing: 'border-box',
        marginTop: '15px',
    };

    const buttonStyle = {
        width: '100%',
        backgroundColor: '#f26522',
        border: 'none',
        color: 'white',
        padding: '12px 0',
        marginTop: '25px',
        fontSize: '18px',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        opacity: isLoading ? 0.7 : 1,
        pointerEvents: isLoading ? 'none' : 'auto',
    };

    const linkLoginStyle = {
        textAlign: 'center',
        marginTop: '15px',
    };

    const linkLoginAnchorStyle = {
        color: '#f26522',
        textDecoration: 'none',
        fontWeight: 'bold',
    };

    const errorMsgStyle = {
        marginTop: '12px',
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'red',
        display: errorMessage ? 'block' : 'none',
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        try {
            // Validate đầu vào
            if (!username.trim()) {
                throw new Error('Tên đăng nhập không được bỏ trống!');
            }
            if (!email.trim()) {
                throw new Error('Email không được bỏ trống!');
            }
            if (!password.trim()) {
                throw new Error('Mật khẩu không được bỏ trống!');
            }
            if (password !== confirmPassword) {
                throw new Error('Mật khẩu xác nhận không khớp!');
            }
            if (password.length !== 6) {
                throw new Error('Mật khẩu phải đúng 6 ký tự.');
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Email không hợp lệ!');
            }

            const userData = {
                username: username.trim(),
                email: email.trim(),
                password: password.trim(),
                subscription: 'paid',
            };

            console.log('Đang gửi dữ liệu đăng ký:', { ...userData, password: '***' });
            
            const response = await register(userData);
            console.log('Phản hồi từ server:', response);
            
            if (!response) {
                throw new Error('Không nhận được phản hồi từ server');
            }

            if (!response.success) {
                throw new Error(response.message || 'Đăng ký không thành công');
            }

            const userId = response.userId;
            if (!userId) {
                throw new Error('Không nhận được ID người dùng từ máy chủ');
            }

            // Lưu thông tin cho trang thanh toán
            localStorage.setItem('pendingUserId', userId.toString());
            localStorage.setItem('pendingUserEmail', email);
            localStorage.setItem('pendingUserPassword', password);
            localStorage.setItem('pendingUsername', username);
            
            console.log('Đã lưu thông tin, chuyển hướng đến trang thanh toán...');
            
            navigate('/payment');

        } catch (error) {
            console.error('Lỗi đăng ký:', error);
            
            // Xử lý các loại lỗi cụ thể
            const errorMessage = error?.message || '';
            
            if (typeof errorMessage === 'string' && errorMessage.includes('Network Error')) {
                setErrorMessage('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.');
            } else if (typeof errorMessage === 'string' && (errorMessage.includes('already exists') || errorMessage.includes('đã tồn tại'))) {
                setErrorMessage(errorMessage);
            } else if (error?.response?.data) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage(errorMessage || 'Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.');
            }
            
            // Xóa dữ liệu đã lưu nếu có lỗi
            localStorage.removeItem('pendingUserId');
            localStorage.removeItem('pendingUserEmail');
            localStorage.removeItem('pendingUserPassword');
            localStorage.removeItem('pendingUsername');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={bodyStyle}>
            <div style={registerContainerStyle}>
                <h2 style={h2Style}>Đăng ký tài khoản</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username" style={labelStyle}>Tên đăng nhập</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Nhập tên đăng nhập"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={inputStyle}
                        disabled={isLoading}
                    />

                    <label htmlFor="email" style={labelStyle}>Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Nhập địa chỉ email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                        disabled={isLoading}
                    />

                    <label htmlFor="password" style={labelStyle}>Mật khẩu</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Nhập mật khẩu"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                        disabled={isLoading}
                    />

                    <label htmlFor="confirmPassword" style={labelStyle}>Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Nhập lại mật khẩu"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={inputStyle}
                        disabled={isLoading}
                    />

                    <label htmlFor="subscription" style={labelStyle}>Gói đăng ký</label>
                    <select
                        id="subscription"
                        required
                        value={subscription}
                        onChange={(e) => setSubscription(e.target.value)}
                        style={selectStyle}
                        disabled={isLoading}
                    >
                        <option value="paid">Gói mất phí</option>
                    </select>

                    <button type="submit" style={buttonStyle} disabled={isLoading}>
                        {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>

                    {errorMessage && <div style={errorMsgStyle}>{errorMessage}</div>}

                    <div style={linkLoginStyle}>
                        Đã có tài khoản? <Link to="/login" style={linkLoginAnchorStyle}>Đăng nhập</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;