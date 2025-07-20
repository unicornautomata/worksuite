import React from 'react';
import './LandingPage.css';
import logo from '../assets/logo.png';
import heroImage from '../assets/image.png';
import { Link } from 'react-router-dom';
const LandingPage = () => {
  return (
    <div>
      <header>
        <div className="logo-section">
          <img src={logo} alt="WorkSuite Logo" className="logo-icon" />
          <div>
            <h1 className="brand-name">WorkSuite</h1>
            <p className="tagline">Where teams get work done.</p>
          </div>
        </div>
        <nav>
  <Link to="/product">Product</Link>
  <Link to="/solutions">Solutions</Link>
  <Link to="/resources">Resources</Link>
  <Link to="/pricing">Pricing</Link>
  <Link to="/login" className="btn outline">Login</Link>
  <Link to="/signup" className="btn">Get Started</Link>
</nav>
      </header>

      <main className="hero">
        <img src={heroImage} alt="Team Working" className="hero-img" />
        <div className="hero-text">
          <h2>🚀 Introducing <span className="highlight">WorkSuite</span> — Your Team’s New Favorite Workspace!</h2>
          <p>
            Tired of messy task lists, confusing threads, and scattered project updates?
            WorkSuite is here to bring clarity, structure, and collaboration back to your workflow.<br />
            ✅ Create and assign tasks with ease<br />
            ✅ Track progress across teams in real-time<br />
            ✅ Organize projects, deadlines, and ticketing in one place<br />
            ✅ Empower your team with accountability and visibility.
          </p>
          <p>
            Whether you’re managing a startup, leading a remote team, or just want a better way to stay organized —
            WorkSuite helps you plan smarter, work better, and get more done. 🛠️ Work smarter, not harder.
            Try WorkSuite today.
          </p>
          <a href="/signup" className="btn big">Get Started</a>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
