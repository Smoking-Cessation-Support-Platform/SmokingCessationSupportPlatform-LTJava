import React, { useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';

const Member = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const menuIconWrapper = document.getElementById('menuIconWrapper');
    if (menuIconWrapper) {
      menuIconWrapper.style.display = 'block';
    }

    const menuIcon = document.getElementById('menuIcon');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    const toggleSidebar = () => {
      if (sidebar) sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('show');
    };

    const closeSidebar = () => {
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('show');
    };

    if (menuIcon) menuIcon.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    return () => {
      if (menuIcon) menuIcon.removeEventListener('click', toggleSidebar);
      if (overlay) overlay.removeEventListener('click', closeSidebar);
    };
  }, []); 

  const goBack = () => {
    navigate(-1); 
  };

  const dangXuat = () => {
    localStorage.removeItem('isMember');
    localStorage.removeItem('username');
    alert("Bạn đã đăng xuất."); 
    navigate("/login");
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

        .hero img {
          width: 100%;
          max-height: 300px;
          object-fit: cover;
          display: block;
        }
        .container {
          max-width: 1200px;
          margin: 40px auto 80px;
          padding: 20px;
          position: relative;
          flex-grow: 1;
        }
        .back-btn {
          position: absolute;
          top: 0;
          left: 0;
          background-color: #009688;
          color: #fff;
          border: none;
          padding: 8px 14px;
          border-radius: 5px;
          cursor: pointer;
        }
        .back-btn:hover {
          background-color: #00796b;
        }
        .highlight {
          color: red;
        }
        .line {
          border: 1px solid red;
          margin-bottom: 20px;
        }
        .orange {
          color: orange;
        }
        .tools-grid {
          display: flex;
          flex-wrap: nowrap;
          gap: 20px;
          overflow-x: auto;
          padding-bottom: 10px;
        }
        .tool-box {
          border: 1px solid orange;
          width: 220px;
          height: 250px;
          padding: 10px;
          text-align: center;
          border-radius: 5px;
          background-color: #fff;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .tool-box:hover {
          transform: translateY(-5px);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        .tool-box img {
          max-width: 100%;
          max-height: 120px;
          object-fit: contain;
        }

        @media screen and (max-width: 768px) {
          .tools-grid {
            justify-content: center;
          }
          .tool-box {
            width: 100%;
            max-width: 300px;
          }
          .back-btn {
            position: relative;
            margin-bottom: 10px;
          }
        }

        footer {
          background: #004b3b;
          color: #fff;
          padding: 20px;
          text-align: center;
          flex-shrink: 0;
          font-size: 14px;
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
          font-style: normal; /* Đảm bảo icon không bị nghiêng */
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

      <div id="menuIconWrapper">
        <div className="circle-avatar">
          <img id="menuIcon" src="/images1/cainghien.jpeg" alt="Avatar menu" />
        </div>
      </div>

      <div id="overlay"></div>

      <div id="sidebar">
        <Link to="/canhan" className="sidebar-item"><i>👥</i> Trang cá nhân</Link>
        <Link to="/member" className="sidebar-item"><i>💬</i> Dịch vụ khách hàng</Link>
        <div className="sidebar-item" onClick={dangXuat}><i>🚪</i> Đăng xuất</div>
      </div>

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
        <a href="huanluyenvien.html">Dành cho huấn luyện viên</a>
        <Link to="/blog">Câu chuyện thành công</Link>
        <Link to="/lienhe">Liên hệ</Link>
      </nav>

      <div className="container">
        <button className="back-btn" onClick={goBack}>← Quay lại</button>

        <p style={{ marginTop: '50px' }}><strong>TRANG CHỦ / <span className="highlight">CÔNG CỤ HỖ TRỢ CAI THUỐC LÁ</span></strong></p>
        <hr className="line" />

        <p><strong>Bạn cần giúp đỡ?</strong> Hãy sử dụng các công cụ dưới đây tạo động lực cai thuốc cho bản thân:</p>

        <div className="tools-grid">
          <Link to="/bailam">
            <div className="tool-box">
              <h3>Kiểm tra <span className="orange">mức độ nghiện</span></h3>
              <img src="/images1/nghien.png" alt="Mức độ nghiện" />
            </div>
          </Link>
          <Link to="/tinhtoan">
            <div className="tool-box">
              <h3>Tính toán chi phí</h3>
              <img src="/images1/tinhphi.png" alt="Chi phí" />
            </div>
          </Link>
          <Link to="/camket">
            <div className="tool-box">
              <h3>Cam kết cai thuốc</h3>
              <img src="/images1/camket.png" alt="Cam kết" />
            </div>
          </Link>
          <Link to="/kehoach">
            <div className="tool-box">
              <h3>Lập kế hoạch cai thuốc</h3>
              <img src="/images1/kehoach.png" alt="Kế hoạch" />
            </div>
          </Link>
          <Link to="/huyhieu">
            <div className="tool-box">
              <h3>🎖 Huy hiệu đã đạt</h3>
              <img src="/images1/huyhieu.jpeg" alt="Huy hiệu" />
            </div>
          </Link>
        </div>

        <p><strong>Bạn đã sẵn sàng bắt đầu chưa? Hãy chọn công cụ phù hợp và cùng chúng tôi thay đổi thói quen để sống khỏe hơn.</strong></p>
        <div className="tools-grid">
          <Link to="/tuvan">
            <div className="tool-box">
              <h3>Tư vấn trực tuyến</h3>
              <img src="/images1/tuvan.png" alt="Tư vấn" />
            </div>
          </Link>
        </div>
      </div>

      <footer>
        <p>© 2025 CaiThuocTot.vn - Bản quyền thuộc về nhóm phát triển</p>
        <p>Địa chỉ: 70 Đ. Tô Ký, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh | Email: nhubdq3680@ut.edu.vn | Hotline: 0364155024</p>
      </footer>
    </>
  );
};

export default Member;