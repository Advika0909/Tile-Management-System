
import React, { useState } from "react";
import axios from "axios";
import './App.css';
import { useNavigate } from "react-router-dom"; 
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const navigate = useNavigate();

  

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Attempting login with:", username, password);

    try {
      const response = await axios.post("http://localhost:53668/api/Auth/login", {
        username,
        password,
      });

      const token = response.data.token;
      console.log("✅ Token received:", token);
      localStorage.setItem("jwt", token);
      setToken(token);
      alert("Login successful ✅");
      
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Login failed:", error.response?.data || error.message);
      alert("Login failed ❌");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      {token && (
        <div className="token-display">
          <h4>JWT Token:</h4>
          <pre>{token}</pre>
        </div>
      )}
    </div>
  );
};

export default Login;
