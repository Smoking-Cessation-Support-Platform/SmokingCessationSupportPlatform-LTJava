import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginAdmin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault(); // Ngăn chặn hành vi submit mặc định của form

        // Demo: tài khoản admin/admin123
        if (username.trim() === 'admin' && password === 'admin123') {
            localStorage.setItem('isAdminLoggedIn', '1');
            navigate('/admin'); // Chuyển hướng đến trang admin. Lưu ý: bạn cần một Route cho '/admin' trong App.jsx
        } else {
            setShowError(true); // Hiển thị thông báo lỗi
        }
    };

    return (
        <>
            {/* CSS nhúng - Bạn nên chuyển CSS này ra một file .css riêng (ví dụ: login-admin.css) */}
            {/* và import vào đây: import './login-admin.css'; */}
            <style>{`
                html, body {
                    height: 100%;
                }
                body {
                    background: linear-gradient(135deg, #f4f6f8 60%, #ffe0b2 100%);
                    min-height: 100vh;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .login-container {
                    background: #fff;
                    padding: 48px 36px 36px 36px;
                    border-radius: 16px;
                    box-shadow: 0 6px 32px rgba(0,0,0,0.10);
                    width: 100%;
                    max-width: 400px;
                    text-align: center;
                    margin: 40px auto;
                }
                .login-container img {
                    width: 70px;
                    margin-bottom: 22px;
                }
                h2 {
                    margin-bottom: 22px;
                    color: #ff9800;
                    font-size: 2rem;
                }
                .input-group {
                    margin-bottom: 22px;
                    text-align: left;
                }
                .input-group label {
                    display: block;
                    margin-bottom: 7px;
                    color: #333;
                    font-weight: 500;
                }
                .input-group input {
                    width: 100%;
                    padding: 12px 10px;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    font-size: 16px;
                    background: #fafafa;
                    transition: border 0.2s;
                }
                .input-group input:focus {
                    border: 1.5px solid #ff9800;
                    outline: none;
                    background: #fffbe7;
                }
                .login-btn {
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(90deg, #ff9800 60%, #ffa726 100%);
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-size: 17px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background 0.2s, box-shadow 0.2s;
                    box-shadow: 0 2px 8px rgba(255,152,0,0.08);
                }
                .login-btn:hover {
                    background: linear-gradient(90deg, #ffa726 60%, #ff9800 100%);
                    box-shadow: 0 4px 16px rgba(255,152,0,0.13);
                }
                .error-message {
                    color: #e53935;
                    margin-bottom: 14px;
                    font-weight: 500;
                    letter-spacing: 0.5px;
                }
            `}</style>

            <form className="login-container" onSubmit={handleLogin}>
                {/* Đảm bảo đường dẫn ảnh đúng. Nếu logo.jpg ở public/images1, thì đường dẫn này là đúng. */}
                <img src="/images1/logo.jpg" alt="logo" />
                <h2>Đăng nhập Admin</h2>
                {showError && ( // Chỉ hiển thị thông báo lỗi khi showError là true
                    <div className="error-message">Sai tài khoản hoặc mật khẩu!</div>
                )}
                <div className="input-group">
                    <label htmlFor="username">Tên đăng nhập</label>
                    <input
                        type="text"
                        id="username"
                        required
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Mật khẩu</label>
                    <input
                        type="password"
                        id="password"
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className="login-btn" type="submit">Đăng nhập</button>
            </form>
        </>
    );
};

export default LoginAdmin;