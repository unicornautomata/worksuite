import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Resetpassword from '../components/Resetpassword';
import { isAuthenticated } from '../utils/auth';

function ResetPasswordPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/todo'); // ✅ Auto-redirect if already logged in
    }
  }, [navigate]);
  
  return (
    <div className="auth-page">

      <Resetpassword />
    </div>
  );
}

export default ResetPasswordPage;
