import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  const containerStyle = {
    background: 'white',
    padding: '30px 40px',
    borderRadius: '10px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    width: '380px',
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


  const errorMsgStyle = {
    marginTop: '12px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'red',
    display: errorMessage ? 'block' : 'none',
  };

  const linkHomeStyle = {
    textAlign: 'center',
    marginTop: '15px',
  };

  const linkHomeAnchorStyle = {
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

  function authenticate(uname, pwd) {
    const users = getUsers();
    return users.find(u => u.username === uname && u.password === pwd) || null;
  }

  function loginUser(user) {
    localStorage.setItem('isMember', 'true');
    localStorage.setItem('username', user.username);
  }

  const handleSubmit = (e) => {
    e.preventDefault(); 
    setErrorMessage(''); 

    const user = authenticate(username.trim(), password.trim());
    if (user) {
      loginUser(user);
      navigate('/'); 
    } else {
      setErrorMessage('Tên đăng nhập hoặc mật khẩu không đúng.');
    }
  };

  return (
    <div style={bodyStyle}> 
      <div style={containerStyle}>
        <form onSubmit={handleSubmit}> 
          <h2 style={h2Style}>Đăng nhập</h2>
          <label htmlFor="loginUsername" style={labelStyle}>Tên đăng nhập</label>
          <input
            type="text"
            id="loginUsername"
            placeholder="Nhập tên đăng nhập"
            required
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            style={inputStyle}
          />

          <label htmlFor="loginPassword" style={labelStyle}>Mật khẩu</label>
          <input
            type="password"
            id="loginPassword"
            placeholder="Nhập mật khẩu"
            required
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>Đăng nhập</button>
          <div style={errorMsgStyle} id="loginError">{errorMessage}</div>
        </form>

        <div style={linkHomeStyle}>
          <Link to="/" style={linkHomeAnchorStyle}>← Quay về Trang Chủ</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;