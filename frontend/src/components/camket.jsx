import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { vi } from 'date-fns/locale';
import { getUserProfile } from '../api/userApi';

// Generate random CAPTCHA text
const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += chars[Math.floor(Math.random() * chars.length)];
    }
    return captcha;
};

const CamKet = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [userProfile, setUserProfile] = useState(null);
    const [captcha, setCaptcha] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [quitDate, setQuitDate] = useState(new Date());

    // State for form fields
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        quitDate: '',
        email: '',
        commitmentText: 'Tôi cam kết sẽ bỏ thuốc lá vì sức khỏe của bản thân và những người thân yêu!',
    });

    // Format date to dd/mm/yyyy
    const formatDate = (date) => {
        if (!date) return '';
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Generate new CAPTCHA
    const generateNewCaptcha = useCallback(() => {
        const newCaptcha = generateCaptcha();
        setCaptcha(newCaptcha);
        return newCaptcha;
    }, []);

    // Initialize CAPTCHA and date on component mount
    useEffect(() => {
        generateNewCaptcha();
        setFormData(prev => ({
            ...prev,
            quitDate: formatDate(new Date())
        }));
    }, [generateNewCaptcha]);

    // Load user profile on component mount
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (userId) {
                    const profile = await getUserProfile(userId);
                    if (profile) {
                        setUserProfile(profile);
                        const userQuitDate = profile.quitDate ? new Date(profile.quitDate) : new Date();
                        setQuitDate(userQuitDate);
                        setFormData(prev => ({
                            ...prev,
                            fullName: profile.fullName || '',
                            email: profile.email || '',
                            address: profile.address || '',
                            quitDate: formatDate(userQuitDate)
                        }));
                    }
                }
            } catch (error) {
                console.error('Error loading user profile:', error);
            }
        };

        loadUserProfile();
    }, []);

    // Handle date change
    const handleDateChange = (date) => {
        setQuitDate(date);
        setFormData(prev => ({
            ...prev,
            quitDate: formatDate(date)
        }));
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle CAPTCHA refresh
    const handleRefreshCaptcha = (e) => {
        e.preventDefault();
        generateNewCaptcha();
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!formData.fullName || !formData.quitDate || !formData.email) {
            setError("Vui lòng điền đầy đủ các trường bắt buộc (*).");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Vui lòng nhập địa chỉ email hợp lệ.");
            return;
        }

        // CAPTCHA validation
        if (captchaInput !== captcha) {
            setError("Mã bảo vệ không chính xác. Vui lòng thử lại.");
            generateNewCaptcha();
            setCaptchaInput('');
            return;
        }

        setIsLoading(true);

        try {
            const userId = localStorage.getItem('userId');
            
            // Xử lý ngày để tránh bị thụt lùi
            const localDate = new Date(quitDate);
            const offset = localDate.getTimezoneOffset();
            localDate.setMinutes(localDate.getMinutes() - offset);
            
            const requestData = {
                fullName: formData.fullName,
                email: formData.email,
                address: formData.address,
                quitDate: localDate.toISOString().split('T')[0] + 'T00:00:00.000Z',
                commitmentText: formData.commitmentText,
            };

            if (userId) {
                requestData.userId = userId;
            }

            const response = await axios({
                method: 'POST',
                url: 'http://localhost:8080/api/commitments',
                data: requestData,
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response && response.status === 200) {
                if (!userId && formData.email) {
                    const commitmentData = {
                        ...formData,
                        commitmentDate: new Date().toISOString(),
                        status: 'pending'
                    };
                    localStorage.setItem('userCommitment', JSON.stringify(commitmentData));
                }
                
                alert("Lời hứa của bạn đã được gửi thành công!");
                
                if (userId) {
                    try {
                        await axios.put(`http://localhost:8080/api/users/${userId}`, {
                            quitDate: requestData.quitDate,
                            status: 'active'
                        });
                    } catch (updateError) {
                        console.error('Error updating user profile:', updateError);
                    }
                }

                setCaptchaInput('');
                generateNewCaptcha();
                
                navigate('/canhan');
            }
        } catch (err) {
            console.error('Error in form submission:', err);
            const errorMessage = err.response?.data?.message 
                ? `Lỗi: ${err.response.data.message}` 
                : 'Có lỗi xảy ra khi gửi cam kết. Vui lòng thử lại sau.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle reset button
    const handleReset = () => {
        const resetDate = userProfile?.quitDate ? new Date(userProfile.quitDate) : new Date();
        setQuitDate(resetDate);
        setFormData({
            fullName: userProfile?.fullName || '',
            address: userProfile?.address || '',
            quitDate: formatDate(resetDate),
            email: userProfile?.email || '',
            commitmentText: 'Tôi cam kết sẽ bỏ thuốc lá vì sức khỏe của bản thân và những người thân yêu!',
        });
        setCaptchaInput('');
        generateNewCaptcha();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('isMember');
        navigate('/login');
    };

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

                footer {
                    background: #004d40;
                    color: #fff;
                    padding: 20px;
                    text-align: center;
                    margin-top: auto;
                    front-size: 16px;
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

                /* Commitment Container Styles */
                :root {
                    --primary-color: #e74c3c;
                    --secondary-color: #2c3e50;
                    --accent-color: #3498db;
                    --light-color: #ecf0f1;
                    --dark-color: #34495e;
                    --success-color: #27ae60;
                    --warning-color: #f39c12;
                    --error-color: #e74c3c;
                }

                .commitment-container {
                    max-width: 1200px;
                    margin: 40px auto;
                    padding: 20px;
                    position: relative;
                    flex-grow: 1;
                }

                .back-button {
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
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .back-button:hover {
                    background: linear-gradient(135deg, #00796b 0%, #00695c 100%);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
                    transform: translateY(-2px);
                }

                .back-button:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }

                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 2rem;
                }

                h1 {
                    color: var(--primary-color);
                    font-size: 2.5rem;
                    margin-bottom: 0;
                    font-weight: 700;
                }

                .subtitle {
                    font-size: 1.1rem;
                    color: var(--dark-color);
                    max-width: 800px;
                    margin: 20px auto 30px;
                }

                .commitment-card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    display: flex;
                    margin-bottom: 30px;
                }

                .form-section {
                    flex: 1;
                    padding: 40px;
                }

                .image-section {
                    flex: 1;
                    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 30px;
                }

                .image-section img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }

                .form-title {
                    color: var(--primary-color);
                    font-size: 1.8rem;
                    margin-bottom: 25px;
                    font-weight: 600;
                    position: relative;
                    padding-bottom: 10px;
                }

                .form-title::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 60px;
                    height: 3px;
                    background-color: var(--primary-color);
                }

                .form-group {
                    margin-bottom: 20px;
                }

                label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: var(--dark-color);
                    font-size: 0.95rem;
                }

                label.required::after {
                    content: ' *';
                    color: var(--primary-color);
                }

                input[type="text"],
                input[type="email"],
                textarea,
                .react-datepicker-wrapper input {
                    width: 100%;
                    padding: 12px 15px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 1rem;
                    transition: all 0.3s;
                }

                input:focus,
                textarea:focus,
                .react-datepicker-wrapper input:focus {
                    outline: none;
                    border-color: var(--accent-color);
                    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
                }

                textarea {
                    min-height: 100px;
                    resize: vertical;
                }

                /* DatePicker styles */
                .react-datepicker {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    border-radius: 8px;
                    border-color: #ddd;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }

                .react-datepicker__header {
                    background-color: #f5f7fa;
                    border-bottom: none;
                    border-radius: 8px 8px 0 0;
                }

                .react-datepicker__current-month {
                    color: var(--primary-color);
                    font-weight: 600;
                }

                .react-datepicker__day--selected {
                    background-color: var(--primary-color);
                    border-radius: 50%;
                }

                .react-datepicker__day--selected:hover {
                    background-color: #c0392b;
                }

                .react-datepicker__day--keyboard-selected {
                    background-color: var(--accent-color);
                    border-radius: 50%;
                }

                .react-datepicker__navigation {
                    top: 15px;
                }

                .captcha-container {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .captcha-input {
                    flex: 1;
                }

                .captcha-display {
                    background: var(--light-color);
                    padding: 10px 15px;
                    border-radius: 6px;
                    font-family: 'Courier New', monospace;
                    font-size: 1.2rem;
                    letter-spacing: 3px;
                    user-select: none;
                    cursor: pointer;
                    transition: all 0.3s;
                    text-align: center;
                    min-width: 120px;
                }

                .captcha-display:hover {
                    background: #dfe6e9;
                }

                .button-group {
                    display: flex;
                    gap: 15px;
                    margin-top: 30px;
                }

                .btn {
                    padding: 12px 25px;
                    border: none;
                    border-radius: 6px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }

                .btn-primary {
                    background-color: var(--primary-color);
                    color: white;
                }

                .btn-primary:hover {
                    background-color: #c0392b;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
                }

                .btn-secondary {
                    background-color: var(--light-color);
                    color: var(--dark-color);
                }

                .btn-secondary:hover {
                    background-color: #bdc3c7;
                    transform: translateY(-2px);
                }

                .btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none !important;
                }

                .error-message {
                    color: var(--error-color);
                    background-color: rgba(231, 76, 60, 0.1);
                    padding: 10px 15px;
                    border-radius: 6px;
                    margin-top: 15px;
                    font-size: 0.9rem;
                    border-left: 3px solid var(--error-color);
                }

                .loading-spinner {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s ease-in-out infinite;
                    margin-right: 10px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .motivation-quote {
                    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    margin-top: 30px;
                    text-align: center;
                    font-style: italic;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }

                @media (max-width: 992px) {
                    .commitment-card {
                        flex-direction: column;
                    }

                    .image-section {
                        order: -1;
                        padding: 20px;
                    }

                    .form-section {
                        padding: 30px;
                    }
                }

                @media (max-width: 768px) {
                    .header {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    h1 {
                        font-size: 2rem;
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

            <div className="commitment-container">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Quay lại
                </button>

                <div className="header">
                    <h1>Cam Kết Cai Thuốc Lá</h1>
                    <p className="subtitle">
                        Sự hỗ trợ từ gia đình và bạn bè là yếu tố quan trọng giúp bạn vượt qua khó khăn trong quá trình cai thuốc. 
                        Hãy tạo lời hứa chính thức để tự động viên bản thân và nhận sự ủng hộ từ người thân!
                    </p>
                </div>

                <div className="commitment-card">
                    <div className="form-section">
                        <h2 className="form-title">Lời Hứa Cai Thuốc</h2>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="fullName" className="required">Họ và tên</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Nhập họ tên đầy đủ"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Địa chỉ</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Nhập địa chỉ nơi bạn sống"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="quitDate" className="required">Ngày bắt đầu cai thuốc</label>
                                <DatePicker
                                    selected={quitDate}
                                    onChange={handleDateChange}
                                    dateFormat="dd/MM/yyyy"
                                    locale={vi}
                                    id="quitDate"
                                    name="quitDate"
                                    placeholderText="Chọn ngày"
                                    showYearDropdown
                                    dropdownMode="select"
                                    minDate={new Date(1900, 0, 1)}
                                    maxDate={new Date(2100, 11, 31)}
                                    className="date-picker-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="required">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="commitmentText">Lời hứa của bạn</label>
                                <textarea
                                    id="commitmentText"
                                    name="commitmentText"
                                    value={formData.commitmentText}
                                    onChange={handleChange}
                                    placeholder="Viết lời hứa với bản thân hoặc người thân..."
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="captcha" className="required">Mã xác nhận</label>
                                <div className="captcha-container">
                                    <input
                                        type="text"
                                        id="captcha"
                                        name="captcha"
                                        className="captcha-input"
                                        value={captchaInput}
                                        onChange={(e) => setCaptchaInput(e.target.value)}
                                        placeholder="Nhập mã bên cạnh"
                                        required
                                    />
                                    <div 
                                        className="captcha-display"
                                        onClick={handleRefreshCaptcha}
                                        title="Nhấn để làm mới mã"
                                    >
                                        {captcha}
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}

                            <div className="button-group">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading && <span className="loading-spinner"></span>}
                                    {isLoading ? 'Đang gửi...' : 'Gửi Lời Hứa'}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={handleReset}
                                >
                                    Nhập Lại
                                </button>
                            </div>
                        </form>

                        <div className="motivation-quote">
                            "Mỗi ngày không hút thuốc lá là một ngày bạn đang đầu tư cho sức khỏe và hạnh phúc tương lai của chính mình!"
                        </div>
                    </div>

                    <div className="image-section">
                        <img 
                            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                            alt="Người đàn ông quyết tâm cai thuốc lá"
                            onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
                            }}
                        />
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

export default CamKet;