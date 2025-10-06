import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
const VerifyEmail = () => {
  
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/todo'); // ✅ Auto-redirect if already logged in
    }
  }, [navigate]);

  const apiUrl = localStorage.getItem("apiserver");
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Verifying...');
  const token = searchParams.get('token');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('No verification token provided.');
        return;
      }

      try {
        console.log(`Token from URL: ${token}`);
        const response = await fetch(`${apiUrl}/api/auth/verify?token=${token}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        let data = {};
        try {
            data = await response.json(); // parse JSON if possible
          } catch (err) {
            console.warn('Response is not JSON', err);
          }
        console.log(`API Response: ${data.message}`);
        if (response.ok) {
          setStatus(data.message || 'Email verified successfully!');
        } else {
          setStatus(data.error || 'Verification failed.');
        }

      } catch (error) {
        setStatus('An error occurred while verifying your email.');
        console.error(error);
      }
    };

    verify();
  }, [token]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Email Verification</h2>
      <p>{status}</p>
    </div>
  );
};

export default VerifyEmail;
