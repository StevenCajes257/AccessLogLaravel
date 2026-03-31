import React, { useState } from "react";
import axios from "axios";

const TestLog = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const sendTest = async () => {
    try {
      setError(null);
      const res = await axios.get("http://localhost:8082/api/test"); // Laravel API URL
      setResponse(res.data);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setResponse(null);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>Test Laravel API</h2>
      <button onClick={sendTest} style={{ padding: "0.5rem 1rem" }}>
        Send Test
      </button>

      {response && (
        <div style={{ marginTop: "1rem", color: "green" }}>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div style={{ marginTop: "1rem", color: "red" }}>
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default TestLog;