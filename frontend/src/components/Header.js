import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();



  const handleLogoff = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const username = localStorage.getItem('username') || 'User';

  return (
    <header className="header">
      <div className="logo-section">
        <img src="/assets/logo.png" alt="WorkSuite Logo" className="logo-icon" />
        <div>
          <h1 className="brand-name">WorkSuite</h1>
          <p className="tagline">Where teams get work done.</p>
        </div>
      </div>

      <nav>

          <div className="user-menu">
            <button className="btn outline" onClick={handleLogoff}>Logoff</button>
            <div className="user-avatar" onClick={handleProfileClick} title={username}>
              <img
                src={`https://api.dicebear.com/7.x/identicon/svg?seed=${username}`}
                alt="user"
              />
            </div>
          </div>

      </nav>
    </header>
  );
}

export default Header;
