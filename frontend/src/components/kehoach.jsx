import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getQuitPlans, saveQuitPlans } from '../api/userApi';

const motivationalMessages = [
    { text: "Mỗi ngày không hút thuốc là một chiến thắng mới!", emoji: "🌟" },
    { text: "Bạn mạnh mẽ hơn cơn thèm thuốc!", emoji: "💪" },
    { text: "Hôm nay khó khăn, ngày mai sẽ dễ dàng hơn!", emoji: "🎯" },
    { text: "Vì một tương lai khỏe mạnh hơn!", emoji: "🌈" },
    { text: "Bạn đã chọn con đường đúng đắn!", emoji: "👊" }
];

const steps = {
    step1: {
        title: 'Xác định lý do',
        icon: '🎯',
        question: 'Lý do chính khiến bạn muốn cai thuốc là gì?',
        options: [
            { text: 'Vì sức khỏe bản thân', icon: '❤️' },
            { text: 'Vì người thân trong gia đình', icon: '👨‍👩‍👧‍👦' },
            { text: 'Vì lý do tài chính', icon: '💰' },
            { text: 'Vì áp lực xã hội', icon: '👥' },
            { text: 'Để có cuộc sống tốt đẹp hơn', icon: '✨' }
        ],
        notePrompt: 'Ghi chú thêm về lý do của bạn:',
        motivation: 'Lý do của bạn sẽ là động lực mạnh mẽ nhất!',
        multiple: false
    },
    step2: {
        title: 'Mức độ sẵn sàng',
        icon: '📊',
        question: 'Bạn đã sẵn sàng cai thuốc ở mức độ nào?',
        options: [
            { text: 'Hoàn toàn sẵn sàng và quyết tâm', level: 5 },
            { text: 'Khá sẵn sàng nhưng còn lo lắng', level: 4 },
            { text: 'Chưa chắc chắn nhưng muốn thử', level: 3 },
            { text: 'Cần thêm thời gian chuẩn bị', level: 2 },
            { text: 'Chỉ muốn giảm chứ chưa muốn cai hoàn toàn', level: 1 }
        ],
        notePrompt: 'Ghi chú về kế hoạch chuẩn bị:',
        motivation: 'Mọi hành trình đều bắt đầu từ một bước nhỏ!',
        multiple: false
    },
    step3: {
        title: 'Thói quen hút thuốc',
        icon: '⏰',
        question: 'Khi nào bạn thường có cảm giác thèm thuốc nhất?',
        options: [
            { text: 'Sau khi ăn', time: 'morning' },
            { text: 'Khi căng thẳng/stress', time: 'stress' },
            { text: 'Khi gặp gỡ bạn bè', time: 'social' },
            { text: 'Khi uống cà phê/rượu bia', time: 'drinking' },
            { text: 'Khi làm việc/học tập', time: 'working' }
        ],
        notePrompt: 'Ghi chú về các tình huống khác:',
        motivation: 'Hiểu rõ kẻ thù là nửa phần chiến thắng!',
        multiple: true
    },
    step4: {
        title: 'Phương pháp cai thuốc',
        icon: '📝',
        question: 'Bạn dự định sử dụng phương pháp nào để cai thuốc?',
        options: [
            { text: 'Cai thuốc hoàn toàn (cold turkey)', method: 'cold_turkey' },
            { text: 'Giảm dần số lượng điếu thuốc', method: 'gradual' },
            { text: 'Sử dụng nicotine thay thế', method: 'nicotine' },
            { text: 'Kết hợp với tư vấn chuyên gia', method: 'expert' },
            { text: 'Dùng thuốc kê đơn', method: 'medication' }
        ],
        notePrompt: 'Ghi chú về kế hoạch thực hiện:',
        motivation: 'Mỗi người có một con đường riêng để thành công!',
        multiple: true
    },
    step5: {
        title: 'Hệ thống hỗ trợ',
        icon: '👥',
        question: 'Ai sẽ là người hỗ trợ chính cho bạn?',
        options: [
            { text: 'Gia đình (vợ/chồng, cha mẹ)', support: 'family' },
            { text: 'Bạn bè thân thiết', support: 'friends' },
            { text: 'Đồng nghiệp', support: 'colleagues' },
            { text: 'Bác sĩ/chuyên gia', support: 'doctor' },
            { text: 'Nhóm hỗ trợ cai thuốc', support: 'support_group' }
        ],
        notePrompt: 'Ghi chú về cách họ có thể giúp bạn:',
        motivation: 'Bạn không đơn độc trong hành trình này!',
        multiple: true
    },
    step6: {
        title: 'Mục tiêu & Phần thưởng',
        icon: '🏆',
        question: 'Bạn sẽ thưởng cho bản thân như thế nào?',
        options: [
            { text: 'Mua món đồ yêu thích', reward: 'shopping' },
            { text: 'Đi du lịch/nghỉ dưỡng', reward: 'travel' },
            { text: 'Tiết kiệm cho mục tiêu lớn', reward: 'savings' },
            { text: 'Tham gia khóa học mới', reward: 'course' },
            { text: 'Tổ chức ăn mừng', reward: 'celebration' }
        ],
        notePrompt: 'Ghi chú về các mốc thưởng cụ thể:',
        motivation: 'Hãy tưởng thưởng cho những nỗ lực của bản thân!',
        multiple: true
    }
};

const KeHoach = () => {
    const navigate = useNavigate();
    // Sidebar, overlay, login state giống home.jsx
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(() => {
        return localStorage.getItem('token') !== null && localStorage.getItem('isMember') === 'true';
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Kế hoạch logic
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentMessage, setCurrentMessage] = useState(motivationalMessages[0]);
    const [answers, setAnswers] = useState({});
    const [notes, setNotes] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [currentStep, setCurrentStep] = useState('step1');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        const defaultAnswers = {};
        const defaultNotes = {};
        Object.keys(steps).forEach(key => {
            defaultAnswers[key] = '';
            defaultNotes[key] = '';
        });
        setAnswers(defaultAnswers);
        setNotes(defaultNotes);
        loadQuitPlans();
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
            setCurrentMessage(motivationalMessages[randomIndex]);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const loadQuitPlans = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const userId = localStorage.getItem('userId');
            if (!userId) {
                navigate('/login');
                return;
            }
            const plans = await getQuitPlans(userId);
            const newAnswers = {};
            const newNotes = {};
            if (Array.isArray(plans) && plans.length > 0) {
                plans.forEach(plan => {
                    const stepKey = `step${plan.stepNumber}`;
                    if (plan.personalNote) {
                        try {
                            const data = typeof plan.personalNote === 'string' 
                                ? JSON.parse(plan.personalNote) 
                                : plan.personalNote;
                            newAnswers[stepKey] = data.answer || '';
                            newNotes[stepKey] = data.note || '';
                        } catch (err) {
                            newNotes[stepKey] = String(plan.personalNote);
                        }
                    }
                });
            }
            setAnswers(prev => ({ ...prev, ...newAnswers }));
            setNotes(prev => ({ ...prev, ...newNotes }));
            setHasUnsavedChanges(false);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tải kế hoạch';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const handleAnswerChange = useCallback((stepKey, value) => {
        setAnswers(prev => ({ ...prev, [stepKey]: value }));
        setHasUnsavedChanges(true);
    }, []);
    const handleNoteChange = useCallback((step, e) => {
        const note = e.target.value;
        setNotes(prev => ({ ...prev, [step]: note }));
        setHasUnsavedChanges(true);
    }, []);
    const handleSave = useCallback(async () => {
        try {
            setIsSaving(true);
            setError(null);
            const userId = localStorage.getItem('userId');
            if (!userId) {
                navigate('/login');
                return;
            }
            const plans = Object.entries(steps).map(([key], index) => ({
                stepNumber: index + 1,
                stepDescription: steps[key].title,
                personalNote: JSON.stringify({
                    answer: answers[key] || '',
                    note: notes[key] || ''
                })
            }));
            await saveQuitPlans(userId, plans);
            setHasUnsavedChanges(false);
            alert('Kế hoạch đã được lưu thành công! 🎉\nHãy kiên trì thực hiện kế hoạch của bạn!');
            await loadQuitPlans();
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi lưu kế hoạch';
            setError(errorMessage);
            alert('Không thể lưu kế hoạch: ' + errorMessage);
        } finally {
            setIsSaving(false);
        }
    }, [answers, notes, navigate, loadQuitPlans]);
    const handleOptionSelect = useCallback((step, option) => {
        setAnswers(prev => ({
            ...prev,
            [step]: steps[step].multiple 
                ? (prev[step] || []).includes(option) 
                    ? prev[step].filter(item => item !== option)
                    : [...(prev[step] || []), option]
                : option
        }));
        setHasUnsavedChanges(true);
    }, []);
    const handleGoToStep = useCallback((step) => {
        setCurrentStep(step);
        window.scrollTo(0, 0);
    }, []);
    // Sidebar/overlay logic
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const goTo = (path) => { navigate(path); setIsSidebarOpen(false); };
    const dangXuat = () => {
        if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('isMember');
            localStorage.removeItem('username');
            setIsUserLoggedIn(false);
            setIsSidebarOpen(false);
            navigate("/");
        }
    };
    // Progress
    const progressPercentage = useMemo(() => {
        const completedSteps = Object.values(answers).filter(Boolean).length;
        return (completedSteps / Object.keys(steps).length) * 100;
    }, [answers]);
    // Render step content
    const renderStepContent = useCallback((step) => {
        const stepData = steps[step];
        const currentAnswer = answers[step];
        const currentNote = notes[step] || '';
        return (
            <div className="step-content">
                <h2>{stepData.question}</h2>
                <div className="options-grid">
                    {stepData.options.map((option, index) => {
                        const optionText = option.text || option;
                        const isSelected = stepData.multiple
                            ? (currentAnswer || []).includes(optionText)
                            : currentAnswer === optionText;
                        return (
                            <button
                                key={index}
                                className={`option-btn ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleOptionSelect(step, optionText)}
                            >
                                {option.icon && <span className="option-icon">{option.icon}</span>}
                                {optionText}
                            </button>
                        );
                    })}
                </div>
                <div className="notes-section">
                    <label htmlFor={`notes-${step}`}>{stepData.notePrompt}</label>
                    <textarea
                        id={`notes-${step}`}
                        value={currentNote}
                        onChange={(e) => handleNoteChange(step, e)}
                        placeholder="Nhập ghi chú của bạn..."
                        rows="3"
                    />
                </div>
                <div className="motivation-text">{stepData.motivation}</div>
            </div>
        );
    }, [answers, notes]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Đang tải kế hoạch của bạn...</p>
            </div>
        );
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
                nav .nav-link {
                    color: #fff;
                    margin: 0 10px;
                    padding: 6px 12px;
                    font-weight: bold;
                    transition: background 0.3s;
                }
                nav .nav-link:hover {
                    background: rgba(255,255,255,0.2);
                    border-radius: 4px;
                }
                .container {
                    max-width: 960px;
                    margin: 0 auto;
                    background: white;
                    padding: 30px;
                    border-radius: 16px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                    margin-top: 2rem;
                    margin-bottom: 2rem;
                }
                .loading-container {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                }
                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #d84315;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 15px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .motivational-banner {
                    background: linear-gradient(135deg, #22c55e 0%, #059669 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 12px;
                    margin-bottom: 30px;
                    text-align: center;
                    font-size: 1.25em;
                    font-weight: 500;
                    box-shadow: 0 4px 6px rgba(34, 197, 94, 0.2);
                    animation: fadeInOut 10s infinite;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translateY(-10px); }
                    10% { opacity: 1; transform: translateY(0); }
                    90% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(10px); }
                }
                .step-navigation {
                    display: flex;
                    justify-content: center;
                    gap: 18px;
                    margin-bottom: 32px;
                }
                .step-dot {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                    padding: 0 8px;
                }
                .step-dot .step-number {
                    background: linear-gradient(135deg, #d84315 0%, #ea580c 100%);
                    color: #fff;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1em;
                    font-weight: 600;
                    margin-bottom: 4px;
                    box-shadow: 0 2px 4px rgba(216, 67, 21, 0.3);
                }
                .step-dot.active .step-number, .step-dot.completed .step-number {
                    background: linear-gradient(135deg, #ff9800 0%, #43e97b 100%);
                    box-shadow: 0 4px 12px rgba(255,152,0,0.15);
                }
                .step-dot .step-title {
                    font-size: 0.95em;
                    color: #333;
                    font-weight: 500;
                    text-align: center;
                }
                .step-dot.active .step-title {
                    color: #ff9800;
                }
                .step-dot:hover {
                    transform: translateY(-2px) scale(1.07);
                }
                .step-content {
                    background: #f8fafc;
                    border-radius: 16px;
                    padding: 32px 24px 24px 24px;
                    box-shadow: 0 2px 12px rgba(67,233,123,0.07);
                    margin-bottom: 18px;
                }
                .step-content h2 {
                    color: #ff9800;
                    margin-bottom: 18px;
                    font-size: 1.4em;
                    font-weight: 700;
                }
                .options-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 16px;
                    margin-bottom: 18px;
                    justify-content: center;
                }
                .option-btn {
                    background: #fff;
                    border: 2px solid #e0e0e0;
                    border-radius: 12px;
                    padding: 14px 22px;
                    font-size: 1.1em;
                    font-weight: 500;
                    color: #333;
                    cursor: pointer;
                    transition: background 0.2s, border 0.2s, color 0.2s, box-shadow 0.2s;
                    min-width: 160px;
                    box-shadow: 0 1.5px 6px rgba(67,233,123,0.06);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .option-btn.selected {
                    background: linear-gradient(90deg, #43e97b 0%, #ff9800 100%);
                    color: #fff;
                    border-color: #ff9800;
                    box-shadow: 0 4px 12px rgba(255,152,0,0.13);
                }
                .option-btn:hover {
                    border-color: #43e97b;
                    color: #43e97b;
                }
                .option-icon {
                    font-size: 1.3em;
                }
                .notes-section label {
                    font-weight: 500;
                    color: #43e97b;
                }
                .notes-section textarea {
                    width: 100%;
                    min-height: 80px;
                    resize: vertical;
                    padding: 12px;
                    border: 2px solid #e0e0e0;
                    border-radius: 12px;
                    font-family: inherit;
                    font-size: 1em;
                    margin-top: 10px;
                    transition: border 0.2s, box-shadow 0.2s;
                }
                .notes-section textarea:focus {
                    outline: none;
                    border-color: #43e97b;
                    box-shadow: 0 0 0 3px rgba(67,233,123,0.10);
                }
                .motivation-text {
                    color: #43e97b;
                    font-style: italic;
                    margin: 15px 0 0 0;
                    padding: 14px;
                    background: linear-gradient(90deg, #e0f7fa 0%, #fffde7 100%);
                    border-radius: 12px;
                    text-align: center;
                    font-size: 1.08em;
                    box-shadow: 0 2px 4px rgba(67,233,123,0.07);
                }
                .step-actions {
                    display: flex;
                    justify-content: center;
                    gap: 18px;
                    margin-top: 18px;
                }
                .btn {
                    padding: 13px 32px;
                    border-radius: 12px;
                    font-size: 1.1em;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    transition: background 0.2s, box-shadow 0.2s, color 0.2s;
                    box-shadow: 0 2px 8px rgba(67,233,123,0.08);
                }
                .btn-primary {
                    background: linear-gradient(90deg, #43e97b 0%, #ff9800 100%);
                    color: #fff;
                }
                .btn-primary:hover {
                    background: linear-gradient(90deg, #ff9800 0%, #43e97b 100%);
                }
                .btn-outline {
                    background: #fff;
                    color: #43e97b;
                    border: 2px solid #43e97b;
                }
                .btn-outline:hover {
                    background: #43e97b;
                    color: #fff;
                }
                .btn-success {
                    background: linear-gradient(90deg, #43e97b 0%, #ff9800 100%);
                    color: #fff;
                }
                .btn-success:hover {
                    background: linear-gradient(90deg, #ff9800 0%, #43e97b 100%);
                }
                .error-message {
                    background: #fff3e0;
                    border: 1.5px solid #ff9800;
                    color: #ff9800;
                    padding: 15px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 500;
                }
                .error-icon {
                    font-size: 1.2em;
                }
                .dismiss-button {
                    margin-left: auto;
                    background: none;
                    border: none;
                    color: #ff9800;
                    cursor: pointer;
                    font-size: 1.2em;
                    padding: 0 5px;
                }
                #menuIconWrapper {
                    position: fixed;
                    top: 16px;
                    right: 16px;
                    z-index: 1001;
                    display: block !important;
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
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                .circle-avatar:hover {
                    transform: scale(1.05);
                    transition: transform 0.2s ease;
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
                }
                #sidebar.open {
                    right: 0;
                }
                .sidebar-item {
                    padding: 12px 10px;
                    border-bottom: 1px solid #eee;
                    cursor: pointer;
                    font-size: 16px;
                    user-select: none;
                }
                .sidebar-item:hover {
                    background-color: #f26522;
                    color: white;
                    border-radius: 4px;
                }
                #overlay {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: rgba(0,0,0,0.3);
                    display: none;
                    z-index: 999;
                }
                #overlay.show {
                    display: block;
                }
                footer {
                    background:#004d40;
                    color:#fff;
                    padding:20px;
                    text-align:center;
                    front-size: 16px;
                }
            `}</style>
            <header>
                <div className="topbar">
                    <div className="topbar-left">
                        <img src="/images1/logo.jpg" alt="Logo CaiThuocTot.vn" />
                        <div><strong>CaiThuocTot.vn</strong> - Hành trình vì sức khỏe</div>
                    </div>
                    {isUserLoggedIn && (
                        <div id="menuIconWrapper">
                            <div className="circle-avatar" onClick={toggleSidebar}>
                                <img id="menuIcon" src="/images1/cainghien.jpeg" alt="Menu người dùng" />
                            </div>
                        </div>
                    )}
                </div>
            </header>
            <nav>
                <Link to="/" className="nav-link">Trang chủ</Link>
                <Link to="/gioithieu" className="nav-link">Về chúng tôi</Link>
                <Link to="/huongdancaithuoc" className="nav-link">Hướng dẫn cai thuốc</Link>
                <Link to="/tuvan" className="nav-link">Dịch vụ</Link>
                <Link to="/huanluyenvien_home" className="nav-link">Dành cho huấn luyện viên</Link>
                <Link to="/blog" className="nav-link">Câu chuyện thành công</Link>
                <Link to="/lienhe" className="nav-link">Liên hệ</Link>
            </nav>
            <main>
                <div className="container">
                    <button 
                        className="btn btn-outline" 
                        style={{ marginBottom: 20 }} 
                        onClick={() => navigate('/member')}
                    >
                        ← Quay lại 
                    </button>
                    <div className="motivational-banner">
                        <span className="emoji">{currentMessage.emoji}</span>
                        <p className="message" style={{ margin: 0 }}>{currentMessage.text}</p>
                    </div>
                    <div className="step-navigation">
                        {Object.keys(steps).map((step, index) => (
                            <div 
                                key={step} 
                                className={`step-dot ${currentStep === step ? 'active' : ''} ${answers[step] ? 'completed' : ''}`}
                                onClick={() => handleGoToStep(step)}
                                title={steps[step].title}
                            >
                                <span className="step-number">{index + 1}</span>
                                <span className="step-title">{steps[step].title}</span>
                            </div>
                        ))}
                    </div>
                    <h2>📝 Kế hoạch cai thuốc của bạn</h2>
                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            <span>{error}</span>
                            <button 
                                className="dismiss-button" 
                                onClick={() => setError(null)}
                                aria-label="Đóng thông báo lỗi"
                            >
                                &times;
                            </button>
                        </div>
                    )}
                    <div className="step-content-wrapper">
                        {renderStepContent(currentStep)}
                    </div>
                    <div className="step-actions">
                        {currentStep !== 'step1' && (
                            <button 
                                className="btn btn-outline"
                                onClick={() => handleGoToStep(`step${parseInt(currentStep.replace('step', '')) - 1}`)}
                            >
                                Quay lại
                            </button>
                        )}
                        {currentStep !== `step${Object.keys(steps).length}` ? (
                            <button 
                                className="btn btn-primary"
                                onClick={() => handleGoToStep(`step${parseInt(currentStep.replace('step', '')) + 1}`)}
                                disabled={!answers[currentStep] || (Array.isArray(answers[currentStep]) && answers[currentStep].length === 0)}
                            >
                                Tiếp theo
                            </button>
                        ) : (
                            <button 
                                className="btn btn-success"
                                onClick={handleSave}
                                disabled={isSaving || !hasUnsavedChanges}
                            >
                                {isSaving ? 'Đang lưu...' : 'Lưu kế hoạch'}
                            </button>
                        )}
                    </div>
                </div>
            </main>
            <footer>
                <p>© 2025 CaiThuocTot.vn - Bản quyền thuộc về nhóm phát triển</p>
                <p>Địa chỉ: 70 Đ. Tô Ký, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh | Email: nhubdq3680@ut.edu.vn | Hotline: 0364155024</p>
            </footer>
            {/* Sidebar và overlay */}
            {isUserLoggedIn && (
                <>
                    <div id="overlay" className={isSidebarOpen ? 'show' : ''} onClick={toggleSidebar}></div>
                    <div id="sidebar" className={isSidebarOpen ? 'open' : ''}>
                        <div className="sidebar-item" onClick={() => goTo('/canhan')}>
                            👤 Trang cá nhân
                        </div>
                        <div className="sidebar-item" onClick={() => goTo('/member')}>
                            💬 Dịch vụ khách hàng
                        </div>
                        <div className="sidebar-item" onClick={dangXuat}>
                            🚪 Đăng xuất
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default KeHoach;