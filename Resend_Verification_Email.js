import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const Resend_Verification_Email = () => {
  const location = useLocation();
  const username = location.state?.username || ""; // username passed from login.js
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const apiUrl = localStorage.getItem("apiserver")

  useEffect(() => {
    if (!username) {
      setError("No username provided. Please go back and enter your username.");
      return;
    }

    // Same as:
    // curl -v -X POST http://localhost:8081/api/auth/resend-verification \
    // -H "Content-Type: application/json" \
    // -d "{\"username\":\"bob\"}"
    fetch(`${apiUrl}/api/auth/resend-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username })
    })
      .then(async (res) => {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (res.ok) {
            setMessage(data.message || "Verification email sent. Please check your inbox.");
          } else {
            setError(data.error || "Failed to resend verification email.");
          }
        } catch {
          setError(text || "Unexpected server response.");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Unable to connect to the server.");
      });
  }, [username]);

  return (
    <div className="container text-center mt-5">
      <h1>Email Verification</h1>

      {message && <p className="mt-3 text-success">{message}</p>}
      {error && <p className="mt-3 text-danger">{error}</p>}

      <Link to="/login" className="btn btn-primary mt-3">
        Login
      </Link>
    </div>
  );
};

export default Resend_Verification_Email;
