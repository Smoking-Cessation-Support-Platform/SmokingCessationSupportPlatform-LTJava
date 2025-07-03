<<<<<<< HEAD
=======
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
 
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
import React, { useEffect } from "react";
import { Link } from 'react-router-dom'; 
import { useNavigate } from "react-router-dom"; 

const LienHe = () => {
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
      if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href').replace('.html', ''))) {
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
        p {
          margin-bottom: 15px;
          font-size: 16px;
        }
        footer {
          background: #004d40;
          color: #fff;
          padding: 20px;
          text-align: center;
          flex-shrink: 0;
        }
        .contact-info {
          margin-top: 20px;
        }
        .contact-info p {
          margin: 5px 0;
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
<<<<<<< HEAD
        <a href="huanluyenvien.html">Dành cho huấn luyện viên</a>
=======
        <a href="huanluyenvien_home">Dành cho huấn luyện viên</a>
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
        <Link to="/blog">Câu chuyện thành công</Link>
        <Link to="/lienhe" className="nav-active">Liên hệ</Link>
      </nav>

      <main>
        <h1>Liên Hệ Với Chúng Tôi</h1>
        <p>Nếu bạn có bất kỳ câu hỏi nào hoặc cần thêm thông tin, vui lòng liên hệ với chúng tôi qua các phương thức dưới đây:</p>

        <div className="contact-info">
          <h2>Thông Tin Liên Hệ</h2>
          <p>Email: <a href="mailto:nhubdq3680@ut.edu.vn">nhubdq3680@ut.edu.vn</a></p>
          <p>Điện thoại: 0364155024</p>
          <p>Địa chỉ: 70 Đ. Tô Ký, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh</p>
        </div>
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

export default LienHe;