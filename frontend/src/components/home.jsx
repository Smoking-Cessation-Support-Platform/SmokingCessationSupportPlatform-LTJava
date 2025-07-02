<<<<<<< HEAD
<<<<<<< HEAD
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link và useNavigate

const Home = () => {
  const navigate = useNavigate(); // Khởi tạo hook useNavigate

  // Định nghĩa các hàm bên trong component App
  // để chúng nằm trong scope của component và có thể truy cập navigate
  const checkLogin = () => {
    const isMember = localStorage.getItem('isMember') === 'true';
    if (isMember) {
      navigate("/member");
    } else {
      alert("Bạn cần đăng nhập để sử dụng tính năng này.");
      navigate("/login");
=======
import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
=======
import React, { useState, useEffect } from 'react'; // Import useState
import { Link, useNavigate } from 'react-router-dom';
>>>>>>> bec15bc28804ae31dee31f0f48090beb37ed57ba

const Home = () => {
    const navigate = useNavigate();

    // State để quản lý trạng thái đăng nhập của người dùng
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(() => {
        return localStorage.getItem('token') !== null && localStorage.getItem('isMember') === 'true';
    });

    // State để quản lý trạng thái mở/đóng của sidebar và overlay
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // useEffect để kiểm tra trạng thái đăng nhập khi component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const isMember = localStorage.getItem('isMember');
        setIsUserLoggedIn(token !== null && isMember === 'true');
    }, []);

    // Hàm kiểm tra đăng nhập và điều hướng
    const checkLogin = () => {
        if (isUserLoggedIn) {
            navigate("/member");
        } else {
            alert("Bạn cần đăng nhập để sử dụng tính năng này.");
            navigate("/login");
        }
    };

<<<<<<< HEAD
  const checkLogin = () => {
    const isMember = localStorage.getItem("isMember") === "true";
    if (isMember) {
      window.location.href = "member.html";
    } else {
      alert("Bạn cần đăng nhập để sử dụng tính năng này.");
      window.location.href = "login1.html";
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
    }
  };

  const dangXuat = () => {
<<<<<<< HEAD
    localStorage.removeItem('isMember');
    localStorage.removeItem('username');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('quitStartDate');
    navigate("/");
  };

  const goTo = (path) => {
    navigate(path);
  };

  useEffect(() => {
    // --- Logic hiển thị menu avatar/đăng nhập/đăng ký ---
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

    if (menuIcon) {
      menuIcon.addEventListener('click', () => {
        if (sidebar) sidebar.classList.add('open');
        if (overlay) overlay.classList.add('show');
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
      });
    }

    // Cleanup function
    return () => {
      if (menuIcon) {
        menuIcon.removeEventListener('click', () => {
          if (sidebar) sidebar.classList.add('open');
          if (overlay) overlay.classList.add('show');
        });
      }
      if (overlay) {
        overlay.removeEventListener('click', () => {
          if (sidebar) sidebar.classList.remove('open');
          if (overlay) overlay.classList.remove('show');
        });
      }
    };
  }, [navigate]); // Thêm navigate vào dependency array của useEffect

  return (
    <>
      <style>{`
        /* Giữ nguyên các CSS ở đây */
=======
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
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: 'Roboto', sans-serif;
          background: #fff;
          color: #333;
          line-height: 1.6;
=======
    // Hàm đăng xuất
    const dangXuat = () => {
        if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('isMember');
            localStorage.removeItem('username');
            setIsUserLoggedIn(false);
            setIsSidebarOpen(false);
            navigate("/");
>>>>>>> bec15bc28804ae31dee31f0f48090beb37ed57ba
        }
    };

    // Hàm điều hướng đơn giản
    const goTo = (path) => {
        navigate(path);
        setIsSidebarOpen(false); // Đóng sidebar sau khi điều hướng
    };

    // Hàm mở/đóng sidebar và overlay
    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };

    return (
        <>
            <style>{`
                /* Giữ nguyên các CSS ở đây */
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
                nav .nav-link { /* Đảm bảo Link cũng nhận được style này */
                    color: #fff;
                    margin: 0 10px;
                    padding: 6px 12px;
                    font-weight: bold;
                    transition: background 0.3s;
                }
                nav .nav-link:hover {
                    background: rgba(255,255,255,0.2);
                    border-radius: 4px;
                }

<<<<<<< HEAD
        .carousel-wrapper {
          overflow: hidden;
          border: 2px solid #f26522;
          border-radius: 8px;
          padding: 10px;
          background: #fff;
        }
<<<<<<< HEAD
=======

>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
        .carousel {
          display: flex;
          gap: 20px;
          animation: scrollCarousel 20s linear infinite;
        }
<<<<<<< HEAD
=======

>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
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
<<<<<<< HEAD
=======

>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
        .carousel-item img {
          width: 70px;
          height: 70px;
          border-radius: 50%;
        }
<<<<<<< HEAD
=======

>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
        @keyframes scrollCarousel {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }

        .auth-links {
          color: white;
        }
<<<<<<< HEAD
=======

        /* Avatar + Sidebar */
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
        #menuIconWrapper {
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 1001;
<<<<<<< HEAD
          display: none; /* ẩn mặc định, hiện khi đăng nhập */
        }
=======
          display: none;
        }

>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
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
<<<<<<< HEAD
=======

>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
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
<<<<<<< HEAD
        #sidebar.open {
          right: 0;
        }
=======
=======
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
                #menuIconWrapper {
                    position: fixed;
                    top: 16px;
                    right: 16px;
                    z-index: 1001;
                    display: block !important;
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
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                .circle-avatar:hover {
                    transform: scale(1.05);
                    transition: transform 0.2s ease;
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
                    font-size: 16px;
                    user-select: none;
                }
                .sidebar-item:hover {
                    background-color: #f26522;
                    color: white;
                    border-radius: 4px;
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

                footer {
                    background:#004d40;
                    color:#fff;
                    padding:20px;
                    text-align:center;
                }
            `}</style>
            <header>
                <div className="topbar">
                    <div className="topbar-left">
                        <img src="/images1/logo.jpg" alt="Logo CaiThuocTot.vn" />
                        <div><strong>CaiThuocTot.vn</strong> - Hành trình vì sức khỏe</div>
                    </div>
                    {!isUserLoggedIn ? (
                        <div className="auth-links" id="authLinks">
                            <Link to="/register" style={{ marginRight: '10px', color: 'white' }}>Đăng ký</Link>
                            <Link to="/login" style={{ color: 'white' }}>Đăng nhập</Link>
                        </div>
                    ) : (
                        <div id="menuIconWrapper">
                            <div className="circle-avatar" onClick={toggleSidebar}>
                                <img id="menuIcon" src="/images1/cainghien.jpeg" alt="Menu người dùng" />
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <nav>
                <Link to="/" className="nav-link">Trang chủ</Link>
                <Link to="/gioithieu" className="nav-link">Về chúng tôi</Link>
                <Link to="/huongdancaithuoc" className="nav-link">Hướng dẫn cai thuốc</Link>
                <Link to="/tuvan" className="nav-link">Dịch vụ</Link>
                <Link to="/huanluyenvien_home" className="nav-link">Dành cho huấn luyện viên</Link>
                <Link to="/blog" className="nav-link">Câu chuyện thành công</Link>
                <Link to="/lienhe" className="nav-link">Liên hệ</Link>
            </nav>

            <section className="hero">
                <img src="/images1/banner.png" alt="Banner cai thuốc lá" />
            </section>
>>>>>>> bec15bc28804ae31dee31f0f48090beb37ed57ba

            <section className="section">
                <h2>Các hình thức hỗ trợ cai thuốc</h2>
                <div className="service-grid">
                    <div className="service-item">
                        <img src="/images1/dieuthuoc.png" alt="Dược phẩm" />
                        <h3>Dược phẩm hỗ trợ</h3>
                        <p>Liệu pháp thay thế nicotine được công nhận khoa học.</p>
                        <Link to="/duocpham" style={{ color: '#b71c1c' }}>Xem thêm</Link>
                    </div>
                    <div className="service-item">
                        <img src="/images1/battay.png" alt="Công cụ" />
                        <h3>Công cụ hỗ trợ</h3>
                        <p>Các bài trắc nghiệm, tài liệu và ứng dụng đồng hành.</p>
                        <Link to="/member" onClick={checkLogin} style={{ color: '#b71c1c', cursor: 'pointer', textDecoration: 'underline' }}>Khám phá</Link>
                    </div>
                </div>
            </section>

<<<<<<< HEAD
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
        .sidebar-item {
          padding: 12px 10px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
<<<<<<< HEAD
          font-size: 16px;
          user-select: none;
        }
        .sidebar-item:hover {
          background-color: #f26522;
          color: white;
          border-radius: 4px;
=======
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
        }

        #overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.3);
          display: none;
          z-index: 999;
        }
<<<<<<< HEAD
        #overlay.show {
          display: block;
        }

        footer {
          background:#004d40;
          color:#fff;
          padding:20px;
          text-align:center;
        }
      `}</style>
=======
=======
            <section className="section">
                <h2>Gương cai thuốc thành công</h2>
                <div className="carousel-wrapper">
                    <div className="carousel">
                        <div className="carousel-item">
                            <img src="/images1/gương1.jpg" alt="Ông Nguyễn Văn A" />
                            <div>
                                <h3>Ông Nguyễn Văn A</h3>
                                <p>Bỏ thuốc 6 tháng, sức khỏe cải thiện rõ rệt.</p>
                                <p>"Tôi đã cai thuốc nhờ sự hỗ trợ từ chương trình."</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src="/images1/gương1.jpg" alt="Ông Nguyễn Văn A" />
                            <div>
                                <h3>Ông Nguyễn Văn A</h3>
                                <p>Bỏ thuốc 6 tháng, sức khỏe cải thiện rõ rệt.</p>
                                <p>"Tôi đã cai thuốc nhờ sự hỗ trợ từ chương trình."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" style={{ backgroundColor: '#f1f8f6', borderTop: '2px solid #004d40' }}>
                <h2>Lời nhắn gửi từ chương trình</h2>
                <div style={{ maxWidth: '800px', margin: 'auto', textAlign: 'center', fontSize: '18px', color: '#2e7d32' }}>
                    <p><strong>Hành trình cai thuốc không hề đơn độc.</strong></p>
                    <p>Hãy bắt đầu từ hôm nay. Mỗi ngày không thuốc lá là một chiến thắng cho sức khỏe và tương lai của bạn.</p>
                    <p><em>"Bạn đã sẵn sàng để thay đổi – và chúng tôi sẽ đồng hành cùng bạn!"</em></p>
                    <br />
                    <Link to="/huongdancaithuoc" style={{ backgroundColor: '#004d40', color: 'white', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}>
                        Bắt đầu hành trình ngay
                    </Link>
                </div>
            </section>
>>>>>>> bec15bc28804ae31dee31f0f48090beb37ed57ba

            <footer>
                <p>© 2025 CaiThuocTot.vn - Bản quyền thuộc về nhóm phát triển</p>
                <p>Địa chỉ: 70 Đ. Tô Ký, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh | Email: nhubdq3680@ut.edu.vn | Hotline: 0364155024</p>
            </footer>

<<<<<<< HEAD
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
      <header>
        <div className="topbar">
          <div className="topbar-left">
            <img src="/images1/logo.jpg" alt="Logo CaiThuocTot.vn" />
<<<<<<< HEAD
            <div><strong>CaiThuocTot.vn</strong> - Hành trình vì sức khỏe</div>
          </div>
          <div className="auth-links" id="authLinks">
            <Link to="/register">Đăng ký</Link> |
            <Link to="/login">Đăng nhập</Link>
=======
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
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
          </div>
        </div>
      </header>

      <nav>
        <Link to="/">Trang chủ</Link>
        <Link to="/gioithieu">Về chúng tôi</Link>
        <Link to="/huongdancaithuoc">Hướng dẫn cai thuốc</Link>
<<<<<<< HEAD
        <Link to="/tuvan">Dịch vụ</Link>
        <Link to="/huanluyenvien_home">Dành cho huấn luyện viên</Link>
        <Link to="/blog">Câu chuyện thành công</Link>
        <Link to="/lienhe">Liên hệ</Link>
=======
        <a href="tuvan.html">Dịch vụ</a>
        <a href="huanluyenvien.html">Dành cho huấn luyện viên</a>
        <a href="blog.html">Câu chuyện thành công</a>
        <a href="lienhe.html">Liên hệ</a>
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
      </nav>

      <section className="hero">
        <img src="/images1/banner.png" alt="Banner cai thuốc lá" />
      </section>

      <section className="section">
        <h2>Các hình thức hỗ trợ cai thuốc</h2>
        <div className="service-grid">
          <div className="service-item">
            <img src="/images1/dieuthuoc.png" alt="Dược phẩm" />
<<<<<<< HEAD
            <h3>Dược phẩm hỗ trợ</h3>
            <p>Liệu pháp thay thế nicotine được công nhận khoa học.</p>
            <Link to="/duocpham" style={{ color: '#b71c1c' }}>Xem thêm</Link>
          </div>
          <div className="service-item">
            <img src="/images1/battay.png" alt="Công cụ" />
            <h3>Công cụ hỗ trợ</h3>
            <p>Các bài trắc nghiệm, tài liệu và ứng dụng đồng hành.</p>
            {/* Gọi trực tiếp hàm checkLogin */}
            <a href="#" onClick={checkLogin} style={{ color: '#b71c1c' }}>Khám phá</a>
=======
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
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
          </div>
        </div>
      </section>

      <section className="section">
<<<<<<< HEAD
        <h2>Gương cai thuốc thành công</h2>
=======
        <h2>Tấm gương cai thuốc thành công</h2>
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
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
<<<<<<< HEAD
=======
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
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
          </div>
        </div>
      </section>

<<<<<<< HEAD
      <section className="section" style={{ backgroundColor: '#f1f8f6', borderTop: '2px solid #004d40' }}>
        <h2>Lời nhắn gửi từ chương trình</h2>
        <div style={{ maxWidth: '800px', margin: 'auto', textAlign: 'center', fontSize: '18px', color: '#2e7d32' }}>
          <p><strong>Hành trình cai thuốc không hề đơn độc.</strong></p>
          <p>Hãy bắt đầu từ hôm nay. Mỗi ngày không thuốc lá là một chiến thắng cho sức khỏe và tương lai của bạn.</p>
          <p><em>“Bạn đã sẵn sàng để thay đổi – và chúng tôi sẽ đồng hành cùng bạn!”</em></p>
          <br />
          <Link to="/huongdancaithuoc" style={{ backgroundColor: '#004d40', color: 'white', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}>
            Bắt đầu hành trình ngay
          </Link>
        </div>
      </section>

      <footer>
        <p>© 2025 CaiThuocTot.vn - Bản quyền thuộc về nhóm phát triển</p>
        <p>Địa chỉ: 70 Đ. Tô Ký, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh | Email: nhubdq3680@ut.edu.vn | Hotline: 0364155024</p>
      </footer>

      <div id="menuIconWrapper">
        <div className="circle-avatar">
          <img id="menuIcon" src="/images1/cainghien.jpeg" alt="Menu người dùng" />
=======
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
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
        </div>
      </div>

      <div id="overlay"></div>
<<<<<<< HEAD

      <div id="sidebar">
        {/* Gọi trực tiếp hàm goTo và dangXuat */}
        <div className="sidebar-item" onClick={() => goTo('/canhan')}>👤 Trang cá nhân</div>
        <div className="sidebar-item" onClick={() => goTo('/member')}>💬 Dịch vụ khách hàng</div>
=======
      <div id="sidebar">
        <div className="sidebar-item" onClick={() => goTo("profile.html")}>
          👤 Trang cá nhân
        </div>
        <div className="sidebar-item" onClick={() => goTo("member.html")}>
          💬 Dịch vụ khách hàng
        </div>
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
        <div className="sidebar-item" onClick={dangXuat}>🚪 Đăng xuất</div>
      </div>
    </>
  );
};

<<<<<<< HEAD
export default Home;
=======
export default Home;
>>>>>>> 2a4b59d79ee19f84f4d9116fef457c17d7124194
=======
            {/* Chỉ hiển thị overlay và sidebar khi đã đăng nhập */}
            {isUserLoggedIn && (
                <>
                    <div id="overlay" className={isSidebarOpen ? 'show' : ''} onClick={toggleSidebar}></div>
                    <div id="sidebar" className={isSidebarOpen ? 'open' : ''}>
                        <div className="sidebar-item" onClick={() => goTo('/canhan')}>
                            👤 Trang cá nhân
                        </div>
                        <div className="sidebar-item" onClick={() => goTo('/member')}>
                            💬 Dịch vụ khách hàng
                        </div>
                        <div className="sidebar-item" onClick={dangXuat}>
                            🚪 Đăng xuất
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Home;
>>>>>>> bec15bc28804ae31dee31f0f48090beb37ed57ba
