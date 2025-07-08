import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCoachList, deleteCoach } from '../api/coachApi';

const DanhSachHuanLuyenVien = () => {
    const [coaches, setCoaches] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
        if (!isAdminLoggedIn) {
            navigate('/login-admin');
        } else {
            getCoachList()
                .then(coaches => setCoaches(coaches || []))
                .catch(err => {
                    setCoaches([]);
                    alert('Không thể tải danh sách huấn luyện viên. Vui lòng kiểm tra kết nối backend!');
                });
        }
    }, [navigate]);
    

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredCoaches = useMemo(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return coaches.filter(coach =>
            coach.username && coach.username.toLowerCase().includes(lowercasedSearchTerm)
        );
    }, [coaches, searchTerm]);

    const handleDeleteCoach = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa huấn luyện viên này?")) {
            await deleteCoach(id);
            setCoaches(prevCoaches => prevCoaches.filter(coach => coach.id !== id));
        }
    };

    const handleDeleteAll = async () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ huấn luyện viên?")) {
            for (const coach of coaches) {
                await deleteCoach(coach.id);
            }
            setCoaches([]);
        }
    };

    return (
        <>
            <style>{`
                * {
                    box-sizing: border-box;
                    font-family: 'Segoe UI', sans-serif;
                }
                body {
                    background-color: #f4f6f8;
                    margin: 0;
                    padding: 0;
                }
                header {
                    background: #fff;
                    padding: 15px 30px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    border-bottom: 1px solid #ccc;
                    flex-wrap: wrap;
                }
                .logo {
                    position: absolute;
                    left: 30px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    text-decoration: none;
                    color: #000;
                }
                .logo img {
                    height: 40px;
                }
                nav {
                    display: flex;
                    gap: 30px;
                }
                nav a {
                    text-decoration: none;
                    font-weight: 500;
                    color: #333;
                    border-bottom: 2px solid transparent;
                    padding-bottom: 4px;
                    transition: all 0.2s;
                }
                nav a.active, nav a:hover {
                    border-bottom: 2px solid #ffb400;
                }
                .container {
                    max-width: 1000px;
                    margin: 30px auto;
                    padding: 30px;
                    background: #fff;
                    border-radius: 10px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                }
                h2 {
                    font-size: 24px;
                    margin-bottom: 20px;
                    color: #222;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .search-box {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    gap: 10px;
                }
                .search-box input {
                    padding: 8px 12px;
                    width: 100%;
                    max-width: 300px;
                    border: 1px solid #aaa;
                    border-radius: 5px;
                }
                .delete-all-btn {
                    background-color: #ff5722;
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: background-color 0.2s ease;
                }
                .delete-all-btn:hover {
                    background-color: #e64a19;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    background-color: white;
                    margin-top: 10px;
                }
                th, td {
                    border: 1px solid #ccc;
                    padding: 12px;
                    text-align: left;
                }
                th {
                    background-color: #eee;
                }
                .delete-btn {
                    background-color: red;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }
                .delete-btn:hover {
                    background-color: #cc0000;
                }
                @media (max-width: 768px) {
                    header {
                        flex-direction: column;
                        align-items: flex-start;
                        padding: 10px;
                    }
                    .logo {
                        position: static;
                        margin-bottom: 10px;
                    }
                    nav {
                        justify-content: center;
                        width: 100%;
                        gap: 20px;
                    }
                    .container {
                        padding: 20px;
                        margin: 20px;
                    }
                    .search-box {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .search-box input,
                    .delete-all-btn {
                        width: 100%;
                    }
                    table {
                        font-size: 14px;
                    }
                }
            `}</style>
            {/* HEADER */}
            <header>
                <Link to="/admin" className="logo">
                    <img src="/images1/logo.jpg" alt="logo" />
                    <div>
                        <strong>Smoking Cessation<br />Support Platform</strong>
                    </div>
                </Link>
                <nav>
                    <Link to="/danhsachhuanluyenvien" className="active">Danh sách huấn luyện viên</Link>
                    <Link to="/thongke2">Thống kê</Link>
                </nav>
            </header>
            {/* MAIN CONTENT */}
            <div className="container">
                <h2><i className="fas fa-users"></i> Danh sách huấn luyện viên</h2>
                <div className="search-box">
                    <input
                        type="text"
                        id="searchInput"
                        placeholder="Tìm kiếm theo tên đăng nhập..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <button className="delete-all-btn" onClick={handleDeleteAll}>Xóa tất cả</button>
                </div>
                <table id="coachTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên đăng nhập</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCoaches.length > 0 ? (
                            filteredCoaches.map(coach => (
                                <tr key={coach.id}>
                                    <td>{coach.id}</td>
                                    <td>{coach.username}</td>
                                    <td>
                                        <button className="delete-btn" onClick={() => handleDeleteCoach(coach.id)}>Xóa</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                                    Không tìm thấy huấn luyện viên nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default DanhSachHuanLuyenVien; 