// Header.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  localStorage.setItem("apiserver", "http://localhost:8081");

  const [picture, setPicture] = useState(() => {
    const p = localStorage.getItem("picture");
    return p && p !== 'null' && p !== 'undefined' ? p : "";
  });

  const [sessionExpired, setSessionExpired] = useState(false);
  const username = localStorage.getItem('username') || 'User';

  useEffect(() => {
    const updateFromLocalStorage = () => {
      const p = localStorage.getItem("picture");
      setPicture(p && p !== 'null' && p !== 'undefined' ? p : "");
    };

    const onStorage = () => updateFromLocalStorage();
    const onCustom = (e) => {
      if (e?.detail?.picture) {
        setPicture(e.detail.picture);
      } else {
        updateFromLocalStorage();
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("profile-picture-updated", onCustom);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("profile-picture-updated", onCustom);
    };
  }, []);

  // ✅ Check token expiration
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const exp = payload.exp * 1000; // exp is in seconds → convert to ms
          if (Date.now() >= exp) {
            setSessionExpired(true);
          }
        } catch (e) {
          console.error("Invalid token", e);
        }
      }
    };

    // Run check on mount + every 5 minutes
    checkToken();
    const interval = setInterval(checkToken, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getSrc = () => {
    if (!picture) return `http://localhost:8080/api/avatar?seed=${username}`;
    if (picture.startsWith("data:")) return picture;
    return `data:image/png;base64,${picture}`;
  };

  const handleLogoff = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const hideNav =
    location.pathname === '/blog/latest' ||
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/resetpassword' ||
    location.pathname === '/newpassword' ||
    location.pathname === '/verify-email'||
  /^\/blog\/\d+$/.test(location.pathname) || (location.pathname === '/blog' && location.search !== '');

  if (location.pathname === '/') return null;

  return (
    <>
      <header className="header">
        <div className="logo-section">
          <a href="/">
            <img src={logo} alt="WorkSuite Logo" className="logo-icon" />
          </a>
          <div>
            <h1 className="brand-name">WorkSuite</h1>
            <p className="tagline">Where teams get work done.</p>
          </div>
        </div>

        {!hideNav && (
          <nav className="nav-section">
            <div className="nav-links">
              <Link to="/project">Project</Link>
              <Link to="/task">Task</Link>
              <Link to="/todo">Todo</Link>
              <Link to="/team">Team</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
            <div className="user-menu">
              <button className="btn outline" onClick={handleLogoff}>Logoff</button>

              {/* Notification Bell Icon */}
              <div
                className="notification-bell"
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                  marginRight: '15px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Notifications"
              >
                <i className="far fa-bell" style={{ fontSize: '25px', color: '#333' }}></i>
                <span
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-8px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '2px 6px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    minWidth: '18px',
                    textAlign: 'center'
                  }}
                >
                  5
                </span>
              </div>

              <div className="user-avatar" onClick={handleProfileClick} title={username}>
                <img src={getSrc()} alt="user" />
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* ✅ Session Expired Modal */}
      {sessionExpired && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Session Expired</h5>
              </div>
              <div className="modal-body">
                Your login session has expired. Please log in again to continue.
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSessionExpired(false);
                    localStorage.clear();
                    navigate('/login');
                  }}
                >
                  Re-Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
