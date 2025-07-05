import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const GioiThieu = () => {
  const navigate = useNavigate();

  const goTo = (path) => {
    navigate(path);
  };

  const dangXuat = () => {
    localStorage.removeItem('isMember');
    localStorage.removeItem('username');
    localStorage.removeItem('userProfile');
    navigate("/login");
  };

  useEffect(() => {
    const isMember = localStorage.getItem('isMember') === 'true';
    const authLinks = document.getElementById('authLinks');
    const menuIconWrapper = document.getElementById('menuIconWrapper');
    const menuIcon = document.getElementById('menuIcon');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if (isMember) {
      if (authLinks) authLinks.style.display = 'none';
      if (menuIconWrapper) menuIconWrapper.style.display = 'block';
    } else {
      if (authLinks) authLinks.style.display = 'block';
      if (menuIconWrapper) menuIconWrapper.style.display = 'none';
    }

    const openSidebar = () => {
      if (sidebar) sidebar.classList.add('open');
      if (overlay) overlay.classList.add('show');
    };

    const closeSidebar = () => {
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('show');
    };

    menuIcon?.addEventListener('click', openSidebar);
    overlay?.addEventListener('click', closeSidebar);

    return () => {
      menuIcon?.removeEventListener('click', openSidebar);
      overlay?.removeEventListener('click', closeSidebar);
    };
  }, []);

  return (
    <div className="page-wrapper">
      <style>{`
        html, body, #root, .page-wrapper {
          height: 100%;
          margin: 0;
          padding: 0;
        }
        
        .page-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        
        * { box-sizing: border-box; }
        body {
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

        .content-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .container {
          max-width: 800px;
          margin: 20px auto;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
          flex: 1;
        }
        h2 {
          color: #004d40;
          text-align: center;
        }
        footer {
          background: #004d40;
          color: #fff;
          padding: 20px;
          text-align: center;
          flex-shrink: 0;
          margin-top: auto;
        }

        .auth-links { color: white; }
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
          background-color: white;
          cursor: pointer;
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
        #sidebar.open {
          right: 0;
        }
        .sidebar-item {
          padding: 12px 10px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
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
            <div><strong>CaiThuocTot.vn</strong> - Cổng thông tin cai thuốc lá</div>
          </div>
          <div className="auth-links" id="authLinks">
            <Link to="/register">Đăng ký</Link> |
            <Link to="/login">Đăng nhập</Link>
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

      <div className="content-wrapper">
        <div className="container">
          <h2>Mục Đích</h2>
          <p>
            Mục đích chính của cổng thông tin <strong>CaiThuocTot.vn</strong> là nhằm cung cấp thông tin cũng như hỗ trợ cần thiết về cai thuốc lá/lào cho mọi đối tượng và các cán bộ y tế làm việc trong các lĩnh vực liên quan. Giảm số lượng người hút thuốc lá/ thuốc lào đồng nghĩa với việc nâng cao sức khỏe cho bạn, người thân của bạn và cả cộng đồng.
          </p>
          <p>
            Cổng thông tin <strong>CaiThuocTot.vn</strong> không chỉ cung cấp những hướng dẫn cụ thể, chi tiết giúp bản thân người hút thuốc từ bỏ hành vi hút thuốc lá/ thuốc lào. Website là nơi hỗ trợ, tìm kiếm thông tin về từ bỏ hút thuốc cũng như chia sẻ các kiến thức, kinh nghiệm trong quá trình cai thuốc.
          </p>
          <p>
            Khi sử dụng, chia sẻ vui lòng ghi rõ tên tác giả và nguồn <a href="http://www.caithuoctot.vn" target="_blank">www.caithuoctot.vn</a>.
          </p>
          <p>
            Cổng thông tin <strong>CaiThuocTot.vn</strong> hiện đang trong quá trình hoàn thiện, mọi thắc mắc, trao đổi, đóng góp ý kiến xin liên hệ:
          </p>
          <p>
            Ban quản trị website CaiThuocTot.vn - email: <a href="mailto:info@caithuoctot.vn">info@caithuoctot.vn</a>
          </p>
          <p>
            Thay mặt ban quản trị cổng thông tin <a href="http://www.caithuoctot.vn" target="_blank">www.caithuoctot.vn</a>!
          </p>
          <p>Trân trọng!</p>
        </div>

        <footer>
          <p>© 2025 CaiThuocTot.vn - Bản quyền thuộc về nhóm phát triển</p>
          <p>Địa chỉ: 70 Đ. Tô Ký, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh | Email: nhubdq3680@ut.edu.vn | Hotline: 0364155024</p>
        </footer>
      </div>

      <div id="menuIconWrapper">
        <div className="circle-avatar">
          <img id="menuIcon" src="/images1/cainghien.jpeg" alt="Menu người dùng" />
        </div>
      </div>

      <div id="overlay"></div>
      <div id="sidebar">
        <div className="sidebar-item" onClick={() => goTo('/canhan')}>👤 Trang cá nhân</div>
        <div className="sidebar-item" onClick={() => goTo('/member')}>💬 Dịch vụ khách hàng</div>
        <div className="sidebar-item" onClick={dangXuat}>🚪 Đăng xuất</div>
      </div>
    </div>
  );
};

export default GioiThieu;