import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../utils/auth"; // ✅ Import setAuth
import "../App.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Redirect if already logged in
    useEffect(() => {
      const storedUsername = localStorage.getItem("username");
      const storedPassword = localStorage.getItem("password");
      const storedRole = localStorage.getItem("role");

      if (storedUsername && storedPassword && storedRole) {
        navigate("/", { replace: true });
      }
    }, [navigate]);
  console.log(navigate);
  const handleLogin = async (e) => {
    e.preventDefault();

    const reslogin = await fetch("https://todo-production-40cc.up.railway.app/api/auth/login", {
      method: "POST",
  headers: {
    Authorization: "Basic " + btoa(`${username}:${password}`),
  },
});

if (reslogin.ok) {
  const data = await reslogin.json();
  setAuth(username, password, data.role); // ✅ Save role
  //navigate("/", { replace: true });
}

    try {
      const res = await fetch("https://todo-production-40cc.up.railway.app/api/todos", {
        headers: {
          Authorization: "Basic " + btoa(`${username}:${password}`),
        },
      });

      if (res.ok) {
        //const userInfo = await res.json();
        //console.log(userInfo);
        //setAuth(username, password, userInfo.role); // ✅ Store auth properly
        navigate("/", { replace: true });
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
