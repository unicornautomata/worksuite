import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const VerifyEmail = () => {
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
        const response = await fetch(`https://todo-production-40cc.up.railway.app/api/auth/verify?token=${token}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        const data = await response.json();

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
