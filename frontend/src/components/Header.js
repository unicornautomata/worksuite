import React from 'react';
import './Navbar.css'; // or create Header.css if you prefer separate styling
import './Header.css';
import logo from '../assets/logo.png'; // or './logo.png' if in same folder
//<img src={logo} alt="App Logo" className="app-logo" />
function Header() {
  return (
    <header className="navbar">

      <h1 className="navbar-title">To-Do App</h1>
    </header>
  );
}

export default Header;
