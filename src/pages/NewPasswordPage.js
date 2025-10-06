import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NewPassword from '../components/NewPassword';
import { isAuthenticated } from '../utils/auth';

function NewPasswordPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/todo'); // ✅ Auto-redirect if already logged in
    }
  }, [navigate]);

  return (
    <div className="auth-page">

      <NewPassword />
    </div>
  );
}

export default NewPasswordPage;
