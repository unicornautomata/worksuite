import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './LandingPage.css';
import logo from '../assets/logo.png';
import heroImage from '../assets/image.png';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const role = localStorage.getItem("role");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownItemClick = (path) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <motion.div
      className="landing-page"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <header className="landing-header">
        {/* Logo Section - Left */}
        <div className="logo-section">
          <img src={logo} alt="WorkSuite Logo" className="logo-icon" />
          <div>
            <h1 className="brand-name">WorkSuite</h1>
            <p className="tagline">Where teams get work done.</p>
          </div>
        </div>

        {/* Right Section - Nav Links + Buttons */}
        <div className="header-right">
          {/* Nav Links */}
          <nav className="nav-links">
            <Link to="/product">Product</Link>
            <Link to="/solutions">Solutions</Link>
            <Link to="/resources">Resources</Link>
            <Link to="/pricing">Pricing</Link>

            {/* Blog menu with role check */}
            {role === "ADMIN" ? (
              <div className="blog-dropdown" ref={dropdownRef}>
                <button
                  className="blog-dropbtn"
                  onClick={toggleDropdown}
                  type="button"
                >
                  Blog ▾
                </button>
                {isDropdownOpen && (
                  <div className="blog-dropdown-content">
                    <button
                      onClick={() => handleDropdownItemClick('/blog/latest')}
                      type="button"
                    >
                      View Blog
                    </button>
                    <button
                      onClick={() => handleDropdownItemClick('/manageblog')}
                      type="button"
                    >
                      Manage Blog
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/blog/latest">Blog</Link>
            )}
          </nav>

          {/* Action Buttons */}
          <div className="nav-buttons">
            <Link to="/login" className="btn outline">Login</Link>
            <Link to="/signup" className="btn">Get Started</Link>
          </div>
        </div>
      </header>

      <main className="hero">
        <motion.img
          src={heroImage}
          alt="Team Working"
          className="hero-img"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
        />
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.6 }}
        >
          <h2>🚀 Introducing <span className="highlight">WorkSuite</span> — Your Team's New Favorite Workspace!</h2>
          <p>
            Tired of messy task lists, confusing threads, and scattered project updates?
            WorkSuite is here to bring clarity, structure, and collaboration back to your workflow.
          </p>
          <p>
            ✅ Create and assign tasks with ease<br />
            ✅ Track progress across teams in real-time<br />
            ✅ Organize projects, deadlines, and ticketing in one place<br />
            ✅ Empower your team with accountability and visibility.
          </p>
          <p>
            Whether you're managing a startup, leading a remote team, or just want a better way to stay organized —
            WorkSuite helps you plan smarter, work better, and get more done.
          </p>
          <p>
            🛠️ Work smarter, not harder. Try WorkSuite today.
          </p>
          <Link to="/signup" className="btn big">Get Started</Link>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default LandingPage;
