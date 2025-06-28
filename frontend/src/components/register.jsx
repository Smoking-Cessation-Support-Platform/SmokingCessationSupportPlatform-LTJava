import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [subscription, setSubscription] = useState('paid'); 

  const navigate = useNavigate(); 

  const bodyStyle = {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    margin: 0,
  };

  const registerContainerStyle = {
    background: 'white',
    padding: '30px 40px',
    borderRadius: '10px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    width: '350px',
  };

  const h2Style = {
    textAlign: 'center',
    marginBottom: '25px',
    color: '#333',
  };

  const labelStyle = {
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '8px',
    marginTop: '15px',
    color: '#555',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '16px',
    boxSizing: 'border-box',
  };

  const selectStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '16px',
    boxSizing: 'border-box',
    marginTop: '15px',
  };

  const buttonStyle = {
    width: '100%',
    backgroundColor: '#f26522',
    border: 'none',
    color: 'white',
    padding: '12px 0',
    marginTop: '25px',
    fontSize: '18px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const linkLoginStyle = {
    textAlign: 'center',
    marginTop: '15px',
  };

  const linkLoginAnchorStyle = {
    color: '#f26522',
    textDecoration: 'none',
    fontWeight: 'bold',
  };


  function getUsers() {
    try {
      const users = JSON.parse(localStorage.getItem('users'));
      return users || [];
    } catch (e) {
      console.error("Failed to parse users from localStorage:", e);
      return [];
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault(); 

    if (password !== confirmPassword) {
      window.alert('Mật khẩu xác nhận không khớp!'); 
      return;
    }

    const users = getUsers();
    if (users.some(user => user.username === username.trim())) { 
      window.alert('Tên đăng nhập đã tồn tại!');
      return;
    }

    const newUser = {
      username: username.trim(), 
      password: password.trim(), 
      daysWithoutSmoking: 0,
      subscription: subscription, 
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    sessionStorage.setItem('registeredUser', username.trim()); 

    window.alert('Đăng ký thành công! Vui lòng thực hiện thanh toán.');
    navigate('/payment'); 
  };

  return (
    <div style={bodyStyle}>
      <div style={registerContainerStyle}>
        <h2 style={h2Style}>Đăng ký tài khoản</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username" style={labelStyle}>Tên đăng nhập</label>
          <input
            type="text"
            id="username"
            placeholder="Nhập tên đăng nhập"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
          />

          <label htmlFor="password" style={labelStyle}>Mật khẩu</label>
          <input
            type="password"
            id="password"
            placeholder="Nhập mật khẩu"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <label htmlFor="confirmPassword" style={labelStyle}>Xác nhận mật khẩu</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
          />

          <label htmlFor="subscription" style={labelStyle}>Gói đăng ký</label>
          <select
            id="subscription"
            required
            value={subscription}
            onChange={(e) => setSubscription(e.target.value)}
            style={selectStyle}
          >
            <option value="paid">Gói mất phí</option>
          </select>

          <button type="submit" style={buttonStyle}>Đăng ký</button>
        </form>

        <div style={linkLoginStyle}>
          <Link to="/login" style={linkLoginAnchorStyle}>← Quay về Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;