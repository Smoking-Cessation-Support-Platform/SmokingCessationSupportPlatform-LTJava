import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { saveSmokingData } from '../api/smokingDataApi';

const BaiLam = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (!userId || !token) {
            localStorage.clear();
            navigate('/login');
            return;
        }
        setLoading(false);
    }, [navigate]);

    const questions = [
        {
            text: "1. Bao lâu sau khi thức dậy bạn hút điếu thuốc lá đầu tiên?",
            options: ["Trong vòng 5 phút đầu tiên", "Trong khoảng 6-30 phút", "Trong khoảng 31-60 phút", "Sau 60 phút"],
            points: [3, 2, 1, 0]
        },
        {
            text: "2. Bạn có thấy khó không khi không hút thuốc ở nơi bị cấm?",
            options: ["Rất khó", "Khó", "Bình thường", "Dễ"],
            points: [1, 1, 0, 0]
        },
        {
            text: "3. Điếu thuốc nào trong ngày bạn thấy khó bỏ nhất?",
            options: ["Điếu đầu tiên trong ngày", "Điếu sau bữa ăn", "Điếu khi căng thẳng", "Điếu trước khi ngủ"],
            points: [1, 0, 0, 0]
        },
        {
            text: "4. Bạn hút bao nhiêu điếu mỗi ngày?",
            options: ["10 điếu trở xuống", "11-20 điếu", "21-30 điếu", "Trên 30 điếu"],
            points: [0, 1, 2, 3]
        },
        {
            text: "5. Bạn có hút thuốc nhiều hơn trong vài giờ đầu sau khi thức dậy không?",
            options: ["Có", "Không"],
            points: [1, 0]
        },
        {
            text: "6. Khi ốm nặng, bạn vẫn hút thuốc chứ?",
            options: ["Có", "Không"],
            points: [1, 0]
        }
    ];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answers, setAnswers] = useState(Array(questions.length).fill(null));
    const [isSubmitting, setIsSubmitting] = useState(false);

    const calculateTotalScore = () => {
        console.log('Current answers:', answers);
        let score = 0;
        answers.forEach((answer, index) => {
            if (answer !== null) {
                const answerIndex = parseInt(answer);
                console.log(`Question ${index + 1}:`, {
                    answer: answerIndex,
                    points: questions[index].points[answerIndex]
                });
                if (questions[index] && Array.isArray(questions[index].points) && questions[index].points[answerIndex] !== undefined) {
                    score += questions[index].points[answerIndex];
                }
            }
        });
        console.log('Final score:', score);
        return score;
    };

    const saveAssessmentData = async (totalScore) => {
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            
            if (!userId || !token) {
                throw new Error('Vui lòng đăng nhập lại để tiếp tục');
            }
            
            const today = new Date().toISOString().split('T')[0];

            const smokingData = {
                date: today,
                score: totalScore,
                notes: `Kết quả đánh giá Fagerstrom: ${totalScore}/10 điểm`,
                assessmentCompleted: true
            };
            
            console.log('Gửi dữ liệu đánh giá:', { userId, smokingData });
            const response = await saveSmokingData(userId, smokingData);
            
            if (!response) {
                throw new Error('Không nhận được phản hồi từ máy chủ');
            }
            
            if (response.error) {
                throw new Error(response.error);
            }
            
            console.log('Dữ liệu đã lưu thành công:', response);
            return true;
        } catch (error) {
            console.error('Lỗi khi lưu dữ liệu đánh giá:', error);
            const errorMessage = error.message || 'Lỗi không xác định khi lưu dữ liệu';
            if (error.response) {
                console.error('Chi tiết lỗi từ máy chủ:', error.response.data);
            }
            setError(error.message || 'Có lỗi xảy ra khi lưu kết quả đánh giá');
            return false;
        }
    };

    const handleNextQuestion = async () => {
        if (selectedAnswer === null) {
            setError("Vui lòng chọn một câu trả lời.");
            return;
        }

        // Save current answer
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = selectedAnswer;
        setAnswers(newAnswers);
        console.log('Saved answer for question', currentQuestionIndex + 1, ':', selectedAnswer);
        setSelectedAnswer(null);
        setError(null);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            // All questions answered, calculate score and save data
            setLoading(true);
            try {
                const totalScore = calculateTotalScore();
                console.log('Total score calculated:', totalScore);
                const saved = await saveAssessmentData(totalScore);
                if (saved) {
                    setCurrentQuestionIndex(questions.length);
                } else {
                    // Show error message if save was not successful
                    setError('Không thể lưu kết quả. Vui lòng thử lại.');
                }
            } catch (err) {
                setError(err.message || 'Có lỗi xảy ra khi lưu kết quả');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAnswerChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            setSelectedAnswer(value);
            console.log('Selected answer:', value);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleRetry = () => {
        setError(null);
        setLoading(true);
        // Retry saving the assessment
        const totalScore = calculateTotalScore();
        saveAssessmentData(totalScore)
            .then(saved => {
                if (saved) {
                    setCurrentQuestionIndex(questions.length);
                }
            })
            .catch(err => {
                console.error('Lỗi khi thử lại lưu kết quả:', err);
                setError(err.message || 'Vẫn không thể lưu kết quả. Vui lòng thử lại sau.');
            })
            .finally(() => setLoading(false));
    };

    const handleReset = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setAnswers(Array(questions.length).fill(null));
        setError(null);
        setIsSubmitting(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('isMember');
        navigate('/login');
    };

    const renderQuestionContent = () => {
        if (loading) {
            return (
                <div className="loading">
                    <p>Đang xử lý...</p>
                    <div className="loading-spinner"></div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="error-message">
                    <p>{error}</p>
                    <div className="button-group">
                        <button onClick={handleRetry} className="btn-primary">
                            Thử lại
                        </button>
                        <button 
                            onClick={handleReset} 
                            className="btn-secondary"
                        >
                            Làm lại từ đầu
                        </button>
                    </div>
                </div>
            );
        }

        if (currentQuestionIndex === questions.length) {
            const totalScore = calculateTotalScore();
            let resultText = '';
            let resultLevel = '';
            
            if (totalScore <= 2) {
                resultLevel = 'Mức 1';
                resultText = 'Nghiện rất nhẹ: Bạn có thể tự cai thuốc.';
            } else if (totalScore <= 4) {
                resultLevel = 'Mức 2';
                resultText = 'Nghiện nhẹ: Cần thêm quyết tâm và kế hoạch cai thuốc rõ ràng.';
            } else if (totalScore <= 6) {
                resultLevel = 'Mức 3';
                resultText = 'Nghiện trung bình: Nên tham khảo ý kiến chuyên gia để được hỗ trợ.';
            } else if (totalScore <= 8) {
                resultLevel = 'Mức 4';
                resultText = 'Nghiện nặng: Cần có sự hỗ trợ từ chuyên gia và người thân.';
            } else {
                resultLevel = 'Mức 5';
                resultText = 'Nghiện rất nặng: Cần được điều trị và hỗ trợ y tế chuyên sâu.';
            }

            return (
                <div className="result-container">
                    <h2>Kết quả đánh giá mức độ nghiện thuốc lá</h2>
                    <div className="result-box">
                        <div className="result-level">{resultLevel}</div>
                        <div className="result-description">{resultText}</div>
                    </div>
                    <div className="result-actions">
                        <button onClick={handleReset} className="btn-primary">
                            Làm lại đánh giá
                        </button>
                        <Link to="/canhan" className="btn-secondary">
                            Xem nhật ký hút thuốc
                        </Link>
                    </div>
                    <div className="recommendation-box">
                        <h4>Các bước tiếp theo:</h4>
                        <ul>
                            <li>Lập kế hoạch cai thuốc chi tiết</li>
                            <li>Tìm hiểu các phương pháp cai thuốc phù hợp</li>
                            <li>Chia sẻ với người thân và nhận sự hỗ trợ</li>
                            <li>Theo dõi tiến trình cai thuốc hàng ngày</li>
                        </ul>
                    </div>
                </div>
            );
        }

        const q = questions[currentQuestionIndex];
        return (
            <>
                <h3>{q.text}</h3>
                {q.options.map((option, i) => (
                    <label key={i}>
                        <div className="radio-option">
                            <input
                                type="radio"
                                name="answer"
                                value={i}
                                id={`option-${i}`}
                                checked={selectedAnswer === i}
                                onChange={handleAnswerChange}
                            />
                            <span className="radio-custom"></span>
                            <label htmlFor={`option-${i}`}>{option}</label>
                        </div>
                    </label>
                ))}
                <button className="btn-next" onClick={handleNextQuestion}>Tiếp theo</button>
            </>
        );
    };

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    return (
        <>
            <style>{`
                * { box-sizing: border-box; }
                body {
                    margin: 0;
                    font-family: 'Roboto', sans-serif;
                    background: #fff;
                    color: #333;
                    line-height: 1.6;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }
                a { text-decoration: none; color: inherit; }

                header {
                    background: #004d40;
                    color: white;
                    padding: 12px 20px;
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
                    flex-wrap: wrap;
                    justify-content: center;
                    padding: 12px 0;
                }
                nav a {
                    color: #fff;
                    margin: 0 10px;
                    padding: 6px 12px;
                    font-weight: bold;
                    transition: background 0.3s;
                }
                nav a:hover {
                    background: rgba(255,255,255,0.2);
                    border-radius: 4px;
                }

                .container {
                    max-width: 1200px;
                    margin: 40px auto;
                    padding: 20px;
                    position: relative;
                    flex-grow: 1;
                }

                .back-btn {
                    position: absolute;
                    top: 0;
                    left: 0;
                    background: linear-gradient(135deg, #009688 0%, #00796b 100%);
                    color: #fff;
                    border: none;
                    padding: 10px 20px 10px 40px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 500;
                    font-size: 14px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .back-btn::before {
                    content: '←';
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 16px;
                    transition: all 0.3s ease;
                }

                .back-btn:hover {
                    background: linear-gradient(135deg, #00796b 0%, #00695c 100%);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
                    transform: translateY(-2px);
                    padding-left: 45px;
                }

                .back-btn:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }

                #menuIconWrapper {
                    position: fixed;
                    top: 16px;
                    right: 16px;
                    z-index: 1001;
                    display: block;
                }

                .circle-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 2px solid red;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: white;
                    cursor: pointer;
                }

                #menuIcon {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                #sidebar {
                    position: fixed;
                    top: 0;
                    right: -320px;
                    width: 300px;
                    height: 100%;
                    background-color: white;
                    box-shadow: -2px 0 10px rgba(0,0,0,0.3);
                    z-index: 1000;
                    padding: 20px;
                    transition: right 0.3s ease;
                    overflow-y: auto;
                }

                #sidebar.open {
                    right: 0;
                }

                .sidebar-item {
                    display: flex;
                    align-items: center;
                    padding: 12px 10px;
                    border-bottom: 1px solid #eee;
                    cursor: pointer;
                    color: #333;
                    font-size: 16px;
                }

                .sidebar-item i {
                    margin-right: 10px;
                    font-style: normal;
                }

                .sidebar-item:hover {
                    background-color: #f0f0f0;
                }

                #overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.3);
                    display: none;
                    z-index: 999;
                }

                #overlay.show {
                    display: block;
                }

                footer {
                    background: #004d40;
                    color: #fff;
                    padding: 20px;
                    text-align: center;
                    margin-top: auto;
                }

                /* Question Box Styles */
                .content-box {
                    background: #ffffff;
                    border-radius: 16px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
                    padding: 2.5rem;
                    position: relative;
                    overflow: hidden;
                    border: 1px solid rgba(59, 130, 246, 0.1);
                }

                .page-title {
                    color: #1e293b;
                    font-size: 2rem;
                    font-weight: 700;
                    text-align: center;
                    margin: 1rem 0 1.5rem;
                    background: linear-gradient(90deg, #22c55e, #3b82f6, #f97316);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    position: relative;
                    padding-bottom: 1rem;
                }

                .divider {
                    height: 2px;
                    background: linear-gradient(90deg, #22c55e, #3b82f6, #f97316);
                    margin: 1.5rem 0 2rem;
                    border-radius: 2px;
                    opacity: 0.3;
                }

                .question-box {
                    background: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                }

                .progress-indicator {
                    text-align: right;
                    color: #3b82f6;
                    font-size: 1rem;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(34, 197, 94, 0.1));
                    padding: 0.8rem 1.2rem;
                    border-radius: 8px;
                    display: inline-block;
                    border: 1px solid rgba(59, 130, 246, 0.2);
                }

                .question-content {
                    padding: 1.5rem;
                    background: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                }

                h3 {
                    color: #1e293b;
                    font-size: 1.4rem;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                    font-weight: 600;
                    padding-left: 1rem;
                    border-left: 4px solid #3b82f6;
                }

                .radio-option {
                    display: block;
                    padding: 1.2rem 1.5rem;
                    margin-bottom: 1rem;
                    background: #f8fafc;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    padding-left: 3.5rem;
                }

                .radio-option:hover {
                    background: #f0f9ff;
                    border-color: #3b82f6;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
                }

                .radio-option input[type="radio"]:checked + .radio-custom {
                    background: linear-gradient(135deg, #3b82f6, #22c55e);
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
                }

                .btn-next {
                    background: linear-gradient(135deg, #3b82f6, #22c55e);
                    color: white;
                    padding: 1rem 2rem;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 1.1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: none;
                    margin-top: 2rem;
                    width: 100%;
                    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
                }

                .btn-next:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
                }

                .result-container {
                    text-align: center;
                    padding: 2rem;
                    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(34, 197, 94, 0.05));
                    border-radius: 16px;
                    border: 1px solid rgba(59, 130, 246, 0.1);
                }

                .result-container h2 {
                    color: #1e40af;
                    font-size: 1.8rem;
                    margin-bottom: 1.5rem;
                }

                .result-box {
                    background: white;
                    border-radius: 12px;
                    padding: 2rem;
                    margin: 1.5rem 0;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                }

                .result-level {
                    color: #1e40af;
                    font-size: 1.4rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid rgba(59, 130, 246, 0.2);
                }

                .result-description {
                    color: #1e293b;
                    font-size: 1.2rem;
                    line-height: 1.8;
                }

                .result-actions {
                    display: flex;
                    gap: 16px;
                    margin-top: 24px;
                    justify-content: center;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    border: none;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 12px rgba(59, 130, 246, 0.3);
                }

                .btn-secondary {
                    background: white;
                    color: #3b82f6;
                    padding: 12px 24px;
                    border-radius: 8px;
                    border: 2px solid #3b82f6;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    display: inline-block;
                }

                .btn-secondary:hover {
                    background: #f0f9ff;
                    transform: translateY(-2px);
                }

                .recommendation-box {
                    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
                    border-radius: 12px;
                    padding: 24px;
                    margin-top: 24px;
                    text-align: left;
                }

                .recommendation-box h4 {
                    color: #1e40af;
                    margin-bottom: 16px;
                    font-size: 1.2rem;
                    text-align: center;
                }

                .recommendation-box ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .recommendation-box li {
                    padding: 8px 0 8px 24px;
                    position: relative;
                    color: #1e293b;
                }

                .recommendation-box li:before {
                    content: "•";
                    color: #3b82f6;
                    font-weight: bold;
                    position: absolute;
                    left: 0;
                }

                /* Loading State */
                .loading {
                    text-align: center;
                    padding: 3rem 0;
                }

                .loading-spinner {
                    border: 3px solid rgba(59, 130, 246, 0.1);
                    border-top-color: #3b82f6;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1.5rem;
                }

                /* Error Message */
                .error-message {
                    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(249, 115, 22, 0.1));
                    color: #ef4444;
                    padding: 1.2rem;
                    border-radius: 10px;
                    margin: 1rem 0;
                    text-align: center;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    font-weight: 500;
                }

                /* Animations */
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .container {
                        padding: 1rem;
                    }

                    .content-box {
                        padding: 1.5rem;
                    }

                    .page-title {
                        font-size: 1.6rem;
                    }

                    .button-group {
                        flex-direction: column;
                    }

                    h3 {
                        font-size: 1.2rem;
                        padding-left: 0.8rem;
                    }

                    .radio-option {
                        padding: 1rem 1.2rem 1rem 3rem;
                    }
                }

                @media (max-width: 640px) {
                    .result-actions {
                        flex-direction: column;
                    }

                    .btn-primary,
                    .btn-secondary {
                        width: 100%;
                        text-align: center;
                    }

                    .result-container {
                        padding: 1rem;
                    }

                    .result-box {
                        padding: 1.5rem;
                    }

                    .result-level {
                        font-size: 1.2rem;
                    }

                    .result-description {
                        font-size: 1.1rem;
                    }
                }
            `}</style>

            <header>
                <div className="topbar">
                    <div className="topbar-left">
                        <img src="/images1/logo.jpg" alt="Logo CaiThuocTot.vn" />
                        <div><strong>CaiThuocTot.vn</strong> - Hành trình vì sức khỏe</div>
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

            <div className="container">
                <button className="back-btn" onClick={handleGoBack}>Quay lại</button>

                <div className="content-box">
                    <div className="header-decoration"></div>
                    <h2 className="page-title">Đánh giá mức độ nghiện thuốc lá</h2>
                    <div className="divider"></div>
                    
                    <div className="question-box">
                        <div className="progress-indicator">
                            {currentQuestionIndex < questions.length 
                                ? `Câu hỏi ${currentQuestionIndex + 1}/${questions.length}`
                                : 'Hoàn thành'}
                        </div>
                        {renderQuestionContent()}
                    </div>
                </div>
            </div>

            <footer>
                <p>© 2025 CaiThuocTot.vn - Bản quyền thuộc về nhóm phát triển</p>
                <p>Địa chỉ: 70 Đ. Tô Ký, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh | Email: nhubdq3680@ut.edu.vn | Hotline: 0364155024</p>
            </footer>

            {/* Sidebar Menu */}
            <div id="menuIconWrapper" onClick={() => document.getElementById('sidebar').classList.add('open')}>
                <div className="circle-avatar">
                    <img id="menuIcon" src="/images1/cainghien.jpeg" alt="Avatar menu" />
                </div>
            </div>

            <div id="overlay" onClick={() => document.getElementById('sidebar').classList.remove('open')}></div>

            <div id="sidebar">
                <Link to="/canhan" className="sidebar-item"><i>👥</i> Trang cá nhân</Link>
                <Link to="/member" className="sidebar-item"><i>💬</i> Dịch vụ khách hàng</Link>
                <div className="sidebar-item" onClick={handleLogout}><i>🚪</i> Đăng xuất</div>
            </div>
        </>
    );
};

export default BaiLam;