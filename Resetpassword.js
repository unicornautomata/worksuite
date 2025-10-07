import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../App.css";

function Resetpassword() {
  const apiUrl = localStorage.getItem("apiserver")
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email) => {
     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   };

  const handleResetPassword = async (e) => {
     e.preventDefault();
    // ✅ Check email validity
    if ((email === null || email === '') && (username === null || username === '')) {
      setMessage("Please enter a valid username or email address.");
      setTimeout(() =>  setMessage(""), 4500);
      return;
    }
    if (!isValidEmail(email) && (email !== null || email !== '') && (username === null || username === '')) {
      setMessage("Please enter a valid email address.");
      setTimeout(() =>  setMessage(""), 4500);
      return;
    }
    if ((email === null || email === '') && (username !== null || username !== '')) {
    try {

      const res = await fetch(`${apiUrl}/api/auth/checkuser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (res.ok) {
        const resetRes = await fetch(`${apiUrl}/api/auth/resetpassword`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, email: "" }),
            });

            const resetData = await resetRes.json();

            if (resetRes.ok) {
              setMessage(resetData.message || "Reset password email sent.");
            } else {
              setMessage(resetData.error || "Failed to send reset email.");
            }

            setTimeout(() => setMessage(""), 4500);


      } else {
        setMessage(data.message || "User not found.");
        setTimeout(() => setMessage(""), 4500);
        return;
      }


    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
    }  else {
      try {
      const res = await fetch(`${apiUrl}/api/auth/checkemail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();


      if (res.ok) {
        const resetRes = await fetch(`${apiUrl}/api/auth/resetpassword`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username: "", email }),
            });

            const resetData = await resetRes.json();

            if (resetRes.ok) {
              setMessage(resetData.message || "Reset password email sent.");
            } else {
              setMessage(resetData.error || "Failed to send reset email.");
            }

            setTimeout(() => setMessage(""), 4500);



      } else {
        setMessage(data.message || "Email not found.");
        setTimeout(() => setMessage(""), 4500);
        return;
      }


    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
    }

  };

  return (
    <div className="auth-container">
      <h2>🛠️ Reset Password</h2>
      <form onSubmit={handleResetPassword} className="auth-form">
      <p>Enter your:</p>
        <input
          type="text"
          placeholder="Username"
          value={username}

          onChange={(e) => setUsername(e.target.value)}
        />
        <p> -- or -- </p>
        <input
          type="text"
          placeholder="Email"
          value={email}

          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Submit</button>
        {message && <p className="info">{message}</p>}
      </form>
      <p>
        Already have an account?{" "}
        <a href="/login">Login</a>
      </p>
      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
      <p>
        Unverified account?{" "}
        <a href="/resendverification">Resend</a>
      </p>
    </div>
  );
}

export default Resetpassword;
