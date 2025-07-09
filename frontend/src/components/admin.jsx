import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Font Awesome cần được cài đặt và import nếu bạn muốn dùng icon trực tiếp trong JSX
// Nếu bạn chỉ muốn dùng qua CDN link trong index.html của public, không cần import ở đây.

const AdminPage = () => {
    const navigate = useNavigate();

    // Kiểm tra trạng thái đăng nhập admin khi component mount
    useEffect(() => {
        const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
        if (!isAdminLoggedIn) {
            navigate('/login-admin'); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
        }
    }, [navigate]); // navigate là một dependency, nhưng nó ổn định và không gây vòng lặp

    const handleLogoutAdmin = () => {
        localStorage.removeItem('isAdminLoggedIn');
        navigate('/login-admin'); // Chuyển hướng về trang đăng nhập sau khi đăng xuất
    };

    return (
        <>
            {/* CSS nhúng - Tốt nhất nên chuyển ra file .css riêng (ví dụ: admin-page.css) */}
            {/* và import vào đây: import './admin-page.css'; */}
            <style>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: "Segoe UI", sans-serif;
                }

                body {
                    background-color: #f4f6f8;
                    color: #333;
                }

                .admin-container {
                    display: flex;
                    min-height: 100vh;
                }

                /* Sidebar */
                .sidebar {
                    width: 230px;
                    background-color: #ff9f43;
                    padding: 30px 20px;
                    color: #fff;
                }

                .sidebar h2 {
                    text-align: center;
                    margin-bottom: 30px;
                }

                .sidebar ul {
                    list-style: none;
                }

                .sidebar li {
                    padding: 12px;
                    margin-bottom: 10px;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: 0.3s;
                    display: flex; /* Để icon và text trên cùng 1 dòng */
                    align-items: center;
                    gap: 10px; /* Khoảng cách giữa icon và text */
                }

                .sidebar li:hover {
                    background-color: #ff7f11;
                }
                .sidebar a { /* Style cho Link component */
                    color: inherit; /* Kế thừa màu từ li */
                    text-decoration: none; /* Bỏ gạch chân */
                    display: flex;
                    align-items: center;
                    width: 100%;
                    gap: 10px;
                }


                /* Main Content */
                .main-content {
                    flex: 1;
                    padding: 30px;
                    background-color: #fff;
                    position: relative; /* Thêm để big-decor hoạt động đúng */
                    overflow: hidden; /* Để big-decor không tràn ra ngoài */
                }

                header h1 {
                    font-size: 24px;
                    margin-bottom: 10px;
                }

                .summary {
                    font-size: 14px;
                    color: #777;
                    margin-bottom: 30px;
                }

                section {
                    margin-bottom: 40px;
                    background: #fefefe;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }

                section h3 {
                    margin-bottom: 15px;
                    color: #333;
                }

                /* Các style liên quan đến Rating đã bị bỏ qua vì phần HTML đó không còn */

                .main-title {
                    font-size: 28px;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: #ff9f43;
                    text-shadow: 1px 2px 8px #ffe0b2, 0 1px 0 #fff;
                    animation: fadeInTitle 1.2s cubic-bezier(.4,0,.2,1);
                }
                .main-title i {
                    font-size: 32px;
                    color: #ff7f11;
                    animation: bounceIcon 1.2s infinite alternate;
                }
                .big-decor {
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: -30px;
                    display: flex;
                    justify-content: center;
                    gap: 40px;
                    z-index: 1;
                    pointer-events: none;
                    animation: fadeInDecor 1.5s cubic-bezier(.4,0,.2,1);
                }
                .big-emoji {
                    font-size: 4.5rem;
                    filter: drop-shadow(0 6px 18px #ffe0b2);
                    opacity: 0.92;
                    transform: scale(1) rotate(-6deg);
                    transition: filter 0.3s, transform 0.3s, opacity 0.3s;
                    pointer-events: auto;
                    cursor: pointer;
                    user-select: none;
                    animation: floatEmoji 3s ease-in-out infinite alternate;
                }
                .big-emoji:nth-child(2) { animation-delay: 0.5s; }
                .big-emoji:nth-child(3) { animation-delay: 1s; }
                .big-emoji:nth-child(4) { animation-delay: 1.5s; }
                .big-emoji:hover {
                    filter: drop-shadow(0 12px 32px #ffecb3);
                    transform: scale(1.18) rotate(6deg);
                    opacity: 1;
                }
                .admin-welcome {
                    margin-top: 60px;
                    text-align: center;
                    font-size: 1.45rem;
                    color: #ff7f11;
                    font-weight: 600;
                    letter-spacing: 1px;
                    text-shadow: 0 2px 8px #ffe0b2, 0 1px 0 #fff;
                    animation: fadeInWelcome 1.2s cubic-bezier(.4,0,.2,1);
                }
                @keyframes fadeInTitle {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes bounceIcon {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-8px) scale(1.15); }
                }
                @keyframes fadeInDecor {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes floatEmoji {
                    0% { transform: scale(1) translateY(0) rotate(-6deg); }
                    100% { transform: scale(1.08) translateY(-18px) rotate(6deg); }
                }
                @keyframes fadeInWelcome {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="admin-container">
                {/* Sidebar */}
                <aside className="sidebar">
                    <h2>👨‍💼 Admin</h2>
                    <ul>
                        <li className="sidebar-item">
                            <Link to="/danhsachnguoidung">
                                <span style={{width: 22, display: 'inline-block', textAlign: 'center'}} role="img" aria-label="Người dùng">👥</span> Người dùng
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link to="/danhsachhuanluyenvien">
                                <span style={{width: 22, display: 'inline-block', textAlign: 'center'}} role="img" aria-label="Huấn luyện viên">📊</span> Huấn luyện viên
                            </Link>
                        </li>
                        <li className="sidebar-item" onClick={handleLogoutAdmin}>
                            <span style={{width: 22, display: 'inline-block', textAlign: 'center'}} role="img" aria-label="Đăng xuất">🚪</span> Đăng xuất
                        </li>
                    </ul>
                </aside>

                {/* Nội dung chính */}
                <main className="main-content">
                    <header style={{ position: 'relative', minHeight: '210px' }}>
                        <h1 className="main-title">
                            <i className="fas fa-smoking-ban"></i> Smoking Cessation Support Platform
                        </h1>
                        <div className="big-decor">
                            <span className="big-emoji">🚭</span>
                            <span className="big-emoji">🕊️</span>
                            <span className="big-emoji">🌳</span>
                            <span className="big-emoji">💪</span>
                        </div>
                        <div className="admin-welcome">Chào mừng đến với trang <b>Admin</b>!</div>
                    </header>
                    {/* Phần nội dung khác của trang admin có thể được render ở đây,
                        hoặc bạn có thể dùng React Router để render các component con
                        tùy thuộc vào mục menu được chọn. */}
                </main>
            </div>
        </>
    );
};

export default AdminPage;