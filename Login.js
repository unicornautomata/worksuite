import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (token && storedUsername) {
      navigate("/todo", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setShowResend(false);
    setResendSent(false);

    try {
      const authHeader = "Basic " + btoa(`${username}:${password}`);

      const reslogin = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/json"
        },
      });

      const loginData = await reslogin.json();

      if (!reslogin.ok) {
        // Handle email not verified error (403)
        if (reslogin.status === 403 && loginData.resendAvailable) {
          setError("⚠ Your email has not been verified. Please verify your email before logging in.");
          setShowResend(true);
        } else if (loginData.error) {
          setError(loginData.error);
        } else {
          setError("Invalid credentials. Please try again.");
        }
        return;
      }

      // ✅ Store everything in localStorage
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);

      // Parse and store userInfo (username:role:education)
      if (loginData.userInfo) {
        const [user, role, education, occupation] = loginData.userInfo.split(":");
        localStorage.setItem("role", role || "");
        if (education) localStorage.setItem("education", education);
        if (occupation) localStorage.setItem("occupation", occupation);
      }

      // Store all user details
      if (loginData.email) localStorage.setItem("email", loginData.email);
      if (loginData.fullname) localStorage.setItem("fullname", loginData.fullname);
      if (loginData.skills) localStorage.setItem("skills", loginData.skills);
      if (loginData.address) localStorage.setItem("address", loginData.address);
      if (loginData.notes) localStorage.setItem("notes", loginData.notes);
      if (loginData.experience) localStorage.setItem("experience", loginData.experience);
      if (loginData.picture) localStorage.setItem("picture", loginData.picture);

      // Dispatch event for profile picture update
      if (loginData.picture) {
        window.dispatchEvent(new CustomEvent("profile-picture-updated", {
          detail: { picture: loginData.picture }
        }));
      }

      console.log("Login successful:", loginData);

      // Navigate to todo page
      navigate("/todo", { replace: true });

    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please check your connection and try again.");
    }
  };

  const handleResendVerification = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/auth/resend-verification", {
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
          setShowResend(false);
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
      <p>
  Unverified account?{" "}
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      if (!username) {
        setError("⚠ Please enter your username first.");
        return;
      }
      navigate("/resendverification", { state: { username } });
    }}
  >
    Resend
  </a>
</p>
      <p>
        <a href="/resetpassword">Reset Password{" "}
        </a>
      </p>
    </div>
  );
}

export default Login;
