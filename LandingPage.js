import React from 'react';
import { motion } from 'framer-motion';
import './LandingPage.css';
import logo from '../assets/logo.png';
import heroImage from '../assets/image.png';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const role = localStorage.getItem("role"); // ✅ get user role

  return (
    <motion.div
      className="landing-page"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <header className="landing-header">
        <div className="logo-section">
          <img src={logo} alt="WorkSuite Logo" className="logo-icon" />
          <div>
            <h1 className="brand-name">WorkSuite</h1>
            <p className="tagline">Where teams get work done.</p>
          </div>
        </div>
        <nav className="nav-links">
          <Link to="/product">Product</Link>
          <Link to="/solutions">Solutions</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/pricing">Pricing</Link>

          {/* Blog menu with role check */}
          {role === "ADMIN" ? (
            <div className="dropdown">
              <button className="dropbtn">Blog ▾</button>
              <div className="dropdown-content">
                <Link to="/blog/latest">View Blog</Link>
                <Link to="/manageblog">Manage Blog</Link>
              </div>
            </div>
          ) : (
            <Link to="/blog/latest">Blog</Link>
          )}
        </nav>
        <div className="nav-buttons">
          <Link to="/login" className="btn outline">Login</Link>
          <Link to="/signup" className="btn">Get Started</Link>
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
            ✅ Create and assign tasks with ease<br />
            ✅ Track progress across teams in real-time<br />
            ✅ Organize projects, deadlines, and ticketing in one place<br />
            ✅ Empower your team with accountability and visibility.
          </p>
          <p>
            Whether you're managing a startup, leading a remote team, or just want a better way to stay organized —
            WorkSuite helps you plan smarter, work better, and get more done. 🛠️ Work smarter, not harder.
            Try WorkSuite today.
          </p>
          <a href="/signup" className="btn big">Get Started</a>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default LandingPage;
