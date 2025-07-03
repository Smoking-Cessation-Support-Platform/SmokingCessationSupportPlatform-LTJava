import React, { useEffect } from "react";
import { Link } from 'react-router-dom';

const HuongDanCaiThuoc = () => {
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
      if (link.getAttribute('href') === currentPath) {
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
      window.location.href = "/member"; 
    } else {
      alert("Bạn cần đăng nhập để sử dụng tính năng này.");
      window.location.href = "/login"; 
    }
  };

  const checkLoginDuocPham = () => {
    const isMember = localStorage.getItem('isMember') === 'true';
    if (isMember) {
      window.location.href = "/duocpham"; 
    } else {
      alert("Bạn cần đăng nhập để xem thông tin sản phẩm.");
      window.location.href = "/login"; 
    }
  };

  const dangXuat = () => {
    localStorage.removeItem('isMember');
    localStorage.removeItem('username');
    window.location.href = "/login"; 
  };

  const goTo = (page) => {
    window.location.href = page; 
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
        .nav-active {
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
        ul {
          list-style-type: disc;
          margin-left: 20px;
          margin-bottom: 15px;
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
<<<<<<< HEAD
        <a href="huanluyenvien.html">Dành cho huấn luyện viên</a>
=======
        <a href="huanluyenvien_home">Dành cho huấn luyện viên</a>
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
        <Link to="/blog">Câu chuyện thành công</Link>
        <Link to="/lienhe">Liên hệ</Link>
      </nav>

      <main>
        <h1>Hướng Dẫn Cai Nghiện Thuốc Lá</h1>

        <p>Cai thuốc lá là một quá trình khó khăn nhưng có thể thành công nếu bạn có kế hoạch và sự kiên trì. Dưới đây là các bước và chiến lược hữu ích để hỗ trợ bạn trong hành trình bỏ thuốc.</p>

        <h2>1. Chuẩn Bị Tâm Lý</h2>
        <p>Thấu hiểu lý do bạn muốn bỏ thuốc và xác định động lực sẽ giúp bạn duy trì quyết tâm.</p>
        <ul>
          <li>Xác định lợi ích về sức khỏe và tài chính.</li>
          <li>Xác định các tình huống dễ khiến bạn thèm thuốc và lên kế hoạch đối phó.</li>
          <li>Chia sẻ kế hoạch với gia đình và bạn bè để nhận được sự hỗ trợ.</li>
        </ul>

        <h2>2. Lựa Chọn Ngày Bỏ Thuốc</h2>
        <p>Chọn một ngày cụ thể để bắt đầu bỏ thuốc, tốt nhất là trong vòng 2 tuần tới. Thời gian chuẩn bị sẽ giúp bạn sắp xếp và xử lý các yếu tố gây cám dỗ.</p>

        <h2>3. Giảm Liều Dần hoặc Ngưng Đột Ngột</h2>
        <p>Bạn có thể lựa chọn:</p>
        <ul>
          <li>Giảm số lượng thuốc hút mỗi ngày dần dần trước ngày bỏ thuốc.</li>
          <li>Ngưng hút thuốc hoàn toàn đột ngột vào ngày đã chọn.</li>
        </ul>

        <h2>4. Hỗ Trợ Y Tế và Sử Dụng Dược Phẩm</h2>
        <p>Tìm đến các dịch vụ y tế hoặc sử dụng liệu pháp thay thế nicotine (NRT) để giảm các triệu chứng cai nghiện.</p>
        <ul>
          <li>Miếng dán, kẹo cao su nicotine.</li>
          <li>Thuốc kê toa theo hướng dẫn của bác sĩ.</li>
          <li>Tư vấn và hỗ trợ tâm lý từ chuyên gia.</li>
        </ul>

        <h2>5. Quản Lý Cơn Thèm Thuốc</h2>
        <p>Học cách kiểm soát khi những cơn thèm xuất hiện:</p>
        <ul>
          <li>Uống nước hoặc nhai kẹo cao su không đường.</li>
          <li>Thực hiện các bài tập thở sâu.</li>
          <li>Thay đổi thói quen hoặc tránh các tình huống kích thích muốn hút thuốc.</li>
        </ul>

        <h2>6. Duy Trì và Giữ Quyết Tâm</h2>
        <ul>
          <li>Tập thể dục và duy trì chế độ ăn uống lành mạnh.</li>
          <li>Tham gia các nhóm hỗ trợ hoặc cộng đồng cai thuốc.</li>
          <li>Phần thưởng bản thân khi đạt được mục tiêu cai thuốc ngắn hạn và dài hạn.</li>
        </ul>

        <h2>7. Xử Lý Tái Hút Thuốc</h2>
        <p>Nếu bạn tái hút thuốc, đừng nản lòng. Hãy xem lại nguyên nhân và bắt đầu lại với kế hoạch mới.</p>

        <h2>Liên hệ hỗ trợ</h2>
        <p>Nếu cần tư vấn hay hỗ trợ thêm, bạn có thể liên hệ với chúng tôi:</p>
        <p>Email: <a href="mailto:info@caithuoctot.vn">info@caithuoctot.vn</a></p>
        <p>Điện thoại: 1900 1234 (ví dụ)</p>
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
<<<<<<< HEAD
        <div className="sidebar-item" onClick={() => goTo('canhan.html')}>👤 Trang cá nhân</div>
        <div className="sidebar-item" onClick={() => goTo('member.html')}>💬 Dịch vụ khách hàng</div>
=======
        <div className="sidebar-item" onClick={() => goTo('/canhan')}>👤 Trang cá nhân</div>
        <div className="sidebar-item" onClick={() => goTo('/member')}>💬 Dịch vụ khách hàng</div>
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
        <div className="sidebar-item" onClick={dangXuat}>🚪 Đăng xuất</div>
      </div>
    </>
  );
};

export default HuongDanCaiThuoc;