import React, { useEffect } from "react";
import { Link } from 'react-router-dom'; 
import { useNavigate } from "react-router-dom"; 

const DuocPham = () => {
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

    return () => {
      if (menuIcon) menuIcon.removeEventListener('click', openSidebar);
      if (overlay) overlay.removeEventListener('click', closeSidebar);
    };
  }, []); 

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
        body {
          margin: 0;
          font-family: 'Roboto', sans-serif;
          background: #f4f4f4;
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

        .auth-links a {
          color: white;
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

        .container {
          max-width: 800px;
          margin: 20px auto;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          flex: 1;
        }
        h2 {
          color: #004d40;
          text-align: center;
        }
        h3 {
          color: #004d40;
          margin-top: 20px;
        }
        footer {
          background: #004d40;
          color: #fff;
          padding: 20px;
          text-align: center;
          flex-shrink: 0;
        }
        .product-image {
          width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 10px 0;
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
            <div><strong>CaiThuocTot.vn</strong> - Cổng thông tin cai thuốc lá</div>
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
        <a href="huanluyenvien.html">Dành cho huấn luyện viên</a>
        <Link to="/blog">Câu chuyện thành công</Link>
        <Link to="/lienhe">Liên hệ</Link>
      </nav>

      <div className="container">
        <h2>Dược Phẩm Hỗ Trợ Cai Nghiện Thuốc Lá</h2>
        <p>
          Chào mừng bạn đến với trang dược phẩm hỗ trợ cai nghiện thuốc lá của <strong>CaiThuocTot.vn</strong>. Chúng tôi cung cấp các sản phẩm chất lượng giúp bạn từ bỏ thuốc lá một cách hiệu quả và an toàn.
        </p>

        <h3>Sản phẩm của chúng tôi</h3>
        <ul>
          <li>
            <strong>Miếng dán nicotine:</strong> Giúp giảm cơn thèm thuốc bằng cách cung cấp một lượng nicotine nhỏ vào cơ thể. Có nhiều loại với các mức độ nicotine khác nhau.
            <img src="/images1/miengdannicotin.jpg" alt="Miếng dán nicotine" className="product-image" />
          </li>
          <li>
            <strong>Thuốc xịt nicotine:</strong> Cung cấp nicotine nhanh chóng qua niêm mạc miệng, giúp giảm cơn thèm thuốc ngay lập tức. Dễ dàng mang theo và sử dụng.
            <img src="/images1/thuocxit.jpg" alt="Thuốc xịt nicotine" className="product-image" />
          </li>
          <li>
            <strong>Viên ngậm nicotine:</strong> Giúp kiểm soát cơn thèm thuốc và giảm cảm giác thèm thuốc trong thời gian dài. Thích hợp cho những người không thích miếng dán.
            <img src="/images1/ngamnicotin.jpg" alt="Viên ngậm nicotine" className="product-image" />
          </li>
        </ul>

        <h3>Lợi ích của việc cai thuốc lá</h3>
        <ul>
          <li>Cải thiện chức năng phổi và hô hấp.</li>
          <li>Giảm nguy cơ mắc các bệnh tim mạch và ung thư.</li>
          <li>Tăng cường sức đề kháng và khả năng phục hồi của cơ thể.</li>
          <li>Tiết kiệm chi phí cho thuốc lá và các chi phí y tế liên quan.</li>
        </ul>

        <h3>Hướng dẫn sử dụng</h3>
        <p>
          Để đạt hiệu quả tốt nhất, hãy tham khảo ý kiến bác sĩ hoặc chuyên gia y tế trước khi sử dụng bất kỳ sản phẩm nào. Hãy kiên trì và nhớ rằng việc cai thuốc là một quá trình cần thời gian và sự quyết tâm.
        </p>
      </div>

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

export default DuocPham;