import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserProfile } from '../api/userApi';

// Generate random CAPTCHA text
const generateCaptcha = () => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
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

    // State for form fields
    const [formData, setFormData] = useState({
        fullName: '',
        recipient: '',
        address: '',
        quitDate: '', 
        email: '',
    });

    // Generate new CAPTCHA
    const generateNewCaptcha = useCallback(() => {
        const newCaptcha = generateCaptcha();
        setCaptcha(newCaptcha);
        return newCaptcha;
    }, []);

    // Initialize CAPTCHA on component mount
    useEffect(() => {
        generateNewCaptcha();
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
                        // Pre-fill form with user data if available
                        setFormData(prev => ({
                            ...prev,
                            fullName: profile.fullName || '',
                            email: profile.email || '',
                            address: profile.address || '',
                            // Set quit date to today if user has no smoking history
                            quitDate: profile.quitDate || new Date().toISOString().split('T')[0]
                        }));
                    }
                }
            } catch (error) {
                console.error('Error loading user profile:', error);
            }
        };

        loadUserProfile();
    }, []);

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
            const requestData = {
                fullName: formData.fullName,
                email: formData.email,
                address: formData.address,
                quitDate: formData.quitDate,
                recipient: formData.recipient,
                updatedAt: new Date().toISOString()
            };

            // If user is logged in, include their ID
            if (userId) {
                requestData.userId = userId;
            }

            // First, check if user exists
            let response;
            try {
                // Try to update existing user or create new commitment
                response = await axios({
                    method: 'POST',
                    url: 'http://localhost:8080/api/commitments',
                    data: requestData,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            } catch (apiError) {
                console.error('API Error:', apiError);
                throw apiError;
            }

            if (response && response.status === 200) {
                // If user is not logged in but we have their email, save to local storage
                if (!userId && formData.email) {
                    const commitmentData = {
                        ...formData,
                        commitmentDate: new Date().toISOString(),
                        status: 'pending'
                    };
                    localStorage.setItem('userCommitment', JSON.stringify(commitmentData));
                }
                
                alert("Lời hứa của bạn đã được gửi thành công!");
                
                // If user is logged in, update their profile with the quit date
                if (userId) {
                    try {
                        await axios.put(`http://localhost:8080/api/users/${userId}`, {
                            quitDate: formData.quitDate,
                            status: 'active'
                        });
                    } catch (updateError) {
                        console.error('Error updating user profile:', updateError);
                    }
                }

                // Reset form but keep user data if they want to make another commitment
                setFormData(prev => ({
                    ...prev,
                    recipient: ''
                }));
                setCaptchaInput('');
                generateNewCaptcha();
                
                // Optionally navigate to a thank you page or dashboard
                // navigate('/thank-you');
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
        setFormData({
            fullName: '',
            recipient: '',
            address: '',
            quitDate: '',
            email: '',
            captcha: '',
        });
    };

    // Handle back button
    const handleGoBack = () => {
        navigate(-1); // Navigates back one step in the browser history
    };

    return (
        <>
            <style>{`
                /* Keep your CSS here */
                * {
                    box-sizing: border-box;
                }

                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                }

                .breadcrumb {
                    font-size: 14px;
                    margin-bottom: 15px;
                }

                .breadcrumb a {
                    text-decoration: none;
                    color: #000;
                }

                .breadcrumb span {
                    color: #a10000;
                    font-weight: bold;
                }

                h1 {
                    font-size: 24px;
                }

                .description {
                    font-size: 15px;
                    margin: 15px 0 30px 0;
                }

                .description b {
                    font-weight: bold;
                }

                .form-box {
                    border: 1px solid #ec8d1c;
                    border-radius: 6px;
                    display: flex;
                    overflow: hidden;
                    align-items: stretch;
                }

                .form-left,
                .form-right {
                    width: 50%;
                    padding: 20px;
                }

                .form-left {
                    background-color: #fff;
                }

                .form-right {
                    background-color: #f9f9f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .form-right img {
                    width: 70%;
                    height: 70%;
                    object-fit: cover;
                    border-radius: 20px;
                }

                .form-left h3 {
                    color: #a10000;
                    margin-bottom: 15px;
                }

                label {
                    display: block;
                    font-weight: bold;
                    margin-top: 10px;
                    font-size: 14px;
                }

                input[type="text"],
                input[type="email"],
                input[type="date"] {
                    width: 100%;
                    padding: 6px;
                    font-size: 14px;
                    margin-top: 4px;
                }

                .captcha-row {
                    display: flex;
                    align-items: center;
                    margin-top: 5px;
                }

                .captcha-row input[type="text"] {
                    width: 100px;
                    margin-right: 10px;
                }

                .buttons {
                    margin-top: 20px;
                }

                /* Nút quay lại ở góc trên phải */
                .back-button {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background-color: #a10000;
                    color: white;
                    padding: 8px 14px;
                    border: none;
                    border-radius: 20px;
                    font-size: 13px;
                    cursor: pointer;
                    z-index: 1000;
                }

                .back-button:hover {
                    background-color: #880000;
                }

                @media (max-width: 768px) {
                    .form-box {
                        flex-direction: column;
                    }

                    .form-left,
                    .form-right {
                        width: 100%;
                        padding: 15px;
                    }

                    .form-right img {
                        height: auto;
                        border-radius: 10px;
                    }

                    .back-button {
                        padding: 6px 10px;
                        font-size: 12px;
                        top: 5px;
                        right: 5px;
                    }
                }
            `}</style>

            {/* Back button */}
            <button className="back-button" onClick={handleGoBack}>← Quay lại</button>

            <div className="breadcrumb">
                <Link to="/">TRANG CHỦ</Link> / <Link to="/member">CÔNG CỤ HỖ TRỢ CAI THUỐC LÁ</Link> / <span>CAM KẾT CAI THUỐC</span>
            </div>

            <h1>Cam kết cai thuốc</h1>

            <div className="description">
                <p><b>Sự hỗ trợ từ gia đình, người thân & bạn bè</b> xung quanh là một điều vô cùng quan trọng giúp bạn chiến thắng được những khó khăn trong quá trình cai thuốc.</p>
                <p>Nếu đã quyết định cai thuốc, hãy chọn cho mình những người có thể giúp đỡ, động viên và có thể cùng bạn thực hiện kế hoạch cai thuốc. <b>Vquit sẽ giúp bạn gửi đến họ cam kết cai thuốc của bạn.</b></p>
            </div>

            <div className="form-box">
                <div className="form-left">
                    <h3>Lời hứa của tôi</h3>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="fullName">(*) Họ và tên</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="recipient">Gửi lời hứa tới</label>
                        <input
                            type="text"
                            id="recipient"
                            name="recipient"
                            value={formData.recipient}
                            onChange={handleChange}
                        />

                        <label htmlFor="address">Bạn sống ở đâu</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />

                        <label htmlFor="quitDate">(*) Ngày cai thuốc</label>
                        <input
                            type="date"
                            id="quitDate"
                            name="quitDate"
                            value={formData.quitDate}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="email">(*) Địa chỉ Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="captcha">Mã bảo vệ</label>
                        <div className="captcha-row">
                            <input
                                type="text"
                                id="captcha"
                                name="captcha"
                                value={captchaInput}
                                onChange={(e) => setCaptchaInput(e.target.value)}
                                required
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    marginRight: '10px'
                                }}
                                placeholder="Nhập mã bảo vệ"
                            />
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: '#f5f5f5',
                                padding: '0 10px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                minWidth: '100px',
                                justifyContent: 'center',
                                fontFamily: 'monospace',
                                fontSize: '18px',
                                letterSpacing: '2px',
                                cursor: 'pointer',
                                userSelect: 'none',
                                height: '38px',
                                backgroundColor: '#e9ecef'
                            }} 
                            onClick={handleRefreshCaptcha}
                            title="Nhấn để làm mới mã">
                                {captcha}
                            </div>
                        </div>

                        {error && (
                            <div style={{ color: 'red', margin: '10px 0', fontSize: '14px' }}>
                                {error}
                            </div>
                        )}
                        <div className="buttons">
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                style={{
                                    backgroundColor: isLoading ? '#cccccc' : '#a10000',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '8px 14px',
                                    marginRight: '10px',
                                    cursor: isLoading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isLoading ? 'Đang gửi...' : 'Gửi lời hứa của bạn'}
                            </button>
                            <button 
                                type="button" 
                                onClick={handleReset}
                                style={{
                                    backgroundColor: '#6c757d',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '8px 14px',
                                    cursor: 'pointer'
                                }}
                            >
                                Nhập lại
                            </button>
                        </div>
                    </form>
                </div>

                <div className="form-right">
                    <img src="/images1/battay.png" alt="Cam kết cai thuốc" />
                </div>
            </div>
        </>
    );
};

export default CamKet;