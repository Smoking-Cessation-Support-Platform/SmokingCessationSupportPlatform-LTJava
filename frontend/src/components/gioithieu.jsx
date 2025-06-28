import React from 'react';
import { Link } from 'react-router-dom';

const GioiThieu = () => {
  const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    margin: 0,
    fontFamily: 'Roboto, sans-serif',
    background: '#fff',
    color: '#333',
    lineHeight: 1.6,
  };

  const headerStyle = {
    background: '#004d40',
    color: 'white',
    padding: '12px 20px',
  };

  const navStyle = {
    background: '#b71c1c',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: '12px 0',
  };

  const navLinkStyle = {
    color: '#fff',
    margin: '0 10px',
    padding: '6px 12px',
    fontWeight: 'bold',
    textDecoration: 'none',
  };

  const containerStyle = {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    flex: 1,
  };

  const footerStyle = {
    background: '#004d40',
    color: '#fff',
    padding: '20px',
    textAlign: 'center',
    flexShrink: 0,
  };

  const topbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const topbarLeftStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const logoStyle = {
    height: '45px',
  };

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <div style={topbarStyle}>
          <div style={topbarLeftStyle}>
            <img src="/images1/logo.jpg" alt="Logo CaiThuocTot.vn" style={logoStyle} />
            <div>
              <strong>CaiThuocTot.vn</strong> - Cổng thông tin cai thuốc lá
            </div>
          </div>
          <div>
            <a href="register.html" style={{ color: 'white', textDecoration: 'none' }}>Đăng ký</a> |{' '}
            <a href="login1.html" style={{ color: 'white', textDecoration: 'none' }}>Đăng nhập</a>
          </div>
        </div>
      </header>

      <nav style={navStyle}>
        <Link to="/" style={navLinkStyle}>Trang chủ</Link>
        <Link to="/gioithieu" style={navLinkStyle}>Về chúng tôi</Link>
        <Link to="/huongdancaithuoc" style={navLinkStyle}>Hướng dẫn cai thuốc</Link>
        <a href="tuvan.html" style={navLinkStyle}>Dịch vụ</a>
        <a href="huanluyenvien.html" style={navLinkStyle}>Dành cho huấn luyện viên</a>
        <a href="blog.html" style={navLinkStyle}>Câu chuyện thành công</a>
        <a href="lienhe.html" style={navLinkStyle}>Liên hệ</a>
      </nav>

      <div style={containerStyle}>
        <h2 style={{ color: '#004d40', textAlign: 'center' }}>Mục Đích</h2>
        <p>
          Mục đích chính của cổng thông tin <strong>CaiThuocTot.vn</strong> là nhằm cung cấp thông tin cũng như hỗ trợ cần thiết về cai thuốc lá/lào cho mọi đối tượng và các cán bộ y tế làm việc trong các lĩnh vực liên quan. Giảm số lượng người hút thuốc lá/ thuốc lào đồng nghĩa với việc nâng cao sức khỏe cho bạn, người thân của bạn và cả cộng đồng.
        </p>
        <p>
          Cổng thông tin <strong>CaiThuocTot.vn</strong> không chỉ cung cấp những hướng dẫn cụ thể, chi tiết giúp bản thân người hút thuốc từ bỏ hành vi hút thuốc lá/ thuốc lào. Website là nơi hỗ trợ, tìm kiếm thông tin về từ bỏ hút thuốc cũng như chia sẻ các kiến thức, kinh nghiệm trong quá trình cai thuốc.
        </p>
        <p>
          Khi sử dụng, chia sẻ vui lòng ghi rõ tên tác giả và nguồn{' '}
          <a href="http://www.caithuoctot.vn" target="_blank" rel="noopener noreferrer">
            www.caithuoctot.vn
          </a>.
        </p>
        <p>
          Cổng thông tin <strong>CaiThuocTot.vn</strong> hiện đang trong quá trình hoàn thiện, mọi thắc mắc, trao đổi, đóng góp ý kiến xin liên hệ:
        </p>
        <p>
          Ban quản trị website CaiThuocTot.vn - email:{' '}
          <a href="mailto:info@caithuoctot.vn">info@caithuoctot.vn</a>
        </p>
        <p>
          Thay mặt ban quản trị cổng thông tin{' '}
          <a href="http://www.caithuoctot.vn" target="_blank" rel="noopener noreferrer">
            www.caithuoctot.vn
          </a>!
        </p>
        <p>Trân trọng!</p>
      </div>

      <footer style={footerStyle}>
        <p>© 2025 CaiThuocTot.vn | Tất cả quyền được bảo lưu.</p>
      </footer>
    </div>
  );
};

export default GioiThieu;
