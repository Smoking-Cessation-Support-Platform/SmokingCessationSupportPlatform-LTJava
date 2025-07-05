import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserProfile, updateProfile, logout } from '../api/userApi';
import { getSmokingStats, getSmokingProgress, updateSmokingGoal, getUserSmokingHistory } from '../api/smokingDataApi';

const styles = {
    container: {
        width: '900px',
        margin: '30px auto',
        padding: '0 20px',
        flex: 1
    },
    section: {
        backgroundColor: 'white',
        border: '2px solid #007bff',
        borderRadius: '5px',
        padding: '20px',
        marginBottom: '20px'
    },
    headerFlex: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
    },
    userInfo: {
        label: {
            fontWeight: 'bold',
            display: 'block',
            marginTop: '10px'
        },
        input: {
            width: '100%',
            padding: '8px',
            marginTop: '5px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: '#f9f9f9'
        },
        inputReadOnly: {
            backgroundColor: '#e9ecef',
            cursor: 'not-allowed'
        },
        select: {
            width: '100%',
            padding: '8px',
            marginTop: '5px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: '#f9f9f9'
        },
        selectDisabled: {
            backgroundColor: '#e9ecef',
            cursor: 'not-allowed'
        }
    },
    btnGroup: {
        display: 'flex',
        gap: '10px',
        marginTop: '15px'
    },
    button: {
        padding: '10px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        minWidth: '120px'
    },
    btnSave: {
        backgroundColor: '#007bff',
        color: 'white'
    },
    btnCancel: {
        backgroundColor: '#ccc',
        color: '#333'
    },
    avatarWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '20px',
        flexWrap: 'wrap'
    },
    avatarPreview: {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundColor: '#ddd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    avatarUpload: {
        label: {
            cursor: 'pointer',
            color: '#007bff',
            border: '1px solid #007bff',
            padding: '6px 12px',
            borderRadius: '4px',
            userSelect: 'none',
            marginTop: '10px'
        }
    },
    card: {
        background: '#fff',
        borderRadius: '12px',
        padding: '20px',
        margin: '20px 0',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    cardList: {
        listStyle: 'none',
        paddingLeft: 0
    },
    cardListItem: {
        background: '#e0ffe0',
        margin: '5px 0',
        padding: '10px',
        borderRadius: '8px'
    },
    cardButton: {
        marginTop: '10px',
        padding: '8px 12px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#45a049'
        }
    }
};

const CaNhan = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [userProfile, setUserProfile] = useState({
        username: '',
        fullname: '',
        email: '',
        phone: '',
        address: '',
        gender: '',
        daysWithoutSmoking: 0,
        subscription: 'paid',
        active: false,
        avatar: ''
    });

    const [quitProfile, setQuitProfile] = useState({
        startDate: '--',
        daysQuit: '--',
        moneySaved: '--',
        healthImproved: '--',
        badges: []
    });

    const [smokingHistory, setSmokingHistory] = useState([]);
    const [smokingStats, setSmokingStats] = useState(null);
    const [smokingProgress, setSmokingProgress] = useState(null);

    const [calcForm, setCalcForm] = useState({
        cigarettesPerDay: '',
        cigarettesPerPack: '',
        pricePerPack: '',
        yearsOfSmoking: '',
    });
    const [calcResults, setCalcResults] = useState(null);

    useEffect(() => {
        loadUserProfile();
        loadQuitProfile();
        // Lấy dữ liệu từ bảng smoking_data
        const userId = localStorage.getItem('userId');
        if (userId) {
            getUserSmokingHistory(userId).then(setSmokingHistory);
            getSmokingStats(userId).then(setSmokingStats);
            getSmokingProgress(userId).then(setSmokingProgress);
        }
    }, []);

    const loadUserProfile = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (userId) {
                const dbProfile = await getUserProfile(userId);
                if (dbProfile) {
                    setUserProfile({
                        username: dbProfile.username || '',
                        fullname: dbProfile.fullName || '',
                        email: dbProfile.email || '',
                        phone: dbProfile.phone || '',
                        address: dbProfile.address || '',
                        gender: dbProfile.gender || '',
                        daysWithoutSmoking: dbProfile.daysWithoutSmoking || 0,
                        subscription: dbProfile.subscription || 'paid',
                        active: dbProfile.active || false,
                        avatar: dbProfile.avatar || ''
                    });
                    if (dbProfile.daysWithoutSmoking > 0) {
                        const startDate = new Date();
                        startDate.setDate(startDate.getDate() - dbProfile.daysWithoutSmoking);
                        localStorage.setItem('quitDate', startDate.toISOString().split('T')[0]);
                        loadQuitProfile();
                    }
                    // Lưu avatar vào localStorage để dùng offline (nếu có)
                    if (dbProfile.avatar) {
                        const savedProfile = localStorage.getItem('userProfile');
                        let localProfile = savedProfile ? JSON.parse(savedProfile) : {};
                        localProfile.avatar = dbProfile.avatar;
                        localStorage.setItem('userProfile', JSON.stringify(localProfile));
                    }
                    return;
                }
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const loadQuitProfile = () => {
        const quitDateStr = localStorage.getItem("quitDate");
        if (!quitDateStr) {
            return;
        }

        const quitDate = new Date(quitDateStr);
        const now = new Date();
        const diffTime = now - quitDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        const moneySaved = diffDays * 100000; // Assuming 100,000 VND saved per day

        let healthPercent = 0;
        if (diffDays >= 365) healthPercent = 100;
        else if (diffDays >= 180) healthPercent = 90;
        else if (diffDays >= 90) healthPercent = 75;
        else if (diffDays >= 30) healthPercent = 50;
        else if (diffDays >= 7) healthPercent = 20;
        else if (diffDays >= 1) healthPercent = 10;

        const badges = [];
        if (diffDays >= 1) badges.push("🎉 Bỏ thuốc 1 ngày");
        if (diffDays >= 7) badges.push("🏅 Bỏ thuốc 1 tuần");
        if (diffDays >= 30) badges.push("🥇 Bỏ thuốc 1 tháng");
        if (diffDays >= 90) badges.push("🎖️ Bỏ thuốc 3 tháng");
        if (diffDays >= 180) badges.push("🏆 Bỏ thuốc 6 tháng");
        if (diffDays >= 365) badges.push("💎 Bỏ thuốc 1 năm");

        setQuitProfile({
            startDate: quitDateStr,
            daysQuit: diffDays > 0 ? diffDays : 0,
            moneySaved: moneySaved.toLocaleString('vi-VN'),
            healthImproved: healthPercent,
            badges: badges.length > 0 ? badges : ['Chưa đạt huy hiệu nào']
        });
    };

    // Event handlers for user profile
    const handleEditMode = () => {
        setIsEditing(true);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('Kích thước ảnh không được vượt quá 2MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                alert('Vui lòng chọn file ảnh');
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64String = e.target.result;
                setUserProfile(prev => ({
                    ...prev,
                    avatar: base64String
                }));
                // Lưu avatar vào localStorage để dùng offline
                const savedProfile = localStorage.getItem('userProfile');
                let localProfile = savedProfile ? JSON.parse(savedProfile) : {};
                localProfile.avatar = base64String;
                localStorage.setItem('userProfile', JSON.stringify(localProfile));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
            if (!emailRegex.test(userProfile.email)) {
                alert('Email không hợp lệ');
                return;
            }
            const userId = localStorage.getItem('userId');
            if (userId) {
                const profileData = {
                    username: userProfile.username,
                    fullName: userProfile.fullname,
                    email: userProfile.email,
                    phone: userProfile.phone,
                    address: userProfile.address,
                    gender: userProfile.gender,
                    daysWithoutSmoking: userProfile.daysWithoutSmoking,
                    subscription: userProfile.subscription,
                    active: userProfile.active,
                    avatar: userProfile.avatar // Gửi avatar lên server
                };
                await updateProfile(userId, profileData);
                // Cập nhật localStorage sau khi lưu thành công
                localStorage.setItem('userProfile', JSON.stringify(userProfile));
        setIsEditing(false);
                alert('Lưu thông tin thành công!');
            }
        } catch (error) {
            if (error.message.includes('Email đã được sử dụng')) {
                alert('Email này đã được sử dụng bởi tài khoản khác');
            } else {
                console.error('Error saving profile:', error);
                alert('Có lỗi xảy ra khi lưu thông tin: ' + error.message);
            }
        }
    };

    const handleCancel = () => {
        const storedProfile = localStorage.getItem("userProfile");
        if (storedProfile) {
            setUserProfile(JSON.parse(storedProfile));
        }
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleQuitDateChange = () => {
        const dateInput = prompt("Nhập ngày bắt đầu cai thuốc (YYYY-MM-DD):", "");
        if (dateInput) {
            const date = new Date(dateInput);
            if (date.toString() === "Invalid Date") {
                alert("Ngày không hợp lệ, vui lòng nhập lại.");
                return;
            }
            localStorage.setItem("quitDate", dateInput);
            loadQuitProfile();
        }
    };

    const dangXuat = () => {
        logout();
        navigate("/");
    };

    // Hàm lấy avatar ưu tiên từ state, nếu không có thì lấy từ localStorage, nếu không có thì lấy mặc định
    const getAvatarSrc = (avatarPath) => {
        if (avatarPath && avatarPath.startsWith('data:image')) return avatarPath;
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            const localProfile = JSON.parse(savedProfile);
            if (localProfile.avatar && localProfile.avatar.startsWith('data:image')) return localProfile.avatar;
        }
        return 'images1/cainghien.jpeg';
    };

    const handleCalcInputChange = (e) => {
        const { name, value } = e.target;
        setCalcForm(prev => ({ ...prev, [name]: value }));
    };

    const calculateResults = () => {
        const {
            cigarettesPerDay,
            cigarettesPerPack,
            pricePerPack,
            yearsOfSmoking
        } = calcForm;
        const numCigarettesPerDay = parseFloat(cigarettesPerDay);
        const numCigarettesPerPack = parseFloat(cigarettesPerPack);
        const numPricePerPack = parseFloat(pricePerPack);
        const numYearsOfSmoking = parseFloat(yearsOfSmoking);
        if (
            isNaN(numCigarettesPerDay) ||
            isNaN(numCigarettesPerPack) ||
            isNaN(numPricePerPack) ||
            isNaN(numYearsOfSmoking) ||
            numCigarettesPerPack === 0
        ) return null;
        const cigarettesPerYear = numCigarettesPerDay * 365;
        const packsPerYear = cigarettesPerYear / numCigarettesPerPack;
        const costPerYear = packsPerYear * numPricePerPack;
        const totalCigarettes = cigarettesPerYear * numYearsOfSmoking;
        const totalCost = costPerYear * numYearsOfSmoking;
        const timeSpentSmoking = (numCigarettesPerDay * 5 * 365 * numYearsOfSmoking) / 60;
        return {
            cigarettesPerYear,
            packsPerYear,
            costPerYear,
            totalCigarettes,
            totalCost,
            timeSpentSmoking
        };
    };

    const handleCalcSubmit = (e) => {
        e.preventDefault();
        const results = calculateResults();
        setCalcResults(results);
    };

    return (
        <>
            <style>{`
                /* Giữ nguyên các CSS ở đây */
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
                a { text-decoration: none; color: inherit; }

                header {
                    background: #004d40;
                    color: white;
                    padding: 12px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .topbar-left { display: flex; align-items: center; gap: 10px; }
                .topbar-left img { height: 45px; }

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
                nav a:hover, .nav-active {
                    background: rgba(255,255,255,0.2);
                    border-radius: 4px;
                }

                .container {
                    width: 900px;
                    margin: 30px auto;
                    padding: 0 20px;
                    flex: 1;
                }

                .section {
                    background-color: white;
                    border: 2px solid #007bff;
                    border-radius: 5px;
                    padding: 20px;
                    margin-bottom: 20px;
                }

                .header-flex {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }

                .user-info label { font-weight: bold; display: block; margin-top: 10px; }
                .user-info input, .user-info select {
                    width: 100%;
                    padding: 8px;
                    margin-top: 5px;
                    border-radius: 4px;
                    border: 1px solid #ccc;
                    background-color: #f9f9f9;
                }
                .user-info input[readonly], .user-info select:disabled {
                    background-color: #e9ecef;
                    cursor: not-allowed;
                }

                .btn-group {
                    display: flex;
                    gap: 10px;
                    margin-top: 15px;
                }
                .btn-group > button {
                    padding: 10px 16px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    min-width: 120px;
                }
                .btn-save { background-color: #007bff; color: white; }
                .btn-cancel { background-color: #ccc; color: #333; }

                footer {
                    background:#004d40;
                    color:#fff;
                    padding:20px;
                    text-align:center;
                }

                .avatar-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                }
                .avatar-preview {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    overflow: hidden;
                    background-color: #ddd;
                    display: flex;
                    alignItems: center;
                    justifyContent: center;
                }
                .avatar-preview img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .avatar-upload label#chooseFileBtn {
                    cursor: pointer;
                    color: #007bff;
                    border: 1px solid #007bff;
                    padding: 6px 12px;
                    border-radius: 4px;
                    user-select: none;
                    margin-top: 10px;
                    display: none;
                }
                .avatar-upload input[type="file"] { display: none; }

                #menuIconWrapper {
                    position: fixed;
                    top: 16px;
                    right: 16px;
                    z-index: 1001;
                    display: block;
                    cursor: pointer;
                }
                .circle-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 2px solid red;
                    background-color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
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
                #sidebar.open { right: 0; }
                .sidebar-item {
                    padding: 12px 10px;
                    border-bottom: 1px solid #eee;
                    cursor: pointer;
                    color: #333;
                }
                .sidebar-item:hover { background-color: #f0f0f0; }
                #overlay {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: rgba(0,0,0,0.3);
                    display: none;
                    z-index: 999;
                }
                #overlay.show { display: block; }

                .card {
                    background: #fff;
                    border-radius: 12px;
                    padding: 20px;
                    margin: 20px 0;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                ul { list-style: none; padding-left: 0; }
                li {
                    background: #e0ffe0;
                    margin: 5px 0;
                    padding: 10px;
                    border-radius: 8px;
                }
                button {
                    margin-top: 10px;
                    padding: 8px 12px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #45a049;
                }
            `}</style>
            <header>
                <div className="topbar-left">
                    <img src="/images1/logo.jpg" alt="Logo CaiThuocTot.vn" />
                    <div><strong>CaiThuocTot.vn</strong> - Hành trình vì sức khỏe</div>
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

            <div style={styles.container}>
                <div style={styles.section}>
                    <div style={styles.headerFlex}>
                        <h3>Thông tin cá nhân</h3>
                        <button style={{...styles.button, ...styles.btnSave}} onClick={handleEditMode}>✏️ Chỉnh sửa</button>
                    </div>
                    <div style={styles.avatarWrapper}>
                        <div style={styles.avatarPreview}>
                            <img src={getAvatarSrc(userProfile.avatar)} alt="Avatar" style={styles.avatarImage} />
                        </div>
                        <div style={styles.avatarUpload}>
                            <label htmlFor="avatarInput" style={{
                                ...styles.avatarUpload.label,
                                display: isEditing ? 'inline-block' : 'none'
                            }}>
                                Chọn ảnh từ tệp
                            </label>
                            <input
                                type="file"
                                id="avatarInput"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                disabled={!isEditing}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={styles.userInfo.label}>Tên đăng nhập:</label>
                        <input
                            type="text"
                            name="username"
                            value={userProfile?.username}
                            readOnly={true}  // Username không được phép sửa
                            style={{
                                ...styles.userInfo.input,
                                ...styles.userInfo.inputReadOnly
                            }}
                        />

                        <label style={styles.userInfo.label}>Họ và tên:</label>
                        <input
                            type="text"
                            name="fullname"
                            value={userProfile?.fullname}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                            style={{
                                ...styles.userInfo.input,
                                ...(isEditing ? {} : styles.userInfo.inputReadOnly)
                            }}
                        />

                        <label style={styles.userInfo.label}>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={userProfile?.email}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                            style={{
                                ...styles.userInfo.input,
                                ...(isEditing ? {} : styles.userInfo.inputReadOnly)
                            }}
                        />

                        <label style={styles.userInfo.label}>Số điện thoại:</label>
                        <input
                            type="tel"
                            name="phone"
                            value={userProfile?.phone}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                            style={{
                                ...styles.userInfo.input,
                                ...(isEditing ? {} : styles.userInfo.inputReadOnly)
                            }}
                        />

                        <label style={styles.userInfo.label}>Địa chỉ:</label>
                        <input
                            type="text"
                            name="address"
                            value={userProfile?.address}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                            style={{
                                ...styles.userInfo.input,
                                ...(isEditing ? {} : styles.userInfo.inputReadOnly)
                            }}
                        />

                        <label style={styles.userInfo.label}>Giới tính:</label>
                        <select
                            name="gender"
                            value={userProfile?.gender}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            style={{
                                ...styles.userInfo.select,
                                ...(isEditing ? {} : styles.userInfo.selectDisabled)
                            }}
                        >
                            <option value="">-- Chọn giới tính --</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>

                        <label style={styles.userInfo.label}>Trạng thái tài khoản:</label>
                        <input
                            type="text"
                            value={userProfile?.active ? "Đã kích hoạt" : "Chưa kích hoạt"}
                            readOnly={true}
                            style={{
                                ...styles.userInfo.input,
                                ...styles.userInfo.inputReadOnly
                            }}
                        />

                        <label style={styles.userInfo.label}>Gói dịch vụ:</label>
                        <input
                            type="text"
                            value="Trả phí"
                            readOnly={true}
                            style={{
                                ...styles.userInfo.input,
                                ...styles.userInfo.inputReadOnly
                            }}
                        />

                        {isEditing && (
                            <div style={styles.btnGroup}>
                                <button style={{...styles.button, ...styles.btnSave}} onClick={handleSave}>💾 Lưu</button>
                                <button style={{...styles.button, ...styles.btnCancel}} onClick={handleCancel}>❌ Hủy</button>
                        </div>
                        )}
                    </div>

                    <div style={styles.card}>
                        <h3>📅 Hồ sơ cai thuốc của bạn</h3>
                        <p>Ngày bắt đầu: <span>{quitProfile.startDate}</span></p>
                        <p>Số ngày đã cai: <span>{quitProfile.daysQuit}</span> ngày</p>
                        <p>Số tiền tiết kiệm: <span>{quitProfile.moneySaved}</span> VNĐ</p>
                        <p>Phục hồi sức khỏe: <span>{quitProfile.healthImproved}</span>%</p>
                        
                        <h4>🎖️ Huy hiệu đạt được:</h4>
                        <ul style={styles.cardList}>
                            {quitProfile.badges.length > 0 ? (
                                quitProfile.badges.map((badge, index) => (
                                    <li key={index} style={styles.cardListItem}>{badge}</li>
                                ))
                            ) : (
                                <li style={styles.cardListItem}>Chưa đạt huy hiệu nào</li>
                            )}
                        </ul>
                        
                        <button style={styles.cardButton} onClick={handleQuitDateChange}>🔁 Chọn lại ngày cai thuốc</button>
                    </div>

                    {/* Form tính toán chi phí hút thuốc */}
                    <div style={styles.card}>
                        <h3>💸 Tính toán chi phí hút thuốc của bạn</h3>
                        <form onSubmit={handleCalcSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                            <input
                                type="number"
                                name="yearsOfSmoking"
                                placeholder="Số năm hút"
                                value={calcForm.yearsOfSmoking}
                                onChange={handleCalcInputChange}
                                required
                                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', width: 120 }}
                            />
                            <input
                                type="number"
                                name="cigarettesPerDay"
                                placeholder="Điếu/ngày"
                                value={calcForm.cigarettesPerDay}
                                onChange={handleCalcInputChange}
                                required
                                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', width: 120 }}
                            />
                            <input
                                type="number"
                                name="cigarettesPerPack"
                                placeholder="Điếu/gói"
                                value={calcForm.cigarettesPerPack}
                                onChange={handleCalcInputChange}
                                required
                                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', width: 120 }}
                            />
                            <input
                                type="number"
                                name="pricePerPack"
                                placeholder="Giá/gói (VNĐ)"
                                value={calcForm.pricePerPack}
                                onChange={handleCalcInputChange}
                                required
                                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', width: 140 }}
                            />
                            <button type="submit" style={{ padding: 8, borderRadius: 4, background: '#f28c00', color: 'white', border: 'none', minWidth: 80 }}>Tính toán</button>
                        </form>
                        {calcResults && (
                            <div style={{ marginTop: 16 }}>
                                <div><b>Tổng số điếu đã hút:</b> {calcResults.totalCigarettes.toLocaleString('vi-VN')}</div>
                                <div><b>Tổng số tiền đã tiêu:</b> {calcResults.totalCost.toLocaleString('vi-VN')} VNĐ</div>
                                <div><b>Tiết kiệm 1 năm nếu cai:</b> {calcResults.costPerYear.toLocaleString('vi-VN')} VNĐ</div>
                                <div><b>Tiết kiệm 5 năm nếu cai:</b> {(calcResults.costPerYear * 5).toLocaleString('vi-VN')} VNĐ</div>
                                <div><b>Tiết kiệm 10 năm nếu cai:</b> {(calcResults.costPerYear * 10).toLocaleString('vi-VN')} VNĐ</div>
                                <div><b>Thời gian đã dành cho hút thuốc:</b> {calcResults.timeSpentSmoking.toLocaleString('vi-VN')} giờ</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <footer>
                <p>© 2025 CaiThuocTot.vn - Bản quyền thuộc về nhóm phát triển</p>
                <p>Địa chỉ: 70 Đ. Tô Ký, Quận 12, TP.HCM | Email: nhubdq3680@ut.edu.vn</p>
            </footer>

            {/* Sidebar Menu */}
            <div id="menuIconWrapper" onClick={() => document.getElementById('sidebar').classList.add('open')}>
                <div className="circle-avatar">
                    <img id="menuIcon" src="images1/cainghien.jpeg" alt="Menu avatar" />
                </div>
            </div>
            <div id="overlay" onClick={() => document.getElementById('sidebar').classList.remove('open')}></div>
            <div id="sidebar">
                <div className="sidebar-item" onClick={() => navigate('/canhan')}>
                    👤 Trang cá nhân
                </div>
                <div className="sidebar-item" onClick={() => navigate('/member')}>
                    💬 Dịch vụ
                </div>
                <div className="sidebar-item" onClick={dangXuat}>
                    🚪 Đăng xuất
                </div>
            </div>
        </>
    );
};

export default CaNhan;