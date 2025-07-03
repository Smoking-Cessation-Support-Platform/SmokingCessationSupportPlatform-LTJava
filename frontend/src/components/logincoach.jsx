import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link và useNavigate
import axios from 'axios';

const LoginCoach = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const encodeBase64 = (str) => {
        return btoa(str);
    };

    // Hàm lấy danh sách HLV từ localStorage
    const getCoaches = () => {
        try {
            const coaches = JSON.parse(localStorage.getItem('coaches')) || [];
            return coaches;
        } catch (e) {
            console.error("Failed to parse coaches from localStorage", e);
            return [];
        }
    };

    // Hàm xác thực đăng nhập
    const authenticate = (inputUsername, inputPassword) => {
        const coaches = getCoaches();
        return coaches.find(
            c => c.username.toLowerCase() === inputUsername.toLowerCase() && c.password === encodeBase64(inputPassword)
        ) || null;
    };

    // Hàm lưu dữ liệu HLV vào localStorage sau khi đăng nhập thành công
    const loginCoach = (coach) => {
        const coachData = {
            isLoggedIn: true,
            name: coach.name || coach.username,
            username: coach.username,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('coachData', JSON.stringify(coachData));
    };

    // Hàm xử lý sự kiện submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        if (!trimmedUsername || !trimmedPassword) {
            setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/coaches/login', {
                username: trimmedUsername,
                password: trimmedPassword
            });

            if (response.status === 200) {
                const coachData = response.data;
                // Lưu thông tin huấn luyện viên vào localStorage
                localStorage.setItem('coachData', JSON.stringify({
                    id: coachData.id,
                    username: coachData.username,
                    fullName: coachData.fullName,
                    email: coachData.email,
                    phone: coachData.phone,
                    isLoggedIn: true,
                    isCoach: true
                }));
                alert("Đăng nhập thành công!");
                navigate("/huanluyenvien_home");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Tên đăng nhập hoặc mật khẩu không đúng.');
            } else {
                setError('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.');
                console.error('Login error:', error);
            }
        }
    };

    return (
        <>
            {/* CSS nhúng (CSS-in-JS) */}
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
                .container {
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
                input[type="password"] {
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
                .error-msg {
                    margin-top: 12px;
                    font-weight: bold;
                    text-align: center;
                    color: red;
                    /* display được điều khiển bằng điều kiện render trong JSX */
                }
                .toggle-form {
                    text-align: center;
                    margin-top: 15px;
                }
                .toggle-form a { /* Dùng a cho style Link */
                    color: #004d40;
                    text-decoration: none;
                    font-weight: bold;
                }
                .toggle-form a:hover {
                    text-decoration: underline;
                }
            `}</style>

            <div className="container">
                <form onSubmit={handleSubmit}> {/* Sử dụng onSubmit */}
                    <h2>Đăng nhập huấn luyện viên</h2>

                    <label htmlFor="username">Tên đăng nhập</label>
                    <input
                        type="text"
                        id="username"
                        value={username} // Controlled component
                        onChange={(e) => setUsername(e.target.value)} // Cập nhật state khi input thay đổi
                        required
                    />

                    <label htmlFor="password">Mật khẩu</label>
                    <input
                        type="password"
                        id="password"
                        value={password} // Controlled component
                        onChange={(e) => setPassword(e.target.value)} // Cập nhật state khi input thay đổi
                        required
                    />

                    <button type="submit">Đăng nhập</button>
                    {/* Hiển thị thông báo lỗi nếu có */}
                    {error && <div className="error-msg">{error}</div>}
                </form>

                <div className="toggle-form">
                    {/* Sử dụng Link component để điều hướng trong React Router */}
                    <Link to="/register-coach">Chưa có tài khoản? Đăng ký ngay</Link>
                </div>
            </div>
        </>
    );
};

export default LoginCoach;