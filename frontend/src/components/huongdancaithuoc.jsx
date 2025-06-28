import React from 'react';
import { Link } from 'react-router-dom'; 

const HuongDanCaiThuoc = () => {
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

  const authLinkStyle = { 
    color: 'white',
    textDecoration: 'none',
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
    transition: 'background 0.3s', 
  };

  const mainStyle = { 
    maxWidth: '900px',
    margin: '30px auto',
    padding: '0 20px 40px',
  };

  const h1Style = { 
    color: '#004d40',
    textAlign: 'center',
    marginBottom: '20px',
  };

  const h2Style = { 
    color: '#b71c1c',
    marginTop: '30px',
  };

  const pStyle = { 
    marginBottom: '15px',
    fontSize: '16px',
  };

  const ulStyle = { 
    listStyleType: 'disc',
    marginLeft: '20px',
    marginBottom: '15px',
  };

  const footerStyle = {
    background: '#004d40',
    color: '#fff',
    padding: '20px',
    textAlign: 'center',
  };


  return (
    <div style={pageStyle}> 
      <header style={headerStyle}>
        <div style={topbarStyle}>
          <div style={topbarLeftStyle}>
            <img src="/images1/logo.jpg" alt="Logo CaiThuocTot.vn" style={logoStyle} />
            <div><strong style={{ color: 'white' }}>CaiThuocTot.vn</strong> - Hành trình vì sức khỏe</div>
          </div>
          <div>
            <a href="register.html" style={authLinkStyle}>Đăng ký</a> |{' '}
            <a href="login1.html" style={authLinkStyle}>Đăng nhập</a>
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

      <main style={mainStyle}>
        <h1 style={h1Style}>Hướng Dẫn Cai Nghiện Thuốc Lá</h1>

        <p style={pStyle}>Cai thuốc lá là một quá trình khó khăn nhưng có thể thành công nếu bạn có kế hoạch và sự kiên trì. Dưới đây là các bước và chiến lược hữu ích để hỗ trợ bạn trong hành trình bỏ thuốc.</p>

        <h2 style={h2Style}>1. Chuẩn Bị Tâm Lý</h2>
        <p style={pStyle}>Thấu hiểu lý do bạn muốn bỏ thuốc và xác định động lực sẽ giúp bạn duy trì quyết tâm.</p>
        <ul style={ulStyle}>
          <li>Xác định lợi ích về sức khỏe và tài chính.</li>
          <li>Xác định các tình huống dễ khiến bạn thèm thuốc và lên kế hoạch đối phó.</li>
          <li>Chia sẻ kế hoạch với gia đình và bạn bè để nhận được sự hỗ trợ.</li>
        </ul>

        <h2 style={h2Style}>2. Lựa Chọn Ngày Bỏ Thuốc</h2>
        <p style={pStyle}>Chọn một ngày cụ thể để bắt đầu bỏ thuốc, tốt nhất là trong vòng 2 tuần tới. Thời gian chuẩn bị sẽ giúp bạn sắp xếp và xử lý các yếu tố gây cám dỗ.</p>

        <h2 style={h2Style}>3. Giảm Liều Dần hoặc Ngưng Đột Ngột</h2>
        <p style={pStyle}>Bạn có thể lựa chọn:</p>
        <ul style={ulStyle}>
          <li>Giảm số lượng thuốc hút mỗi ngày dần dần trước ngày bỏ thuốc.</li>
          <li>Ngưng hút thuốc hoàn toàn đột ngột vào ngày đã chọn.</li>
        </ul>

        <h2 style={h2Style}>4. Hỗ Trợ Y Tế và Sử Dụng Dược Phẩm</h2>
        <p style={pStyle}>Tìm đến các dịch vụ y tế hoặc sử dụng liệu pháp thay thế nicotine (NRT) để giảm các triệu chứng cai nghiện.</p>
        <ul style={ulStyle}>
          <li>Miếng dán, kẹo cao su nicotine.</li>
          <li>Thuốc kê toa theo hướng dẫn của bác sĩ.</li>
          <li>Tư vấn và hỗ trợ tâm lý từ chuyên gia.</li>
        </ul>

        <h2 style={h2Style}>5. Quản Lý Cơn Thèm Thuốc</h2>
        <p style={pStyle}>Học cách kiểm soát khi những cơn thèm xuất hiện:</p>
        <ul style={ulStyle}>
          <li>Uống nước hoặc nhai kẹo cao su không đường.</li>
          <li>Thực hiện các bài tập thở sâu.</li>
          <li>Thay đổi thói quen hoặc tránh các tình huống kích thích muốn hút thuốc.</li>
        </ul>

        <h2 style={h2Style}>6. Duy Trì và Giữ Quyết Tâm</h2>
        <ul style={ulStyle}>
          <li>Tập thể dục và duy trì chế độ ăn uống lành mạnh.</li>
          <li>Tham gia các nhóm hỗ trợ hoặc cộng đồng cai thuốc.</li>
          <li>Phần thưởng bản thân khi đạt được mục tiêu cai thuốc ngắn hạn và dài hạn.</li>
        </ul>

        <h2 style={h2Style}>7. Xử Lý Tái Hút Thuốc</h2>
        <p style={pStyle}>Nếu bạn tái hút thuốc, đừng nản lòng. Hãy xem lại nguyên nhân và bắt đầu lại với kế hoạch mới.</p>

        <h2 style={h2Style}>Liên hệ hỗ trợ</h2>
        <p style={pStyle}>Nếu cần tư vấn hay hỗ trợ thêm, bạn có thể liên hệ với chúng tôi:</p>
        <p style={pStyle}>Email: <a href="mailto:info@caithuoctot.vn" style={{textDecoration: 'none', color: 'inherit'}}>info@caithuoctot.vn</a></p>
        <p style={pStyle}>Điện thoại: 1900 1234 (ví dụ)</p>

      </main>

      <footer style={footerStyle}>
        <p>© 2025 CaiThuocTot.vn | Tất cả quyền được bảo lưu.</p>
      </footer>
    </div>
  );
};

export default HuongDanCaiThuoc;