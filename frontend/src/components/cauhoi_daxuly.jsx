import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const CauHoiDaXuLy = () => {
    const navigate = useNavigate();
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [nameFilter, setNameFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    // --- Authentication and Logout ---
    useEffect(() => {
        const checkAuth = () => {
            try {
                const coachData = JSON.parse(localStorage.getItem('coachData'));
                if (!coachData || !coachData.isLoggedIn) {
                    navigate('/login-coach');
                }
            } catch (e) {
                console.error("Failed to parse coachData from localStorage", e);
                navigate('/login-coach');
            }
        };
        checkAuth();
    }, [navigate]);

    const logout = () => {
        if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            localStorage.removeItem('coachData');
            navigate('/');
        }
    };

    // --- Load Questions from API ---
    const loadQuestions = async () => {
        try {
            const response = await axios.get(`${API_URL}/consult/questions/answered`);
            setAnsweredQuestions(response.data);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
            alert('Có lỗi xảy ra khi tải danh sách câu hỏi');
        }
    };

    useEffect(() => {
        loadQuestions();
    }, []);

    // --- Filter Logic ---
    const filteredQuestions = answeredQuestions.filter(q => {
        const matchesName = nameFilter
            ? (q.name || '').toLowerCase().includes(nameFilter.toLowerCase())
            : true;

        const matchesDate = dateFilter
            ? new Date(q.timestamp).toISOString().split('T')[0] === dateFilter
            : true;

        return matchesName && matchesDate;
    });

    // --- Question Actions ---
    const deleteQuestion = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
            try {
                await axios.delete(`${API_URL}/consult/questions/${id}`);
                loadQuestions();
                alert('Đã xóa câu hỏi thành công');
            } catch (error) {
                console.error("Failed to delete question:", error);
                alert('Có lỗi xảy ra khi xóa câu hỏi');
            }
        }
    };

    return (
        <>
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

                .section h2 {
                    text-align: center;
                    margin-bottom: 10px;
                    color: #004d40;
                }

                .filters {
                    width: 100%;
                    margin: 0 0 20px 0;
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .filters label {
                    font-weight: 600;
                    color: #004d40;
                    display: flex;
                    flex-direction: column;
                    font-size: 14px;
                }

                .filters input {
                    padding: 6px 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 14px;
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

                .question-column { width: 40%; }
                .name-column { width: 15%; }
                .email-column { width: 15%; }
                .phone-column { width: 12%; }
                .date-column { width: 10%; }
                .action-column { width: 8%; min-width: 120px; }

                td.question-column {
                    white-space: normal;
                    word-wrap: break-word;
                    min-height: 50px;
                    vertical-align: top;
                    padding-top: 15px;
                    line-height: 1.5;
                }

                .delete-btn {
                    background-color: #d32f2f;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                }

                .delete-btn:hover {
                    background-color: #b71c1c;
                }

                .button-container {
                    display: flex;
                    gap: 5px;
                    justify-content: center;
                }

                footer {
                    background: #004d40;
                    color: #fff;
                    padding: 20px;
                    text-align: center;
                    flex-shrink: 0;
                }

                .back-btn {
                    background-color: #004d40;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                    margin-bottom: 20px;
                }

                .back-btn:hover {
                    background-color: #00695c;
                }

                .status-badge {
                    background-color: #4caf50;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    display: inline-block;
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
            `}</style>

            <header>
                <div className="topbar">
                    <div className="topbar-left">
                        <img src="/images1/logo.jpg" alt="Logo CaiThuocTot.vn" />
                        <div><strong>CaiThuocTot.vn</strong> - Hành trình vì sức khỏe</div>
                    </div>
                    <div className="user-info">
                        <button className="logout-btn" onClick={logout}>Đăng xuất</button>
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

            <section className="section">
                <Link to="/huanluyenvien_home" className="back-btn">← Quay lại</Link>
                <h2>Câu Hỏi Đã Xử Lý</h2>
                
                <div className="filters">
                    <label>
                        Lọc theo tên:
                        <input
                            type="text"
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                            placeholder="Nhập tên thành viên..."
                        />
                    </label>
                    <label>
                        Lọc theo ngày gửi:
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                    </label>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th className="question-column">Câu Hỏi</th>
                                <th className="name-column">Họ Tên</th>
                                <th className="email-column">Email</th>
                                <th className="phone-column">Số Điện Thoại</th>
                                <th className="date-column">Ngày Gửi</th>
                                <th className="action-column">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredQuestions.length > 0 ? (
                                filteredQuestions.map((q) => (
                                    <tr key={q.id}>
                                        <td className="question-column">
                                            <div className="question-content">{q.content}</div>
                                        </td>
                                        <td className="name-column">{q.name}</td>
                                        <td className="email-column">{q.email}</td>
                                        <td className="phone-column">{q.phone}</td>
                                        <td className="date-column">
                                            {new Date(q.timestamp).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="action-column">
                                            <div className="button-container">
                                                <span className="status-badge">Đã xử lý</span>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => deleteQuestion(q.id)}
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                        
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                        Không có câu hỏi nào đã xử lý
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <footer>
                <p>© 2025 CaiThuocTot.vn - Bản quyền thuộc về nhóm phát triển</p>
                <p>Địa chỉ: 70 Đ. Tô Ký, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh | Email: nhubdq3680@ut.edu.vn | Hotline: 0364155024</p>
            </footer>
        </>
    );
};

export default CauHoiDaXuLy;