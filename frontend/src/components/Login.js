import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../utils/auth";
import "../App.css";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");
    const storedRole = localStorage.getItem("role");

    if (storedUsername && storedPassword && storedRole) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setShowResend(false);
    setResendSent(false);

    try {
      //const reslogin = await fetch("http://localhost:8080/api/auth/login", {
      const reslogin = await fetch("https://todo-production-40cc.up.railway.app/api/auth/login", {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${username}:${password}`),
        },
      });

      const loginData = await reslogin.json();

      if (!reslogin.ok) {
        if (
          loginData.error &&
          loginData.error.toLowerCase().includes("email")
        ) {
          setError(
            "⚠ You have invalid credentials or your email has not yet been verified."
          );
          setShowResend(true);
        } else {
          setError("Invalid credentials. Please try again.");
        }
        return;
      }

      setAuth(username, password, loginData.role);

      const res = await fetch("https://todo-production-40cc.up.railway.app/api/todos", {
        headers: {
          Authorization: "Basic " + btoa(`${username}:${password}`),
        },
      });

      if (res.ok) {
        navigate("/todo", { replace: true });
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    }
  };

  const handleResendVerification = async () => {
    try {
      const res = await fetch("https://todo-production-40cc.up.railway.app/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username })
      });

      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (res.ok) {
          setResendSent(true);
        } else {
          setError(data.error || "Failed to resend verification email.");
        }
      } catch {
        setError(text || "Failed to resend verification email.");
      }
    } catch (err) {
      console.error("Error resending verification:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>🔐 Login</h2>
      <form onSubmit={handleLogin} className="auth-form">
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
        <button type="submit">Login</button>
        {error && (
          <p className="error">
            {error}{" "}
            {showResend && !resendSent && (
              <button
                onClick={handleResendVerification}
                type="button"
                className="resend-link"
              >
                Resend verification email?
              </button>
            )}
            {resendSent && (
              <span className="resend-success">
              <br/>
                ✅ Verification email was sent. Check your inbox.
              </span>
            )}
          </p>
        )}
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
}

export default Login;
