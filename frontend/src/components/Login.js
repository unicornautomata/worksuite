import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../utils/auth"; // ✅ Import setAuth
import "../App.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://todo-production-40cc.up.railway.app/api/todos", {
        headers: {
          Authorization: "Basic " + btoa(`${username}:${password}`),
        },
      });

      if (res.ok) {
        const userInfo = await res.json();
        console.log(userInfo);
        setAuth(username, password, userInfo.role); // ✅ Store auth properly
        navigate("/");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error(err);
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
        {error && <p className="error">{error}</p>}
      </form>
      <p>
        Don't have an account?{" "}
        <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
}

export default Login;
