import React, { useEffect } from "react";
import { Link } from 'react-router-dom';

const Home = () => {
  useEffect(() => {
    const isMember = localStorage.getItem("isMember") === "true";
    const authLinks = document.querySelector(".auth-links");
    const menuIconWrapper = document.getElementById("menuIconWrapper");

    if (isMember) {
      if (authLinks) authLinks.style.display = "none";
      if (menuIconWrapper) menuIconWrapper.style.display = "block";
    } else {
      if (authLinks) authLinks.style.display = "block";
      if (menuIconWrapper) menuIconWrapper.style.display = "none";
    }

    const menuIcon = document.getElementById("menuIcon");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    function openSidebar() {
      sidebar.classList.add("open");
      overlay.classList.add("show");
    }
    function closeSidebar() {
      sidebar.classList.remove("open");
      overlay.classList.remove("show");
    }

    if (menuIcon) menuIcon.addEventListener("click", openSidebar);
    if (overlay) overlay.addEventListener("click", closeSidebar);

    // Cleanup event listeners on unmount
    return () => {
      if (menuIcon) menuIcon.removeEventListener("click", openSidebar);
      if (overlay) overlay.removeEventListener("click", closeSidebar);
    };
  }, []);

  const checkLogin = () => {
    const isMember = localStorage.getItem("isMember") === "true";
    if (isMember) {
      window.location.href = "member.html";
    } else {
      alert("Bạn cần đăng nhập để sử dụng tính năng này.");
      window.location.href = "login1.html";
    }
  };

  const dangXuat = () => {
    localStorage.removeItem("isMember");
    localStorage.removeItem("username");
    window.location.reload();
  };

  const goTo = (page) => {
    window.location.href = page;
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

        .section {
          padding: 40px 20px;
          max-width: 1200px;
          margin: auto;
        }
        .section h2 {
          text-align: center;
          margin-bottom: 30px;
          color: #004d40;
        }

        .service-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        .service-item {
          background: #fff;
          padding: 15px;
          border: 1px solid #f26522;
          border-radius: 8px;
          text-align: center;
        }
        .service-item img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 6px;
          margin-bottom: 10px;
        }

        .carousel-wrapper {
          overflow: hidden;
          border: 2px solid #f26522;
          border-radius: 8px;
          padding: 10px;
          background: #fff;
        }

        .carousel {
          display: flex;
          gap: 20px;
          animation: scrollCarousel 20s linear infinite;
        }

        .carousel-item {
          flex: 0 0 300px;
          background: #fdfdfd;
          border-radius: 8px;
          padding: 15px;
          display: flex;
          gap: 15px;
          align-items: flex-start;
          border: 1px solid #f26522;
        }

        .carousel-item img {
          width: 70px;
          height: 70px;
          border-radius: 50%;
        }

        @keyframes scrollCarousel {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }

        .auth-links {
          color: white;
        }

        /* Avatar + Sidebar */
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
            <div>
              <strong>CaiThuocTot.vn</strong> - Hành trình vì sức khỏe
            </div>
          </div>
          <div className="auth-links">
            <Link to="/register" style={{ color: "white" }}>
              Đăng ký
            </Link>{" "}
            |{" "}
            <Link to="/login" style={{ color: "white" }}>
              Đăng nhập
            </Link>
          </div>
        </div>
      </header>

      <nav>
        <Link to="/">Trang chủ</Link>
        <Link to="/gioithieu">Về chúng tôi</Link>
        <Link to="/huongdancaithuoc">Hướng dẫn cai thuốc</Link>
        <a href="tuvan.html">Dịch vụ</a>
        <a href="huanluyenvien.html">Dành cho huấn luyện viên</a>
        <a href="blog.html">Câu chuyện thành công</a>
        <a href="lienhe.html">Liên hệ</a>
      </nav>

      <section className="hero">
        <img src="/images1/banner.png" alt="Banner cai thuốc lá" />
      </section>

      <section className="section">
        <h2>Các hình thức hỗ trợ cai thuốc</h2>
        <div className="service-grid">
          <div className="service-item">
            <img src="/images1/dieuthuoc.png" alt="Dược phẩm" />
            <h3>DƯỢC PHẨM HỖ TRỢ</h3>
            <p>Liệu pháp thay thế nicotine được công nhận khoa học.</p>
            <a href="duocpham.html" style={{ color: "#b71c1c" }}>
              Xem thêm
            </a>
          </div>
          <div className="service-item">
            <img src="/images1/battay.png" alt="Công cụ" />
            <h3>CÔNG CỤ HỖ TRỢ</h3>
            <p>Các bài trắc nghiệm, tài liệu và ứng dụng đồng hành.</p>
            <a
              href="#!"
              onClick={checkLogin}
              style={{ color: "#b71c1c", cursor: "pointer" }}
            >
              Khám phá
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Tấm gương cai thuốc thành công</h2>
        <div className="carousel-wrapper">
          <div className="carousel">
            <div className="carousel-item">
              <img src="/images1/gương1.jpg" alt="Ông Nguyễn Văn A" />
              <div>
                <h3>Ông Nguyễn Văn A</h3>
                <p>Bỏ thuốc 6 tháng, sức khỏe cải thiện rõ rệt.</p>
                <p>“Tôi đã cai thuốc nhờ sự hỗ trợ từ chương trình.”</p>
              </div>
            </div>
            <div className="carousel-item">
              <img src="/images1/gương1.jpg" alt="Ông Nguyễn Văn A" />
              <div>
                <h3>Ông Nguyễn Văn A</h3>
                <p>Bỏ thuốc 6 tháng, sức khỏe cải thiện rõ rệt.</p>
                <p>“Tôi đã cai thuốc nhờ sự hỗ trợ từ chương trình.”</p>
              </div>
            </div>
            <div className="carousel-item">
              <img src="/images1/gương1.jpg" alt="Ông Nguyễn Văn A" />
              <div>
                <h3>Ông Nguyễn Văn A</h3>
                <p>Bỏ thuốc 6 tháng, sức khỏe cải thiện rõ rệt.</p>
                <p>“Tôi đã cai thuốc nhờ sự hỗ trợ từ chương trình.”</p>
              </div>
            </div>
            <div className="carousel-item">
              <img src="/images1/gương1.jpg" alt="Ông Nguyễn Văn A" />
              <div>
                <h3>Ông Nguyễn Văn A</h3>
                <p>Bỏ thuốc 6 tháng, sức khỏe cải thiện rõ rệt.</p>
                <p>“Tôi đã cai thuốc nhờ sự hỗ trợ từ chương trình.”</p>
              </div>
            </div>
            <div className="carousel-item">
              <img src="/images1/gương1.jpg" alt="Ông Nguyễn Văn A" />
              <div>
                <h3>Ông Nguyễn Văn A</h3>
                <p>Bỏ thuốc 6 tháng, sức khỏe cải thiện rõ rệt.</p>
                <p>“Tôi đã cai thuốc nhờ sự hỗ trợ từ chương trình.”</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer
        style={{ background: "#004d40", color: "#fff", padding: 20, textAlign: "center" }}
      >
        <p>© 2025 CaiThuocTot.vn | Liên hệ: info@caithuoctot.vn</p>
      </footer>

      {/* Avatar + Sidebar */}
      <div id="menuIconWrapper">
        <div className="circle-avatar">
          <img
            id="menuIcon"
            src="/images1/cainghien.jpeg"
            alt="Menu người dùng"
          />
        </div>
      </div>

      <div id="overlay"></div>
      <div id="sidebar">
        <div className="sidebar-item" onClick={() => goTo("profile.html")}>
          👤 Trang cá nhân
        </div>
        <div className="sidebar-item" onClick={() => goTo("member.html")}>
          💬 Dịch vụ khách hàng
        </div>
        <div className="sidebar-item" onClick={dangXuat}>🚪 Đăng xuất</div>
      </div>
    </>
  );
};

export default Home;
