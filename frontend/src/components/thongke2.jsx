import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
import { getCoachList } from '../api/coachApi';

Chart.register(...registerables);

const CoachStatistics = () => {
    const navigate = useNavigate();
    const chartRef = useRef(null);
    const [coaches, setCoaches] = useState([]);
    let chartInstance = null;

    // Tính số huấn luyện viên mới theo từng tháng dựa trên trường ngày tạo phổ biến
    const getMonthlyCoachCounts = (coaches) => {
        const counts = Array(12).fill(0);
        const currentYear = new Date().getFullYear();
        coaches.forEach(coach => {
            let dateStr = coach.createdAt || coach.created_at || coach.dateCreated;
            if (dateStr) {
                const date = new Date(dateStr);
                if (date.getFullYear() === currentYear) {
                    const month = date.getMonth();
                    counts[month]++;
                }
            }
        });
        return counts;
    };

    const monthlyData = getMonthlyCoachCounts(coaches);
    const totalCoaches = coaches.length;

    useEffect(() => {
        const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
        if (!isAdminLoggedIn) {
            navigate('/login-admin');
        }
        getCoachList()
            .then(coaches => setCoaches(coaches || []))
            .catch(() => setCoaches([]));
    }, [navigate]);

    useEffect(() => {
        if (chartRef.current) {
            const monthlyCtx = chartRef.current.getContext('2d');
            const gradientMonth = monthlyCtx.createLinearGradient(0, 0, 0, 300);
            gradientMonth.addColorStop(0, '#6a11cb');
            gradientMonth.addColorStop(1, '#2575fc');
            if (chartInstance) {
                chartInstance.destroy();
            }
            chartInstance = new Chart(monthlyCtx, {
                type: 'bar',
                data: {
                    labels: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
                    datasets: [{
                        label: 'Huấn luyện viên mới',
                        data: monthlyData,
                        backgroundColor: gradientMonth,
                        borderRadius: 6,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
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
        return () => {
            if (chartInstance) {
                chartInstance.destroy();
                chartInstance = null;
            }
        };
    }, [coaches.length]);

    return (
        <>
            <style>{`
                * {
                    box-sizing: border-box;
                    font-family: 'Segoe UI', sans-serif;
                }
                body {
                    margin: 0;
                    background-color: #f9f9f9;
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
                    justify-content: center;
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
                    max-height: 300px;
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
            <header>
                <Link to="/admin" className="logo">
                    <img src="/images1/logo.jpg" alt="logo" />
                    <div><strong>Smoking Cessation<br />Support Platform</strong></div>
                </Link>
                <nav>
                    <Link to="/danhsachhuanluyenvien">Danh sách huấn luyện viên</Link>
                    <Link to="/thongke2" className="active">Thống kê HLV</Link>
                </nav>
            </header>
            <div className="container">
                <h2><i className="fas fa-chart-bar"></i> Thống kê huấn luyện viên</h2>
                <div className="stats-boxes">
                    <div className="stat">
                        <h3 id="coachCount">{totalCoaches}</h3>
                        <p>Huấn luyện viên</p>
                    </div>
                </div>
                <h3 style={{ marginBottom: '10px' }}>Số huấn luyện viên theo tháng</h3>
                <div className="chart-wrapper">
                    <canvas ref={chartRef} id="monthlyCoachChart"></canvas>
                </div>
            </div>
        </>
    );
};

export default CoachStatistics; 