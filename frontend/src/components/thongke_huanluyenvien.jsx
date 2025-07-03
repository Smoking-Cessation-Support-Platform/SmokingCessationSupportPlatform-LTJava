import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getRecentQuestions } from '../api/consultApi';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const ThongKeHuanLuyenVien = () => {
    const navigate = useNavigate();

    // State để lưu trữ dữ liệu thống kê và bảng
    const [pendingCount, setPendingCount] = useState(0);
    const [processedCount, setProcessedCount] = useState(0);
    const [recentQuestions, setRecentQuestions] = useState([]);
    const [pendingTrend, setPendingTrend] = useState('');
    const [processedTrend, setProcessedTrend] = useState('');

    // Hàm kiểm tra đăng nhập
    const checkAuth = useCallback(() => {
        try {
            const coachData = JSON.parse(localStorage.getItem('coachData'));
            if (!coachData || !coachData.isLoggedIn) {
                navigate('/login-coach');
            }
        } catch (e) {
            console.error("Failed to parse coachData from localStorage", e);
            navigate('/login-coach');
        }
    }, [navigate]);

    // Hàm đăng xuất
    const handleLogout = () => {
        if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            localStorage.removeItem('coachData');
            navigate('/home');
        }
    };

    // Hàm cập nhật số liệu thống kê và bảng
    const updateStats = useCallback(async () => {
        try {
            // Lấy số lượng câu hỏi chờ xử lý
            const pendingResponse = await axios.get(`${API_URL}/consult/questions/unanswered`);
            const currentPending = pendingResponse.data;

            // Lấy số lượng câu hỏi đã xử lý
            const answeredResponse = await axios.get(`${API_URL}/consult/questions/answered`);
            const currentAnswered = answeredResponse.data;

            // Lấy giá trị cũ để so sánh xu hướng
            const oldPendingCount = pendingCount;
            const oldProcessedCount = processedCount;

            setPendingCount(currentPending.length);
            setProcessedCount(currentAnswered.length);

            // Cập nhật xu hướng cho câu hỏi chờ xử lý
            if (currentPending.length > oldPendingCount) {
                setPendingTrend(`Tăng ${currentPending.length - oldPendingCount}`);
            } else if (currentPending.length < oldPendingCount) {
                setPendingTrend(`Giảm ${oldPendingCount - currentPending.length}`);
            } else {
                setPendingTrend('');
            }

            // Cập nhật xu hướng cho câu hỏi đã xử lý
            if (currentAnswered.length > oldProcessedCount) {
                setProcessedTrend(`Tăng ${currentAnswered.length - oldProcessedCount}`);
            } else if (currentAnswered.length < oldProcessedCount) {
                setProcessedTrend(`Giảm ${oldProcessedCount - currentAnswered.length}`);
            } else {
                setProcessedTrend('');
            }

            // Lấy câu hỏi gần đây sử dụng API mới
            const recentQuestionsData = await getRecentQuestions(5);
            setRecentQuestions(recentQuestionsData);

        } catch (error) {
            console.error('Lỗi khi cập nhật số liệu:', error);
        }
    }, [pendingCount, processedCount]);

    useEffect(() => {
        checkAuth();
        updateStats();

        // Cập nhật định kỳ mỗi 5 giây
        const intervalId = setInterval(updateStats, 5000);

        return () => clearInterval(intervalId);
    }, [checkAuth, updateStats]);

    return (
        <>
            {/* CSS nhúng - Tốt nhất nên chuyển ra file .css riêng */}
            <style>{`
                * { box-sizing: border-box; }
                html, body {
                    height: 100%;
                    margin: 0;
                    font-family: 'Roboto', sans-serif;
                    background: #fff;
                    color: #333;
                    line-height: 1.6;
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                }

                header {
                    background: #004d40;
                    color: white;
                    padding: 12px 20px;
                    flex-shrink: 0;
                }

                .topbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                }

                .topbar-left {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .topbar-left img {
                    height: 45px;
                }

                nav {
                    background: #b71c1c;
                    display: flex;
                    justify-content: center;
                    padding: 12px 0;
                    flex-wrap: wrap;
                }

                nav a {
                    color: #fff;
                    margin: 0 10px;
                    padding: 6px 12px;
                    font-weight: bold;
                    transition: background 0.3s;
                    text-decoration: none;
                }

                nav a:hover {
                    background: rgba(255,255,255,0.2);
                    border-radius: 4px;
                }

                .section {
                    padding: 40px 0;
                    margin: auto;
                    flex-grow: 1;
                    width: calc(100% - 6cm);
                    margin-left: 3cm;
                    margin-right: 3cm;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .stat-card {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    text-align: center;
                    border: 1px solid #ddd;
                }

                .stat-card h3 {
                    color: #004d40;
                    font-size: 16px;
                    margin-bottom: 10px;
                }

                .stat-card .number {
                    font-size: 32px;
                    font-weight: bold;
                    color: #b71c1c;
                }

                .stat-card .trend {
                    font-size: 14px;
                    color: #4caf50; /* Green for up */
                    margin-top: 5px;
                }

                .trend.up::before {
                    content: "↑ ";
                }

                .trend.down {
                    color: #d32f2f; /* Red for down */
                }

                .trend.down::before {
                    content: "↓ ";
                }

                .table-container {
                    max-height: 400px;
                    overflow-y: auto;
                    margin-bottom: 20px;
                    border: 1px solid #ddd;
                    width: 100%;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 0;
                    table-layout: fixed;
                }

                th, td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }

                th {
                    background: #b71c1c;
                    color: white;
                    position: sticky;
                    top: 0;
                    z-index: 1;
                }

                tr:hover {
                    background-color: #f9f9f9;
                }

                .back-btn {
                    display: inline-block;
                    padding: 8px 16px;
                    background-color: #004d40;
                    color: white;
                    text-decoration: none;
                    border-radius: 4px;
                    margin-bottom: 20px;
                }

                .back-btn:hover {
                    background-color: #00695c;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: white;
                }

                .logout-btn {
                    background: none;
                    border: 1px solid white;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                }

                .logout-btn:hover {
                    background: rgba(255,255,255,0.1);
                }

                footer {
                    background: #004d40;
                    color: #fff;
                    padding: 20px;
                    text-align: center;
                    flex-shrink: 0;
                }

                @media (max-width: 768px) {
                    .section {
                        width: calc(100% - 40px);
                        margin-left: 20px;
                        margin-right: 20px;
                    }
                }
            `}</style>

            <header>
                <div className="topbar">
                    <div className="topbar-left">
                        {/* Nhớ rằng logo.jpg phải nằm trong thư mục public/images1 nếu bạn muốn dùng đường dẫn này */}
                        <img src="/images1/logo.jpg" alt="Logo CaiThuocTot.vn" />
                        <div><strong>CaiThuocTot.vn</strong> - Hành trình vì sức khỏe</div>
                    </div>
                    <div className="user-info">
                        <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
                    </div>
                </div>
            </header>

            <nav>
                <Link to="/">Trang chủ</Link>
                <Link to="/gioithieu">Về chúng tôi</Link>
                <Link to="/huongdancaithuoc">Hướng dẫn cai thuốc</Link>
                <Link to="/tuvan">Dịch vụ</Link>
                <Link to="/huanluyenvien_home">Dành cho huấn luyện viên</Link>
                <Link to="/blog">Câu chuyện thành công</Link>
                <Link to="/lienhe">Liên hệ</Link>
            </nav>

            <div className="section">
                <Link to="/huanluyenvien_home" className="back-btn">← Quay lại</Link>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Câu hỏi chờ xử lý</h3>
                        <div className="number">{pendingCount}</div>
                        <div className={`trend ${pendingTrend.includes('Tăng') ? 'up' : pendingTrend.includes('Giảm') ? 'down' : ''}`}>
                            {pendingTrend}
                        </div>
                    </div>
                    <div className="stat-card">
                        <h3>Câu hỏi đã xử lý</h3>
                        <div className="number">{processedCount}</div>
                        <div className={`trend ${processedTrend.includes('Tăng') ? 'up' : processedTrend.includes('Giảm') ? 'down' : ''}`}>
                            {processedTrend}
                        </div>
                    </div>
                </div>

                <div className="table-container">
                    <h2 className="chart-title" style={{ margin: '0 0 20px 0' }}>Câu hỏi gần đây</h2>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '40%' }}>Câu hỏi</th>
                                <th style={{ width: '15%' }}>Người hỏi</th>
                                <th style={{ width: '15%' }}>Email</th>
                                <th style={{ width: '15%' }}>Ngày hỏi</th>
                                <th style={{ width: '15%' }}>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentQuestions.length > 0 ? (
                                recentQuestions.map((q) => (
                                    <tr key={q.id}>
                                        <td>{q.content}</td>
                                        <td>{q.name}</td>
                                        <td>{q.email}</td>
                                        <td>{new Date(q.timestamp).toLocaleDateString('vi-VN')}</td>
                                        <td style={{ color: q.status === 'pending' ? '#b71c1c' : '#004d40' }}>
                                            {q.status === 'pending' ? 'Chờ xử lý' : 'Đã xử lý'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                        Không có câu hỏi nào gần đây.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <footer>
                <p>© 2025 CaiThuocTot.vn - Bản quyền thuộc về nhóm phát triển</p>
                <p>Địa chỉ: 70 Đ. Tô Ký, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh | Email: nhubdq3680@ut.edu.vn | Hotline: 0364155024</p>
            </footer>
        </>
    );
};

export default ThongKeHuanLuyenVien;