import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link ở đây

const CoachHome = () => {
    const navigate = useNavigate();

    // Hàm kiểm tra đăng nhập
    useEffect(() => {
        const checkAuth = () => {
            const coachData = JSON.parse(localStorage.getItem('coachData'));
            if (!coachData || !coachData.isLoggedIn) {
                // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập HLV
                navigate('/login-coach'); // Đảm bảo đường dẫn này khớp với route của bạn
            }
        };

        checkAuth();
    }, [navigate]); // navigate là dependency để useEffect biết khi nào cần chạy lại

    // Hàm đăng xuất
    const handleLogout = () => {
        if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            localStorage.removeItem('coachData');
            navigate('/'); // Đảm bảo đường dẫn này khớp với route Trang chủ của bạn
        }
    };

    return (
        <>
            <style>{`
                /* Global styles */
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

                nav a, nav .nav-link { /* Thêm .nav-link để áp dụng style cho Link */
                    color: #fff;
                    margin: 0 10px;
                    padding: 6px 12px;
                    font-weight: bold;
                    transition: background 0.3s;
                    text-decoration: none;
                }

                nav a:hover, nav .nav-link:hover { /* Thêm .nav-link:hover */
                    background: rgba(255,255,255,0.2);
                    border-radius: 4px;
                }

                .main-content {
                    flex-grow: 1;
                    padding: 40px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .dashboard {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }

                .dashboard-card {
                    background: #fff;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    text-align: center;
                    transition: transform 0.3s;
                    cursor: pointer;
                    border: 1px solid #ddd;
                }

                .dashboard-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }

                .dashboard-card h3 {
                    color: #004d40;
                    margin-bottom: 10px;
                }

                .dashboard-card p {
                    color: #666;
                    margin-bottom: 15px;
                }

                .card-button {
                    background: #b71c1c;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 4px;
                    text-decoration: none;
                    display: inline-block;
                }

                .card-button:hover {
                    background: #d32f2f;
                }

                footer {
                    background: #004d40;
                    color: #fff;
                    padding: 20px;
                    text-align: center;
                    flex-shrink: 0;
                }

                .welcome-section {
                    text-align: center;
                    margin-bottom: 40px;
                }

                .welcome-section h1 {
                    color: #004d40;
                    margin-bottom: 15px;
                }

                .welcome-section p {
                    color: #666;
                    max-width: 800px;
                    margin: 0 auto;
                }

                .auth-links a {
                    color: white;
                    text-decoration: none;
                    margin: 0 5px;
                }

                .auth-links a:hover {
                    text-decoration: underline;
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
                        {/* Đường dẫn tới ảnh trong thư mục public.
                            Đảm bảo file logo.jpg nằm trong public/images1/ */}
                        <img src="/images1/logo.jpg" alt="Logo CaiThuocTot.vn" />
                        <div><strong>CaiThuocTot.vn</strong> - Hành trình vì sức khỏe</div>
                    </div>
                    <div className="user-info">
                        <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
                    </div>
                </div>
            </header>

            <nav>
                {/* Sử dụng Link component cho tất cả các điều hướng nội bộ */}
                <Link to="/" className="nav-link">Trang chủ</Link>
                <Link to="/gioithieu" className="nav-link">Về chúng tôi</Link>
                <Link to="/huongdancaithuoc" className="nav-link">Hướng dẫn cai thuốc</Link>
                <Link to="/tuvan" className="nav-link">Dịch vụ</Link>
                <Link to="/huanluyenvien_home" className="nav-link">Dành cho huấn luyện viên</Link>
                <Link to="/blog" className="nav-link">Câu chuyện thành công</Link>
                <Link to="/lienhe" className="nav-link">Liên hệ</Link>
            </nav>

            <div className="main-content">
                <div className="welcome-section">
                    <h1>Chào mừng Huấn Luyện Viên</h1>
                    <p>Đây là trung tâm quản lý của bạn. Từ đây, bạn có thể theo dõi và phản hồi các câu hỏi từ người dùng,
                       cũng như quản lý các tư vấn đã hoàn thành.</p>
                </div>

                <div className="dashboard">
                    <div className="dashboard-card">
                        <h3>Câu Hỏi Chờ Xử Lý</h3>
                        <p>Xem và trả lời các câu hỏi mới từ người dùng</p>
                        <Link to="/cauhoi_dadat" className="card-button">Xem Câu Hỏi</Link>
                    </div>

                    <div className="dashboard-card">
                        <h3>Câu Hỏi Đã Xử Lý</h3>
                        <p>Xem lại lịch sử các câu hỏi đã được tư vấn</p>
                        <Link to="/cauhoi_daxuly" className="card-button">Xem Lịch Sử</Link>
                    </div>

                    <div className="dashboard-card">
                        <h3>Thống Kê</h3>
                        <p>Xem thống kê và báo cáo hoạt động tư vấn</p>
                        <Link to="/thongke_huanluyenvien" className="card-button">Xem Thống Kê</Link>
                    </div>
                </div>
            </div>

            <footer>
                <p>© 2025 CaiThuocTot.vn - Bản quyền thuộc về nhóm phát triển</p>
                <p>Địa chỉ: 70 Đ. Tô Ký, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh | Email: nhubdq3680@ut.edu.vn | Hotline: 0364155024</p>
            </footer>
        </>
    );
};

export default CoachHome;