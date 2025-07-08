import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserProfile, updateProfile, logout, getAddictionLevel, getCommitments, getQuitPlans } from '../api/userApi';
import { getUserSmokingHistory } from '../api/smokingDataApi';

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
        healthImproved: '--',
        healthDescription: '',
        badges: []
    });

    const [smokingHistory, setSmokingHistory] = useState([]);
    
    // State for cost calculator
    const [calcForm, setCalcForm] = useState({
        cigarettesPerDay: '',
        cigarettesPerPack: '',
        pricePerPack: '',
        yearsOfSmoking: '',
    });
    const [calcResults, setCalcResults] = useState(null);

    const [addictionInfo, setAddictionInfo] = useState({
        level: '',
        score: 0,
        lastAssessmentDate: '',
        recommendations: []
    });

    const [commitments, setCommitments] = useState([]);
    const [error, setError] = useState('');
    const [quitPlans, setQuitPlans] = useState([]);

    useEffect(() => {
        loadUserProfile();
        loadQuitProfile();
        loadAddictionInfo();
        loadCommitments();
        loadQuitPlans();
        const userId = localStorage.getItem('userId');
        if (userId) {
            getUserSmokingHistory(userId).then(setSmokingHistory);
        }

        // Thêm event listener để tải lại dữ liệu khi tab được focus
        const handleFocus = () => {
            loadCommitments();
            loadQuitProfile();
        };

        window.addEventListener('focus', handleFocus);

        // Cleanup
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    const loadUserProfile = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (userId) {
                const dbProfile = await getUserProfile(userId);
                if (dbProfile) {
                    console.log('User profile loaded:', JSON.stringify(dbProfile, null, 2)); // Debug log chi tiết
                    
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
                    
                    // Always try to get the quit date from the server first
                    if (dbProfile.quitDate) {
                        console.log('Using quit date from server:', dbProfile.quitDate);
                        localStorage.setItem('quitDate', dbProfile.quitDate);
                    } 
                    // If no quit date but we have daysWithoutSmoking, calculate it
                    else if (dbProfile.daysWithoutSmoking > 0) {
                        const startDate = new Date();
                        startDate.setDate(startDate.getDate() - dbProfile.daysWithoutSmoking);
                        const formattedDate = startDate.toISOString().split('T')[0];
                        console.log('Calculated quit date:', formattedDate);
                        localStorage.setItem('quitDate', formattedDate);
                    }
                    
                    // Always load the quit profile after setting the date
                    loadQuitProfile();
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

    const loadQuitProfile = async () => {
        console.log('Loading quit profile...');
        
        try {
            // First try to get the quit date from the database
            const userId = localStorage.getItem('userId');
            let quitDate = null;
            let daysWithoutSmoking = 0;
            
            if (userId) {
                console.log('Fetching user profile for userId:', userId);
                const dbProfile = await getUserProfile(userId);
                console.log('Database profile received:', JSON.stringify(dbProfile, null, 2));
                
                if (dbProfile) {
                    // Use quitDate from database if available
                    if (dbProfile.quitDate) {
                        console.log('Found quitDate in profile:', dbProfile.quitDate);
                        quitDate = new Date(dbProfile.quitDate);
                        console.log('Parsed quit date:', quitDate);
                        console.log('Is valid date?', !isNaN(quitDate.getTime()));
                        localStorage.setItem('quitDate', dbProfile.quitDate);
                    }
                    // Otherwise use daysWithoutSmoking to calculate quit date
                    else if (dbProfile.daysWithoutSmoking > 0) {
                        console.log('Using daysWithoutSmoking from profile:', dbProfile.daysWithoutSmoking);
                        daysWithoutSmoking = dbProfile.daysWithoutSmoking;
                        const calculatedDate = new Date();
                        calculatedDate.setDate(calculatedDate.getDate() - daysWithoutSmoking);
                        quitDate = calculatedDate;
                        console.log('Calculated quit date from daysWithoutSmoking:', quitDate.toISOString().split('T')[0]);
                    } else {
                        console.log('No quitDate or daysWithoutSmoking found in profile');
                    }
                } else {
                    console.log('No profile data received from database');
                }
            }
            
            // Fall back to localStorage if no database data
            if (!quitDate) {
                console.log('No valid quit date from database, checking localStorage...');
                const quitDateStr = localStorage.getItem("quitDate");
                console.log('LocalStorage quit date:', quitDateStr);
                
                if (!quitDateStr) {
                    console.log('No quit date found in localStorage either');
                    console.log('No quit date found');
                    setQuitProfile({
                        startDate: '--',
                        daysQuit: '--',
                        healthImproved: '--',
                        healthDescription: 'Chưa có thông tin ngày bắt đầu cai thuốc',
                        badges: []
                    });
                    return;
                }
                
                quitDate = new Date(quitDateStr);
                if (isNaN(quitDate.getTime())) {
                    console.error('Invalid quit date in localStorage:', quitDateStr);
                    return;
                }
            }
        
            // Adjust for timezone
            const offset = quitDate.getTimezoneOffset();
            quitDate.setMinutes(quitDate.getMinutes() + offset);
            
            // Get current date (without time)
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            
            // Calculate days since quitting
            const diffTime = now - quitDate;
            const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
            
            // If we have daysWithoutSmoking from database, use the larger value
            const finalDaysQuit = daysWithoutSmoking > 0 ? Math.max(daysWithoutSmoking, diffDays) : diffDays;
        
        console.log('Ngày bắt đầu cai:', quitDate.toISOString().split('T')[0]);
        console.log('Ngày hiện tại:', now.toISOString().split('T')[0]);
        console.log('Số ngày đã cai:', diffDays);

        // Tính toán phần trăm sức khỏe cải thiện
        let healthPercent = 0;
        let healthDescription = '';
        
        if (diffDays >= 365) {
            healthPercent = 100;
            healthDescription = 'Phổi của bạn đã phục hồi gần như hoàn toàn!';
        } else if (diffDays >= 270) {
            healthPercent = 95;
            healthDescription = 'Nguy cơ ung thư phổi giảm 50%';
        } else if (diffDays >= 180) {
            healthPercent = 90;
            healthDescription = 'Tuần hoàn máu cải thiện rõ rệt';
        } else if (diffDays >= 90) {
            healthPercent = 75;
            healthDescription = 'Phổi bắt đầu tự làm sạch';
        } else if (diffDays >= 30) {
            healthPercent = 50;
            healthDescription = 'Tim mạch khỏe mạnh hơn';
        } else if (diffDays >= 14) {
            healthPercent = 35;
            healthDescription = 'Vị giác và khứu giác cải thiện';
        } else if (diffDays >= 7) {
            healthPercent = 20;
            healthDescription = 'Hơi thở dễ chịu hơn';
        } else if (diffDays >= 3) {
            healthPercent = 15;
            healthDescription = 'Nicotine đã rời khỏi cơ thể';
        } else if (diffDays >= 1) {
            healthPercent = 10;
            healthDescription = 'Nồng độ CO trong máu giảm';
        }

        // Hệ thống huy hiệu thành tích
        const badges = [];
        
        // Huy hiệu thời gian
        if (diffDays >= 1) badges.push("🎉 Ngày Đầu Tiên - Khởi đầu mới!");
        if (diffDays >= 3) badges.push("⭐ Chiến Binh 3 Ngày - Vượt qua cai nghiện!");
        if (diffDays >= 7) badges.push("🏅 Tuần Đầu Tiên - Kiên trì theo đuổi!");
        if (diffDays >= 14) badges.push("🌟 2 Tuần Mạnh Mẽ - Ý chí thép!");
        if (diffDays >= 30) badges.push("🥇 1 Tháng Kiên Cường - Thay đổi thói quen!");
        if (diffDays >= 90) badges.push("🎖️ 3 Tháng Bền Bỉ - Lifestyle mới!");
        if (diffDays >= 180) badges.push("🏆 6 Tháng Chiến Thắng - Nửa năm tuyệt vời!");
        if (diffDays >= 270) badges.push("👑 9 Tháng Kiên Định - Gần đến đích!");
        if (diffDays >= 365) badges.push("💎 1 Năm Phi Thường - Cuộc sống mới!");

        // Huy hiệu sức khỏe
        if (healthPercent >= 50) badges.push("❤️ Trái Tim Khỏe Mạnh");
        if (healthPercent >= 75) badges.push("🫁 Phổi Sạch Trong Lành");
        if (healthPercent >= 100) badges.push("🌈 Sức Khỏe Hoàn Hảo");

            setQuitProfile({
                startDate: quitDate.toISOString().split('T')[0],
                daysQuit: finalDaysQuit > 0 ? finalDaysQuit : 0,
                healthImproved: healthPercent,
                healthDescription: healthDescription,
                badges: badges.length > 0 ? badges : ['Hãy bắt đầu hành trình của bạn!']
            });
            
            // Update the daysWithoutSmoking in the user profile state
            setUserProfile(prev => ({
                ...prev,
                daysWithoutSmoking: finalDaysQuit
            }));
            
        } catch (error) {
            console.error('Error loading quit profile:', error);
            setError('Không thể tải thông tin ngày cai thuốc. Vui lòng thử lại sau.');
        }
    };

    const loadAddictionInfo = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            const data = await getAddictionLevel(userId);
            setAddictionInfo({
                level: data.addictionLevel || 'Chưa đánh giá',
                score: data.score || 0,
                lastAssessmentDate: data.assessmentDate ? new Date(data.assessmentDate).toLocaleDateString('vi-VN') : 'Chưa có',
                recommendations: data.recommendations || []
            });
        } catch (error) {
            console.error('Lỗi khi lấy thông tin mức độ nghiện:', error);
        }
    };

    const loadCommitments = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('Vui lòng đăng nhập lại để xem cam kết');
                return;
            }

            // Parse userId to ensure it's a number
            const parsedUserId = parseInt(userId, 10);
            if (isNaN(parsedUserId)) {
                setError('ID người dùng không hợp lệ');
                return;
            }

            console.log('Loading commitments for userId:', parsedUserId);
            const data = await getCommitments(parsedUserId);
            console.log('Commitment data received:', data);
            
            setCommitments(data);
            setError(''); // Clear any previous errors
        } catch (error) {
            console.error('Error in loadCommitments:', error);
            if (error.message === 'Phiên đăng nhập đã hết hạn') {
                // Redirect to login
                navigate('/login');
                return;
            }
            setError(error.message || 'Có lỗi xảy ra khi tải thông tin cam kết');
            setCommitments([]);
        }
    };

    const loadQuitPlans = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) return;
            const plans = await getQuitPlans(userId);
            setQuitPlans(plans);
        } catch (err) {
            console.error('Error loading quit plans:', err);
        }
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
            // Validate email
            const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
            if (!emailRegex.test(userProfile.email)) {
                throw new Error('Email không hợp lệ');
            }
            
            // Get and validate user ID and token
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            
            if (!userId || !token) {
                throw new Error('Vui lòng đăng nhập lại để tiếp tục');
            }
            
            const parsedUserId = parseInt(userId, 10);
            if (isNaN(parsedUserId)) {
                throw new Error('ID người dùng không hợp lệ');
            }
            
            // Prepare profile data with correct field names
            const profileData = {
                fullName: userProfile.fullname || userProfile.fullName || '',
                phone: userProfile.phone || '',
                address: userProfile.address || '',
                gender: userProfile.gender || 'other'
            };
            
            // Log dữ liệu trước khi gửi
            console.log('Dữ liệu gửi đi:', profileData);
            
            // Update profile
            const updatedProfile = await updateProfile(parsedUserId, profileData);
            
            // Cập nhật state với dữ liệu mới từ server
            setUserProfile(prev => ({
                ...prev,
                ...updatedProfile,
                // Đảm bảo các trường cần thiết không bị mất
                fullname: updatedProfile.fullName || prev.fullname,
                email: updatedProfile.email || prev.email,
                username: updatedProfile.username || prev.username
            }));
            
            // Cập nhật localStorage
            const currentProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            localStorage.setItem('userProfile', JSON.stringify({
                ...currentProfile,
                ...updatedProfile,
                fullname: updatedProfile.fullName || currentProfile.fullname,
                email: updatedProfile.email || currentProfile.email,
                username: updatedProfile.username || currentProfile.username
            }));
            
            setIsEditing(false);
            alert('Cập nhật thông tin thành công!');
            
            // Tải lại thông tin người dùng để đảm bảo đồng bộ
            loadUserProfile();
            
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin:', error);
            
            let errorMessage = 'Có lỗi xảy ra khi lưu thông tin';
            
            if (error && error.message) {
                const errorMsg = String(error.message);
                if (errorMsg.includes('Email') || errorMsg.includes('email')) {
                    errorMessage = 'Email không hợp lệ hoặc đã được sử dụng';
                } else if (errorMsg.includes('401')) {
                    errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
                    // Clear auth data and redirect to login
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('userProfile');
                    navigate('/login');
                    return;
                } else if (error.response && error.response.data) {
                    // Lấy thông báo lỗi từ phản hồi của server nếu có
                    errorMessage = error.response.data.message || errorMessage;
                } else {
                    errorMessage = errorMsg;
                }
            }
            
            alert(errorMessage);
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

    // Hàm tính toán chi phí hút thuốc
    const handleCalcInputChange = (e) => {
        const { name, value } = e.target;
        // Chỉ cho phép nhập số dương
        if (value === '' || (parseFloat(value) >= 0 && !isNaN(value))) {
            setCalcForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const calculateResults = () => {
        const years = parseFloat(calcForm.yearsOfSmoking) || 0;
        const perDay = parseFloat(calcForm.cigarettesPerDay) || 0;
        const perPack = parseFloat(calcForm.cigarettesPerPack) || 1;
        const price = parseFloat(calcForm.pricePerPack) || 0;
        
        const totalCigarettes = Math.round(years * 365 * perDay);
        const totalPacks = totalCigarettes / perPack;
        const totalCost = Math.round(totalPacks * price);
        const costPerYear = Math.round((perDay * 365 * price) / perPack);
        const timeSpentSmoking = Math.round((totalCigarettes * 5) / 60);
        
        setCalcResults({
            totalCigarettes,
            totalCost,
            costPerYear,
            timeSpentSmoking
        });
    };

    const handleCalcSubmit = (e) => {
        e.preventDefault();
        calculateResults();
    };

    // Hàm xử lý đăng xuất
    const dangXuat = async () => {
        try {
            await logout();
            // No need to remove from localStorage again since it's done in logout()
            navigate('/login');
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
            // Even if logout fails, still navigate to login
            navigate('/login');
        }
    };

    const getAvatarSrc = (avatarPath) => {
        if (avatarPath && avatarPath.startsWith('data:image')) return avatarPath;
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            const localProfile = JSON.parse(savedProfile);
            if (localProfile.avatar && localProfile.avatar.startsWith('data:image')) return localProfile.avatar;
        }
        return 'images1/cainghien.jpeg';
    };

    // Thêm hàm tính số ngày đã cai dựa vào startDate
    function calculateDaysQuit(startDateStr) {
        if (!startDateStr) return '--';
        const startDate = new Date(startDateStr);
        const now = new Date();
        startDate.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);
        const diffTime = now - startDate;
        const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
        return diffDays;
    }

    // Hàm tính phần trăm sức khỏe và mô tả
    function getHealthStats(daysQuit) {
        let healthPercent = 0;
        let healthDescription = '';
        if (daysQuit >= 365) {
            healthPercent = 100;
            healthDescription = 'Phổi của bạn đã phục hồi gần như hoàn toàn!';
        } else if (daysQuit >= 270) {
            healthPercent = 95;
            healthDescription = 'Nguy cơ ung thư phổi giảm 50%';
        } else if (daysQuit >= 180) {
            healthPercent = 90;
            healthDescription = 'Tuần hoàn máu cải thiện rõ rệt';
        } else if (daysQuit >= 90) {
            healthPercent = 75;
            healthDescription = 'Phổi bắt đầu tự làm sạch';
        } else if (daysQuit >= 30) {
            healthPercent = 50;
            healthDescription = 'Tim mạch khỏe mạnh hơn';
        } else if (daysQuit >= 14) {
            healthPercent = 35;
            healthDescription = 'Vị giác và khứu giác cải thiện';
        } else if (daysQuit >= 7) {
            healthPercent = 20;
            healthDescription = 'Hơi thở dễ chịu hơn';
        } else if (daysQuit >= 3) {
            healthPercent = 15;
            healthDescription = 'Nicotine đã rời khỏi cơ thể';
        } else if (daysQuit >= 1) {
            healthPercent = 10;
            healthDescription = 'Nồng độ CO trong máu giảm';
        }
        return { healthPercent, healthDescription };
    }

    // Hàm lấy huy hiệu
    function getBadges(daysQuit, healthPercent) {
        const badges = [];
        if (daysQuit >= 1) badges.push("🎉 Ngày Đầu Tiên - Khởi đầu mới!");
        if (daysQuit >= 3) badges.push("⭐ Chiến Binh 3 Ngày - Vượt qua cai nghiện!");
        if (daysQuit >= 7) badges.push("🏅 Tuần Đầu Tiên - Kiên trì theo đuổi!");
        if (daysQuit >= 14) badges.push("🌟 2 Tuần Mạnh Mẽ - Ý chí thép!");
        if (daysQuit >= 30) badges.push("🥇 1 Tháng Kiên Cường - Thay đổi thói quen!");
        if (daysQuit >= 90) badges.push("🎖️ 3 Tháng Bền Bỉ - Lifestyle mới!");
        if (daysQuit >= 180) badges.push("🏆 6 Tháng Chiến Thắng - Nửa năm tuyệt vời!");
        if (daysQuit >= 270) badges.push("👑 9 Tháng Kiên Định - Gần đến đích!");
        if (daysQuit >= 365) badges.push("💎 1 Năm Phi Thường - Cuộc sống mới!");
        if (healthPercent >= 50) badges.push("❤️ Trái Tim Khỏe Mạnh");
        if (healthPercent >= 75) badges.push("🫁 Phổi Sạch Trong Lành");
        if (healthPercent >= 100) badges.push("🌈 Sức Khỏe Hoàn Hảo");
        return badges.length > 0 ? badges : ['Hãy bắt đầu hành trình của bạn!'];
    }

    // Step definitions (reuse from kehoach.jsx)
    const quitPlanSteps = {
        step1: {
            title: 'Xác định lý do cai thuốc',
        },
        step2: {
            title: 'Đánh giá mức độ sẵn sàng',
        },
        step3: {
            title: 'Xác định thói quen hút thuốc',
        },
        step4: {
            title: 'Lựa chọn phương pháp cai thuốc',
        },
        step5: {
            title: 'Xây dựng hệ thống hỗ trợ',
        },
        step6: {
            title: 'Thiết lập mục tiêu và phần thưởng',
        }
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
                            readOnly={true}
                            style={{
                                ...styles.userInfo.input,
                                ...styles.userInfo.inputReadOnly
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

                        {/* Phần tính toán chi phí hút thuốc */}
                        <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                            <h3>💸 Tính toán chi phí hút thuốc</h3>
                            <form onSubmit={handleCalcSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
                                <input
                                    type="number"
                                    name="yearsOfSmoking"
                                    placeholder="Số năm hút"
                                    value={calcForm.yearsOfSmoking}
                                    onChange={handleCalcInputChange}
                                    required
                                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '120px' }}
                                />
                                <input
                                    type="number"
                                    name="cigarettesPerDay"
                                    placeholder="Điếu/ngày"
                                    value={calcForm.cigarettesPerDay}
                                    onChange={handleCalcInputChange}
                                    required
                                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '120px' }}
                                />
                                <input
                                    type="number"
                                    name="cigarettesPerPack"
                                    placeholder="Điếu/gói"
                                    value={calcForm.cigarettesPerPack}
                                    onChange={handleCalcInputChange}
                                    required
                                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '120px' }}
                                />
                                <input
                                    type="number"
                                    name="pricePerPack"
                                    placeholder="Giá/gói (VNĐ)"
                                    value={calcForm.pricePerPack}
                                    onChange={handleCalcInputChange}
                                    required
                                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '140px' }}
                                />
                                <button type="submit" style={{ padding: '8px 16px', borderRadius: '4px', background: '#f28c00', color: 'white', border: 'none', cursor: 'pointer' }}>
                                    Tính toán
                                </button>
                            </form>
                            
                            {calcResults && (
                                <div style={{ marginTop: '16px', padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
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

                <div style={styles.section}>
                    <h3 style={{ color: '#d84315', marginBottom: '20px' }}>📊 Đánh giá mức độ nghiện</h3>
                    <div style={{ display: 'grid', gap: '15px' }}>
                        <div style={{ 
                            padding: '15px', 
                            background: '#f8f9fa', 
                            borderRadius: '8px',
                            border: '1px solid #dee2e6'
                        }}>
                            <p><strong>Mức độ nghiện hiện tại:</strong> 
                                <span style={{ 
                                    color: addictionInfo.level === 'Mức 5' ? '#dc3545' : 
                                           addictionInfo.level === 'Mức 4' ? '#dc3545' :
                                           addictionInfo.level === 'Mức 3' ? '#fd7e14' :
                                           addictionInfo.level === 'Mức 2' ? '#28a745' : '#28a745',
                                    marginLeft: '10px',
                                    fontWeight: 'bold'
                                }}>
                                    {addictionInfo.level}
                                </span>
                            </p>
                            <p><strong>Ngày đánh giá gần nhất:</strong> <span style={{ marginLeft: '10px' }}>{addictionInfo.lastAssessmentDate}</span></p>
                        </div>

                        {addictionInfo.recommendations.length > 0 && (
                            <div style={{ 
                                padding: '15px', 
                                background: '#fff3cd', 
                                borderRadius: '8px',
                                border: '1px solid #ffeeba'
                            }}>
                                <h4 style={{ color: '#856404', marginBottom: '10px' }}>💡 Khuyến nghị:</h4>
                                <ul style={{ 
                                    listStyle: 'none', 
                                    padding: 0, 
                                    margin: 0 
                                }}>
                                    {addictionInfo.recommendations.map((rec, index) => (
                                        <li key={index} style={{ 
                                            padding: '8px 0',
                                            borderBottom: index < addictionInfo.recommendations.length - 1 ? '1px solid #ffeeba' : 'none'
                                        }}>
                                            • {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <Link to="/bailam" style={{
                            display: 'inline-block',
                            padding: '10px 20px',
                            background: '#007bff',
                            color: 'white',
                            borderRadius: '5px',
                            textAlign: 'center',
                            textDecoration: 'none',
                            marginTop: '10px'
                        }}>
                            🔄 Đánh giá lại mức độ nghiện
                        </Link>
                    </div>
                </div>

                <div style={styles.section}>
                    <h3 style={{ color: '#1976d2', marginBottom: '20px' }}>📝 Kế hoạch cai thuốc của bạn</h3>
                    {quitPlans && quitPlans.length > 0 ? (
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {quitPlans.map((plan, idx) => {
                                const stepKey = `step${plan.stepNumber}`;
                                let answer = '';
                                let note = '';
                                if (plan.personalNote) {
                                    try {
                                        const data = JSON.parse(plan.personalNote);
                                        answer = data.answer || '';
                                        note = data.note || '';
                                    } catch {
                                        note = plan.personalNote;
                                    }
                                }
                                return (
                                    <div key={idx} style={{
                                        padding: '16px',
                                        background: '#f4f8fb',
                                        borderRadius: '8px',
                                        border: '1px solid #b3c6e0',
                                        marginBottom: '10px',
                                    }}>
                                        <div style={{ fontWeight: 'bold', color: '#1565c0', marginBottom: 6 }}>
                                            {quitPlanSteps[stepKey]?.title || plan.stepDescription || `Bước ${plan.stepNumber}`}
                                        </div>
                                        {answer && (
                                            <div style={{ marginBottom: 4 }}><b>Trả lời:</b> {answer}</div>
                                        )}
                                        {note && (
                                            <div style={{ color: '#607d8b', fontStyle: 'italic' }}><b>Ghi chú:</b> {note}</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ color: '#78909c', fontStyle: 'italic' }}>
                            Bạn chưa có kế hoạch cai thuốc nào.<br/>
                            <Link to='/kehoach' style={{ color: '#1976d2', textDecoration: 'underline' }}>
                                Tạo kế hoạch ngay
                            </Link>
                        </div>
                    )}
                </div>

                <div style={styles.section}>
                    <h3 style={{ color: '#d84315', marginBottom: '20px' }}>🤝 Cam kết cai thuốc</h3>
                    {commitments.length > 0 ? (
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {commitments.map((commitment, index) => {
                                const daysQuit = calculateDaysQuit(commitment.startDate);
                                const { healthPercent, healthDescription } = getHealthStats(daysQuit);
                                const badges = getBadges(daysQuit, healthPercent);
                                return (
                                    <div key={index} style={{
                                        padding: '20px',
                                        background: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #dee2e6',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}>
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '10px'
                                        }}>
                                            <p style={{ 
                                                fontSize: '1.1rem', 
                                                fontWeight: 'bold',
                                                color: '#2196f3'
                                            }}>
                                                Cam kết cai thuốc lá
                                            </p>
                                            <span style={{
                                                padding: '5px 10px',
                                                borderRadius: '15px',
                                                fontSize: '0.9rem',
                                                backgroundColor: healthPercent === 100 ? '#e8f5e9' : commitment.status === 'completed' ? '#e8f5e9' : commitment.status === 'active' ? '#e3f2fd' : '#fff3e0',
                                                color: healthPercent === 100 ? '#2e7d32' : commitment.status === 'completed' ? '#2e7d32' : commitment.status === 'active' ? '#1565c0' : '#f57c00'
                                            }}>
                                                {healthPercent === 100
                                                    ? '✅ Hoàn thành'
                                                    : commitment.status === 'completed'
                                                        ? '✅ Hoàn thành'
                                                        : commitment.status === 'active'
                                                            ? '🔵 Đang thực hiện'
                                                            : '⏳ Chờ xác nhận'}
                                            </span>
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <p style={{ marginBottom: '8px' }}>
                                                <strong>Ngày bắt đầu:</strong>{' '}
                                                <span>{new Date(commitment.startDate).toLocaleDateString('vi-VN')}</span>
                                            </p>
                                            <p style={{ marginBottom: '8px' }}>
                                                <strong>Số ngày đã cai:</strong>{' '}
                                                <span style={{ color: '#2196f3', fontWeight: 'bold' }}>{daysQuit} ngày</span>
                                            </p>
                                            <p style={{ marginBottom: '8px' }}>
                                                <strong>Sức khỏe cải thiện:</strong>{' '}
                                                <span style={{ color: '#f44336', fontWeight: 'bold' }}>{healthPercent}%</span>
                                            </p>
                                            {healthDescription && (
                                                <p style={{
                                                    marginTop: '10px',
                                                    padding: '10px',
                                                    backgroundColor: '#e3f2fd',
                                                    borderRadius: '5px',
                                                    color: '#1565c0'
                                                }}>
                                                    💪 {healthDescription}
                                                </p>
                                            )}
                                            <p style={{ 
                                                marginBottom: '8px',
                                                fontSize: '1.1rem',
                                                fontStyle: 'italic',
                                                color: '#455a64',
                                                borderLeft: '3px solid #2196f3',
                                                paddingLeft: '10px'
                                            }}>
                                                "{commitment.commitmentText}"
                                            </p>
                                        </div>

                                        {/* Hiển thị huy hiệu */}
                                        <div style={{
                                            marginTop: '20px',
                                            padding: '15px',
                                            background: '#fff3e0',
                                            borderRadius: '8px'
                                        }}>
                                            <h4 style={{ 
                                                color: '#f57c00',
                                                marginBottom: '10px'
                                            }}>
                                                🏆 Huy hiệu đạt được
                                            </h4>
                                            <div style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: '10px'
                                            }}>
                                                {badges.map((badge, idx) => (
                                                    <div key={idx} style={{
                                                        padding: '8px 12px',
                                                        background: '#fff',
                                                        borderRadius: '20px',
                                                        fontSize: '0.9rem',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '5px'
                                                    }}>
                                                        {badge}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {commitment.status === 'active' && (
                                            <div style={{
                                                marginTop: '15px',
                                                padding: '10px',
                                                background: '#e3f2fd',
                                                borderRadius: '5px',
                                                fontSize: '0.9rem'
                                            }}>
                                                <p style={{ margin: 0 }}>
                                                    💪 Hãy tiếp tục giữ vững quyết tâm! Mỗi ngày không hút thuốc là một thành công.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ 
                            padding: '30px 20px', 
                            background: '#f8f9fa', 
                            borderRadius: '8px',
                            textAlign: 'center',
                            color: '#6c757d'
                        }}>
                            <p style={{ 
                                fontSize: '1.1rem', 
                                marginBottom: '15px',
                                color: '#455a64'
                            }}>
                                Bạn chưa có cam kết nào. Hãy tạo cam kết để bắt đầu hành trình cai thuốc!
                            </p>
                            <p style={{ 
                                fontSize: '0.9rem',
                                color: '#78909c',
                                marginBottom: '20px'
                            }}>
                                Cam kết sẽ giúp bạn có động lực và quyết tâm hơn trong việc cai thuốc.
                            </p>
                        </div>
                    )}
                    
                    <Link to="/camket" style={{
                        display: 'inline-block',
                        padding: '12px 24px',
                        background: 'linear-gradient(45deg, #2196f3, #1976d2)',
                        color: 'white',
                        borderRadius: '25px',
                        textAlign: 'center',
                        textDecoration: 'none',
                        marginTop: '20px',
                        fontWeight: '600',
                        boxShadow: '0 4px 6px rgba(33, 150, 243, 0.3)',
                        transition: 'all 0.3s ease'
                    }}>
                        ✍️ Tạo cam kết mới
                    </Link>
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
                <div className="sidebar-item" onClick={() => navigate('/canhan')}>👤 Trang cá nhân</div>
                <div className="sidebar-item" onClick={() => navigate('/member')}>💬 Dịch vụ</div>
                <div className="sidebar-item" onClick={dangXuat}>🚪 Đăng xuất</div>
            </div>

            {error && (
                <div style={{
                    padding: '10px 15px',
                    backgroundColor: '#fee2e2',
                    border: '1px solid #ef4444',
                    borderRadius: '8px',
                    color: '#dc2626',
                    marginBottom: '20px',
                    fontSize: '0.9rem'
                }}>
                    ⚠️ {error}
                </div>
            )}
        </>
    );
};

export default CaNhan;