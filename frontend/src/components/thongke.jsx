import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Chart, registerables } from 'chart.js'; // Import Chart và registerables từ chart.js

// Đăng ký tất cả các thành phần cần thiết của Chart.js (biểu đồ, tỉ lệ, element, v.v.)
Chart.register(...registerables);

const AdminStatistics = () => {
    const navigate = useNavigate();
    const chartRef = useRef(null); // Tạo một ref để tham chiếu đến element canvas
    let chartInstance = null; // Biến để lưu trữ instance của biểu đồ

    // Dữ liệu thống kê mẫu
    const monthlyData = [15, 18, 12, 19, 11, 17, 0, 0, 0, 0, 0, 0];
    const totalUsers = monthlyData.reduce((sum, val) => sum + val, 0);

    // useEffect để kiểm tra đăng nhập và vẽ biểu đồ
    useEffect(() => {
        const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
        if (!isAdminLoggedIn) {
            navigate('/login-admin');
        }

        // Đảm bảo canvas đã được render và có sẵn
        if (chartRef.current) {
            const monthlyCtx = chartRef.current.getContext('2d');

            // Tạo gradient cho biểu đồ
            const gradientMonth = monthlyCtx.createLinearGradient(0, 0, 0, 300);
            gradientMonth.addColorStop(0, '#6a11cb');
            gradientMonth.addColorStop(1, '#2575fc');

            // Hủy biểu đồ cũ nếu có để tránh lỗi khi re-render
            if (chartInstance) {
                chartInstance.destroy();
            }

            // Tạo biểu đồ mới
            chartInstance = new Chart(monthlyCtx, {
                type: 'bar',
                data: {
                    labels: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
                    datasets: [{
                        label: 'Người dùng mới',
                        data: monthlyData,
                        backgroundColor: gradientMonth,
                        borderRadius: 6,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // Quan trọng để biểu đồ không bị kéo dãn nếu parent có chiều rộng cố định
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: context => ` ${context.parsed.y} người`
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { stepSize: 5 },
                            title: { display: true, text: 'Số lượng' }
                        },
                        x: {
                            title: { display: true, text: 'Tháng' }
                        }
                    }
                }
            });
        }

        // Cleanup function: Hủy biểu đồ khi component unmount
        return () => {
            if (chartInstance) {
                chartInstance.destroy();
                chartInstance = null; // Đảm bảo instance được reset
            }
        };
    }, [navigate, monthlyData]); // Dependency array: Biểu đồ sẽ được vẽ lại nếu dữ liệu thay đổi

    return (
        <>
            {/* --- CSS Injected Below (Bạn nên chuyển CSS này ra một file .css riêng và import vào) --- */}
            <style>{`
                * {
                    box-sizing: border-box;
                    font-family: 'Segoe UI', sans-serif;
                }

                body {
                    margin: 0;
                    background-color: #f9f9f9;
                }

                /* ==== HEADER GIỐNG CÁC TRANG KHÁC ==== */
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

                nav a.active, /* Add active class for current page */
                nav a:hover {
                    border-bottom: 2px solid #ffb400;
                }

                .container {
                    padding: 30px 20px 50px;
                    text-align: center;
                    max-width: 1000px;
                    margin: auto;
                }

                h2 {
                    margin-bottom: 30px;
                    font-size: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center; /* Căn giữa icon và text */
                    gap: 10px;
                }

                .stats-boxes {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 20px;
                    margin-bottom: 40px;
                }

                .stat {
                    background: #fff;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    min-width: 120px;
                    transition: transform 0.2s;
                }

                .stat:hover {
                    transform: translateY(-5px);
                }

                .stat h3 {
                    font-size: 26px;
                    color: #007bff;
                    margin: 0;
                }

                .stat p {
                    margin-top: 8px;
                    color: #555;
                }

                .chart-wrapper {
                    background: #fff;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    margin-bottom: 40px;
                }

                canvas {
                    width: 100% !important;
                    height: auto !important;
                    max-height: 300px; /* Đảm bảo biểu đồ không quá cao */
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
                        width: 100%;
                        justify-content: center;
                        flex-wrap: wrap;
                        gap: 20px;
                    }

                    .container {
                        padding: 20px;
                        margin: 20px;
                    }

                    .stats-boxes {
                        flex-direction: column;
                        align-items: center;
                    }
                }
            `}</style>
            {/* --- END CSS --- */}

            {/* HEADER */}
            <header>
                <Link to="/admin" className="logo">
                    <img src="/images1/logo.jpg" alt="logo" />
                    <div><strong>Smoking Cessation<br />Support Platform</strong></div>
                </Link>
                <nav>
                    <Link to="/danhsachnguoidung">Danh sách người dùng</Link>
                    <Link to="/thongke" className="active">Thống kê</Link>
                </nav>
            </header>

            {/* MAIN CONTENT */}
            <div className="container">
                <h2><i className="fas fa-chart-bar"></i> Thống kê hệ thống</h2>

                <div className="stats-boxes">
                    <div className="stat">
                        <h3 id="userCount">{totalUsers}</h3> {/* Hiển thị tổng người dùng từ state */}
                        <p>Người dùng</p>
                    </div>
                    {/* Bạn có thể thêm các ô thống kê khác ở đây nếu có dữ liệu */}
                </div>

                <h3 style={{ marginBottom: '10px' }}>Số người dùng theo tháng</h3>
                <div className="chart-wrapper">
                    <canvas ref={chartRef} id="monthlyChart"></canvas> {/* Gắn ref vào canvas */}
                </div>
            </div>
        </>
    );
};

export default AdminStatistics;