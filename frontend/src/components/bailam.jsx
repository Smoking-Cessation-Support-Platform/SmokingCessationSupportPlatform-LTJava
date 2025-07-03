import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

    const saveAssessmentData = async (totalScore) => {
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            
            if (!userId || !token) {
                throw new Error('Vui lòng đăng nhập lại để tiếp tục');
            }
            
            const today = new Date().toISOString().split('T')[0];
            // Determine addiction level based on total score
            let addictionLevel = 'Nhẹ';
            if (totalScore > 8) {
                addictionLevel = 'Rất nặng';
            } else if (totalScore > 6) {
                addictionLevel = 'Nặng';
            } else if (totalScore > 3) {
                addictionLevel = 'Trung bình';
            }

            const smokingData = {
                date: today,
                cigarettesSmoked: calculateCigarettesCount(answers[3]),
                cravingLevel: totalScore,
                addictionLevel: addictionLevel,
                notes: 'Kết quả đánh giá Fagerstrom',
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

    const calculateCigarettesCount = (answerIndex) => {
        // Convert answer index to approximate number of cigarettes
        switch(answerIndex) {
            case 0: return 5;   // 10 điếu trở xuống
            case 1: return 15;  // 11-20 điếu
            case 2: return 25;  // 21-30 điếu
            case 3: return 35;  // Trên 30 điếu
            default: return 0;
        }
    };

    const calculateTotalScore = () => {
        return answers.reduce((total, answer, index) => {
            if (answer !== null) {
                return total + questions[index].points[answer];
            }
            return total;
        }, 0);
    };

    const handleNextQuestion = async () => {
        if (selectedAnswer === null) {
            setError("Vui lòng chọn một câu trả lời.");
            return;
        }

        // Save current answer
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = parseInt(selectedAnswer);
        setAnswers(newAnswers);
        setSelectedAnswer(null);
        setError(null);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            // All questions answered, calculate score and save data
            setLoading(true);
            try {
                const totalScore = calculateTotalScore();
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
        setSelectedAnswer(e.target.value);
    };

    const handleGoBack = () => {
        navigate(-1); // Navigates back one step in the browser history
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
                            onClick={() => setCurrentQuestionIndex(0)} 
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
            
            if (totalScore <= 2) {
                resultText = 'Mức độ nghiện rất thấp. Bạn có thể bỏ thuốc dễ dàng.';
            } else if (totalScore <= 4) {
                resultText = 'Mức độ nghiện thấp. Bạn có thể bỏ thuốc với sự quyết tâm.';
            } else if (totalScore <= 6) {
                resultText = 'Mức độ nghiện trung bình. Bạn nên tìm sự hỗ trợ để bỏ thuốc.';
            } else {
                resultText = 'Mức độ nghiện cao. Bạn nên tìm sự giúp đỡ từ chuyên gia.';
            }

            return (
                <div className="result-container">
                    <h3>Kết quả đánh giá</h3>
                    <p>Điểm số của bạn: <strong>{totalScore}/10</strong></p>
                    <p className="result-text">{resultText}</p>
                    <p className="success-message">Dữ liệu đã được lưu vào nhật ký hút thuốc của bạn.</p>
                    <div className="button-group">
                        <button onClick={() => navigate('/member')} className="btn-primary">
                            Về trang chủ
                        </button>
                        <button onClick={() => setCurrentQuestionIndex(0)} className="btn-secondary">
                            Làm lại đánh giá
                        </button>
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
                                checked={selectedAnswer === String(i)}
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
        <div className="container">
            <button onClick={() => navigate(-1)} className="back-btn">
                ← Quay lại
            </button>
            
            <div className="content-box">
                <h2 className="page-title">Đánh giá mức độ nghiện thuốc lá</h2>
                <div className="divider"></div>
                
                <div className="question-box">
                    <style jsx>{`
                        /* Global Container */
                        .container {
                            max-width: 900px;
                            margin: 0 auto;
                            padding: 2rem 1rem;
                            min-height: 100vh;
                            font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
                            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                        }

                        /* Back Button */
                        .back-btn {
                            display: inline-flex;
                            align-items: center;
                            gap: 0.5rem;
                            background: #fff;
                            border: 1px solid #e0e0e0;
                            border-radius: 50px;
                            padding: 0.6rem 1.2rem;
                            font-size: 0.95rem;
                            color: #444;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                            margin-bottom: 1.5rem;
                        }

                        .back-btn:hover {
                            background: #f8f9fa;
                            transform: translateX(-3px);
                            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                        }

                        /* Content Box */
                        .content-box {
                            background: #fff;
                            border-radius: 16px;
                            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
                            padding: 2.5rem;
                            position: relative;
                            overflow: hidden;
                        }

                        /* Page Title */
                        .page-title {
                            color: #2d3748;
                            font-size: 1.8rem;
                            font-weight: 700;
                            text-align: center;
                            margin-bottom: 1.5rem;
                            background: linear-gradient(90deg, #4f46e5, #7c3aed);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            position: relative;
                            padding-bottom: 1rem;
                        }

                        .page-title::after {
                            content: '';
                            position: absolute;
                            bottom: 0;
                            left: 50%;
                            transform: translateX(-50%);
                            width: 100px;
                            height: 4px;
                            background: linear-gradient(90deg, #4f46e5, #7c3aed);
                            border-radius: 2px;
                        }

                        /* Divider */
                        .divider {
                            height: 1px;
                            background: linear-gradient(90deg, rgba(79, 70, 229, 0.1), rgba(124, 58, 237, 0.4), rgba(79, 70, 229, 0.1));
                            margin: 1.5rem 0 2rem;
                        }

                        /* Question Box */
                        .question-box {
                            background: #fff;
                            border-radius: 12px;
                            overflow: hidden;
                        }

                        /* Progress Indicator */
                        .progress-indicator {
                            text-align: right;
                            color: #64748b;
                            font-size: 0.9rem;
                            font-weight: 500;
                            margin-bottom: 1.5rem;
                            background: #f8fafc;
                            padding: 0.6rem 1rem;
                            border-radius: 8px;
                            border: 1px solid #e2e8f0;
                            display: inline-block;
                        }

                        /* Question Content */
                        .question-content {
                            padding: 1.5rem 0;
                        }

                        /* Question Text */
                        h3 {
                            color: #1e293b;
                            font-size: 1.3rem;
                            line-height: 1.6;
                            margin-bottom: 1.8rem;
                            font-weight: 600;
                        }

                        /* Answer Options */
                        .radio-option {
                            display: block;
                            padding: 1.1rem 1.5rem;
                            margin-bottom: 0.8rem;
                            background: #f8fafc;
                            border: 1px solid #e2e8f0;
                            border-radius: 10px;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            position: relative;
                            padding-left: 3.2rem;
                            font-size: 1rem;
                            color: #334155;
                        }

                        .radio-option:hover {
                            background: #f1f5f9;
                            border-color: #cbd5e1;
                            transform: translateY(-1px);
                        }

                        .radio-option input[type="radio"] {
                            position: absolute;
                            opacity: 0;
                        }

                        .radio-option label {
                            display: inline;
                            padding: 0;
                            margin: 0;
                            cursor: pointer;
                            position: relative;
                            font-size: 1rem;
                            color: #334155;
                        }

                        .radio-custom {
                            position: absolute;
                            top: 50%;
                            left: 1.2rem;
                            transform: translateY(-50%);
                            width: 1.2rem;
                            height: 1.2rem;
                            border: 2px solid #cbd5e1;
                            border-radius: 50%;
                            background: #fff;
                            transition: all 0.2s ease;
                        }

                        input[type="radio"]:checked + .radio-custom {
                            background: #4f46e5;
                            border-color: #4f46e5;
                            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
                        }

                        input[type="radio"]:checked + .radio-custom::after {
                            content: '';
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 0.6rem;
                            height: 0.6rem;
                            background: white;
                            border-radius: 50%;
                        }

                        /* Buttons */
                        .btn-next, .btn-primary, .btn-secondary {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            padding: 0.9rem 2rem;
                            border-radius: 10px;
                            font-weight: 600;
                            font-size: 1rem;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            border: none;
                            margin-top: 1.5rem;
                            width: 100%;
                        }

                        .btn-next {
                            background: linear-gradient(135deg, #4f46e5, #7c3aed);
                            color: white;
                            box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
                        }

                        .btn-next:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
                        }

                        .btn-next:active {
                            transform: translateY(0);
                        }

                        /* Result Container */
                        .result-container {
                            text-align: center;
                            padding: 2rem 0;
                        }

                        .result-container h3 {
                            color: #4f46e5;
                            font-size: 1.5rem;
                            margin-bottom: 1.5rem;
                        }

                        .result-text {
                            font-size: 1.1rem;
                            color: #475569;
                            line-height: 1.7;
                            margin: 1.5rem 0;
                        }

                        .success-message {
                            color: #10b981;
                            font-weight: 500;
                            background: #ecfdf5;
                            padding: 1rem;
                            border-radius: 8px;
                            margin: 1.5rem 0;
                            display: inline-block;
                        }

                        .button-group {
                            display: flex;
                            gap: 1rem;
                            margin-top: 2rem;
                            justify-content: center;
                        }

                        .btn-primary {
                            background: #4f46e5;
                            color: white;
                            width: auto;
                            padding: 0.9rem 2rem;
                        }

                        .btn-primary:hover {
                            background: #4338ca;
                            transform: translateY(-2px);
                            box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3);
                        }

                        .btn-secondary {
                            background: white;
                            color: #4f46e5;
                            border: 1px solid #e2e8f0;
                            width: auto;
                            padding: 0.9rem 2rem;
                        }

                        .btn-secondary:hover {
                            background: #f8fafc;
                            border-color: #cbd5e1;
                            transform: translateY(-2px);
                        }

                        /* Loading State */
                        .loading {
                            text-align: center;
                            padding: 3rem 0;
                        }

                        .loading-spinner {
                            border: 3px solid rgba(79, 70, 229, 0.1);
                            border-top-color: #4f46e5;
                            border-radius: 50%;
                            width: 40px;
                            height: 40px;
                            animation: spin 1s linear infinite;
                            margin: 0 auto 1rem;
                        }

                        /* Error Message */
                        .error-message {
                            background: #fef2f2;
                            color: #dc2626;
                            padding: 1rem;
                            border-radius: 8px;
                            margin: 1rem 0;
                            text-align: center;
                            border: 1px solid #fecaca;
                        }

                        /* Animations */
                        @keyframes spin {
                            to { transform: rotate(360deg); }
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
                                font-size: 1.5rem;
                            }

                            .button-group {
                                flex-direction: column;
                                gap: 0.75rem;
                            }

                            .btn-primary, .btn-secondary {
                                width: 100%;
                                margin: 0;
                            }

                            h3 {
                                font-size: 1.2rem;
                            }

                            .radio-option {
                                padding: 1rem 1.2rem 1rem 3rem;
                                font-size: 0.95rem;
                                display: flex;
                                align-items: center;
                            }

                            .radio-option input[type="radio"] {
                                display: none;
                            }

                            .radio-option label {
                                display: inline;
                                padding: 0;
                                margin: 0;
                                cursor: pointer;
                                position: relative;
                                font-size: 1rem;
                                color: #334155;
                            }

                            .radio-option .radio-custom {
                                position: absolute;
                                top: 50%;
                                left: 1.2rem;
                                transform: translateY(-50%);
                                width: 1.2rem;
                                height: 1.2rem;
                                border: 2px solid #cbd5e1;
                                border-radius: 50%;
                                background: #fff;
                                transition: all 0.2s ease;
                            }

                            .radio-option input[type="radio"]:checked + .radio-custom {
                                background: #4f46e5;
                                border-color: #4f46e5;
                                box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
                            }

                            .radio-option input[type="radio"]:checked + .radio-custom::after {
                                content: '';
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                width: 0.6rem;
                                height: 0.6rem;
                                background: white;
                                border-radius: 50%;
                            }
                                            `}</style>

                    <div className="question-content">
                        <div className="progress-indicator">
                            {currentQuestionIndex < questions.length 
                                ? `Câu hỏi ${currentQuestionIndex + 1}/${questions.length}`
                                : 'Hoàn thành'}
                        </div>
                        {renderQuestionContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BaiLam;