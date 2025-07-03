vakypro
vakypro
Online

vakypro — 11:29 CH
Chú ong chăm chỉ — 11:32 CH
Forwarded
lienhe.jsx
import React, { useEffect } from "react";
import { Link } from 'react-router-dom'; 
import { useNavigate } from "react-router-dom"; 

const LienHe = () => {
  const navigate = useNavigate(); 
Expand
message.txt
9 KB
Forwarded
blog.jsx
import React, { useEffect } from "react";
import { Link } from 'react-router-dom'; 
import { useNavigate } from "react-router-dom"; 
const CauChuyenThanhCong = () => {
  const navigate = useNavigate(); 
Expand
message.txt
11 KB
﻿
Chú ong chăm chỉ
minhmoi.
 
import React, { useEffect } from "react";
import { Link } from 'react-router-dom'; 
import { useNavigate } from "react-router-dom"; 
const CauChuyenThanhCong = () => {
  const navigate = useNavigate(); 

  useEffect(() => {
    const isMember = localStorage.getItem('isMember') === 'true';
    const authLinks = document.querySelector('.auth-links');
    const menuIconWrapper = document.getElementById('menuIconWrapper');

    if (isMember) {
      if (authLinks) authLinks.style.display = 'none';
      if (menuIconWrapper) menuIconWrapper.style.display = 'block';
    } else {
      if (authLinks) authLinks.style.display = 'block';
      if (menuIconWrapper) menuIconWrapper.style.display = 'none';
    }

    const menuIcon = document.getElementById('menuIcon');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    const openSidebar = () => {
      if (sidebar) sidebar.classList.add('open');
      if (overlay) overlay.classList.add('show');
    };

    const closeSidebar = () => {
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('show');
    };

    if (menuIcon) menuIcon.addEventListener('click', openSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
      if (link.getAttribute('href') && link.getAttribute('href').includes(currentPath)) {
        link.classList.add('nav-active');
      }
    });

    return () => {
      if (menuIcon) menuIcon.removeEventListener('click', openSidebar);
      if (overlay) overlay.removeEventListener('click', closeSidebar);
    };
  }, []); 

  const checkLogin = () => {
    const isMember = localStorage.getItem('isMember') === 'true';
    if (isMember) {
      navigate("/member");
    } else {
      alert("Bạn cần đăng nhập để sử dụng tính năng này.");
      navigate("/login");
    }
  };

  const checkLoginDuocPham = () => {
    const isMember = localStorage.getItem('isMember') === 'true';
    if (isMember) {
      navigate("/duocpham");
    } else {
      alert("Bạn cần đăng nhập để xem thông tin sản phẩm.");
      navigate("/login");
    }
  };

  const dangXuat = () => {
    localStorage.removeItem('isMember');
    localStorage.removeItem('username');
    navigate("/login"); 
  };

  const goTo = (page) => {
    const reactPageMap = {
      'canhan.html': '/canhan',
      'member.html': '/member',
      'login1.html': '/login'
    };
    const targetPath = reactPageMap[page] || `/${page.replace('.html', '')}`;
    navigate(targetPath);
  };

  const successStories = [
    {
      name: "Ông Nguyễn Văn A",
      age: 55,
      duration: "6 tháng",
      quote: "Tôi đã cai thuốc nhờ sự kiên trì và hỗ trợ từ chương trình. Sức khỏe của tôi đã cải thiện rõ rệt, tôi cảm thấy mình trẻ hơn rất nhiều."
    },
    {
      name: "Bà Trần Thị B",
      age: 48,
      duration: "1 năm",
      quote: "Tin nhắn động viên từ chương trình đã giúp tôi vượt qua cơn thèm thuốc. Tôi cảm thấy tự hào vì đã làm được điều này."
    },
    {
      name: "Anh Lê Văn C",
      age: 38,
      method: "liệu pháp NRT",
      quote: "Tôi khuyên mọi người hãy thử phương pháp này. Nó thực sự hiệu quả và giúp tôi vượt qua cơn thèm thuốc."
    },
    {
      name: "Chị Mai Thị D",
      age: 42,
      duration: "3 tháng",
      quote: "Sức khỏe tôi đã thay đổi tích cực mỗi ngày. Tôi cảm thấy mình có nhiều năng lượng hơn."
    }
  ];

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
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
        a {
          text-decoration: none;
          color: inherit;
        }
        header {
          background: #004d40;
          color: white;
          padding: 12px 20px;
          flex-shrink: 0;
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
          flex-shrink: 0;
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

        main {
          flex-grow: 1;
          max-width: 900px;
          margin: 30px auto;
          padding: 0 20px 40px;
          width: 100%;
        }
        h1 {
          color: #004d40;
          text-align: center;
          margin-bottom: 20px;
        }
        h2 {
          color: #b71c1c;
          margin-top: 30px;
        }
        p {
          margin-bottom: 15px;
          font-size: 16px;
        }
        .story {
          margin-bottom: 30px;
          padding: 15px;
          border: 1px solid #b71c1c;
          border-radius: 8px;
          background: #f9f9f9;
        }
        footer {
          background: #004d40;
          color: #fff;
          padding: 20px;
          text-align: center;
          flex-shrink: 0;
        }

        .auth-links {
          color: white;
        }
        #menuIconWrapper {
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 1001;
          display: none;
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
        }
        #sidebar.open {
          right: 0;
        }
        .sidebar-item {
          padding: 12px 10px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          color: #333;
        }
        .sidebar-item:hover {
            background-color: #f0f0f0;
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
      `}</style>

      <header>
        <div className="topbar">
          <div className="topbar-left">
            <img src="/images1/logo.jpg" alt="Logo CaiThuocTot.vn" />
            <div><strong>CaiThuocTot.vn</strong> - Hành trình vì sức khỏe</div>
          </div>
          <div className="auth-links">
            <Link to="/register" style={{ color: "white" }}>Đăng ký</Link> |
            <Link to="/login" style={{ color: "white" }}>Đăng nhập</Link>
          </div>
        </div>
      </header>

      <nav>
        <Link to="/">Trang chủ</Link>
        <Link to="/gioithieu">Về chúng tôi</Link>
        <Link to="/huongdancaithuoc">Hướng dẫn cai thuốc</Link>
        <Link to="/tuvan">Dịch vụ</Link>
        <a href="huanluyenvien_home">Dành cho huấn luyện viên</a>
        <Link to="/blog" className="nav-active">Câu chuyện thành công</Link>
        <Link to="/lienhe">Liên hệ</Link>
      </nav>

      <main>
        <h1>Câu Chuyện Thành Công</h1>

        {successStories.map((story, index) => (
          <div className="story" key={index}>
            <h2>{story.name}</h2>
            <p>
              Tuổi {story.age}, đã bỏ thuốc lá được {story.duration}. {story.method ? `Anh/Chị cai thuốc thành công nhờ ${story.method}. ` : ''}
              {story.name.startsWith("Ông") || story.name.startsWith("Anh") ? "Ông/Anh" : "Bà/Chị"} chia sẻ: “{story.quote}”
            </p>
          </div>
        ))}

        <h2>Chia Sẻ Câu Chuyện Của Bạn</h2>
        <p>Nếu bạn có câu chuyện thành công trong việc cai thuốc lá, hãy chia sẻ với chúng tôi qua email: <a href="mailto:info@caithuoctot.vn">info@caithuoctot.vn</a></p>
      </main>

      <footer>
        <p>© 2025 CaiThuocTot.vn - Bản quyền thuộc về nhóm phát triển</p>
        <p>Địa chỉ: 70 Đ. Tô Ký, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh | Email: nhubdq3680@ut.edu.vn | Hotline: 0364155024</p>
      </footer>

      <div id="menuIconWrapper">
        <div className="circle-avatar">
          <img id="menuIcon" src="/images1/cainghien.jpeg" alt="Menu người dùng" />
        </div>
      </div>

      <div id="overlay"></div>
      <div id="sidebar">
        <div className="sidebar-item" onClick={() => goTo('canhan.html')}>👤 Trang cá nhân</div>
        <div className="sidebar-item" onClick={() => goTo('member.html')}>💬 Dịch vụ khách hàng</div>
        <div className="sidebar-item" onClick={dangXuat}>🚪 Đăng xuất</div>
      </div>
    </>
  );
};

export default CauChuyenThanhCong;