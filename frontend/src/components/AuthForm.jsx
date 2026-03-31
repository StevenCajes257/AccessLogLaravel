import React, { useState } from "react";
import axios from "axios";

const AuthForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:8082/api/register", {
        name, email, password
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8082/api/login", {
        email, password
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Test Auth</h2>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} /><br />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} /><br /><br />
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin} style={{ marginLeft: "1rem" }}>Login</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AuthForm;