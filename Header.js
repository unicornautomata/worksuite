import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { NotificationContext } from './NotificationContext';
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
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const username = localStorage.getItem('username') || 'User';
  const role = localStorage.getItem('role');

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  } = useContext(NotificationContext);

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

  // ✅ Token expiration checker
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const exp = payload.exp * 1000;
          if (Date.now() >= exp) {
            setSessionExpired(true);
          }
        } catch (e) {
          console.error("Invalid token", e);
        }
      }
    };

    checkToken();
    const interval = setInterval(checkToken, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

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

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // ✅ When a comment notification is clicked → open external manageblog link
  const handleNotificationClick = (e, notification) => {
    e.preventDefault();
    markAsRead(notification.id);

    console.log('Notification clicked:', notification);

    // Infer type from message if not provided
    const type = notification.type?.toLowerCase() ||
      (notification.message?.toLowerCase().includes('commented on blog') ? 'comment' : '');

    if (type === 'comment') {
      console.log('Navigating to /manageblog');
      setShowNotifications(false);
      setTimeout(() => navigate('/manageblog'), 50);
    } else {
      console.log('Notification not of type comment');
    }
  };


  const handleDeleteClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    deleteNotification(id);
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notifTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return notifTime.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'comment': return 'fas fa-comment';
      case 'blog': return 'fas fa-file-alt';
      case 'user':
      case 'signup':
      case 'login': return 'fas fa-user-plus';
      default: return 'fas fa-bell';
    }
  };

  const isClickable = (notification) => notification.type === 'comment';
  const hasCommentNotifications = notifications.some(n => n.type === 'comment');

  const hideNav =
    location.pathname === '/blog/latest' ||
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/resetpassword' ||
    location.pathname === '/newpassword' ||
    location.pathname === '/verify-email' ||
    location.pathname === "/resendverification" ||
    /^\/blog\/\d+$/.test(location.pathname) ||
    (location.pathname === '/blog' && location.search !== '');

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

              {/* ✅ Notification Bell Icon - ADMIN only */}
              {role === "ADMIN" && (
                <div className="notification-container" ref={notificationRef}>
                  <div
                    className="notification-bell"
                    onClick={toggleNotifications}
                    title="Notifications"
                  >
                    <i className="far fa-bell"></i>
                    {unreadCount > 0 && (
                      <span className="notification-badge">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>

                  {/* ✅ Notification Dropdown */}
                  {showNotifications && (
                    <div className="notification-dropdown">
                      <div className="notification-header">
                        <h6>Notifications ({unreadCount} unread)</h6>
                        <div className="notification-actions">
                          {notifications.length > 0 && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAllAsRead();
                                }}
                                className="mark-all-read"
                                title="Mark all as read"
                              >
                                <i className="fas fa-check-double"></i>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearAllNotifications();
                                }}
                                className="clear-all"
                                title="Clear all"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="notification-list">
                        {notifications.length === 0 ? (
                          <div className="no-notifications">
                            <i className="far fa-bell-slash"></i>
                            <p>No notifications</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`notification-item ${!notif.read ? 'unread' : ''} ${isClickable(notif) ? 'clickable' : 'non-clickable'}`}
                              onClick={(e) => handleNotificationClick(e, notif)}
                            >
                              <div className="notification-icon">
                                <i className={getNotificationIcon(notif.type)}></i>
                              </div>
                              <div className="notification-content">
                                <p className="notification-message">
                                  {notif.message}
                                  {isClickable(notif) && (
                                    <span className="clickable-hint"> 👆 Click to manage</span>
                                  )}
                                </p>
                                <span className="notification-time">
                                  {formatTimestamp(notif.timestamp)}
                                </span>
                              </div>
                              <button
                                className="delete-notification"
                                onClick={(e) => handleDeleteClick(e, notif.id)}
                                title="Delete"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {/* ✅ Footer link - opens manageblog page */}
                      {hasCommentNotifications && (
                        <div className="notification-footer">
                          <button
                            className="manage-blog-link"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowNotifications(false);
                              window.open("http://localhost:5035/manageblog", "_blank");
                            }}
                          >
                            <i className="fas fa-cog"></i> Manage Blog Comments
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

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
