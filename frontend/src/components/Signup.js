import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://todo-production-40cc.up.railway.app/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Account created! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(data.message || "Signup failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="auth-container">
      <h2>📝 Sign Up</h2>
      <form onSubmit={handleSignup} className="auth-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Create Account</button>
        {message && <p className="info">{message}</p>}
      </form>
      <p>
        Already have an account?{" "}
        <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default Signup;
