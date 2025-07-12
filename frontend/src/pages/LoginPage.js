// src/pages/LoginPage.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';
import { isAuthenticated } from '../utils/auth';

function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/todos'); // ✅ Auto-redirect if already logged in
    }
  }, [navigate]);

  return (
    <div className="auth-page">
      <h2>Login</h2>
      <Login />
    </div>
  );
}

export default LoginPage;
