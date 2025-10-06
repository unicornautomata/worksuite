import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../App.css";

function NewPassword() {
  const apiUrl = localStorage.getItem("apiserver");
  const [searchParams] = useSearchParams();

  // Extract token + username from URL
  const token = searchParams.get("token");
  const username = searchParams.get("username");

  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [retypepassword, setRetypePassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !username) {
      setMessage("Invalid reset link. Missing token or username.");
    }
  }, [token, username]);

  const handleNewPassword = async (e) => {
    e.preventDefault();

    if (password !== retypepassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/auth/updatepassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          token: token,
          newPassword: password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Password updated successfully.");
        setTimeout(() => navigate("/login"), 4000);
      } else {
        setMessage(data.error || "Failed to update password.");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="auth-container">
      <h2>🛠️ Set New Password</h2>
      <form onSubmit={handleNewPassword} className="auth-form">
        <p>Enter your:</p>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Retype Password"
          value={retypepassword}
          required
          onChange={(e) => setRetypePassword(e.target.value)}
        />

        <button type="submit">Submit</button>
        {message && <p className="info">{message}</p>}
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
      <p>
        Unverified account? <a href="/resendverification">Resend</a>
      </p>
    </div>
  );
}

export default NewPassword;
