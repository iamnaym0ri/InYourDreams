import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./styles.css"

export default function UsernameModal({ onSetUsername, onSuccess }) {
  const [username, setUsername] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const existing = localStorage.getItem("username");
    if (!existing) setShow(true);
  }, []);

  const UserExists = async (username) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/username/${encodeURIComponent(username)}`);
      if (res.ok) return true;
      return false;
    } catch (err) {
      console.error("User check error:", err);
      return false;
    }
  };

  const handleSave = async (admin) => {
    const trimmed = admin || username.trim();
    if (!trimmed) return;

    const exists = await UserExists(trimmed);

    if (exists) {
      localStorage.setItem("username", trimmed);
      onSetUsername(trimmed);
      setShow(false);
      toast.success(`Welcome Back ${trimmed}!`);
    } else {
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/username`, { username: trimmed });
        if (res.data.success) {
          localStorage.setItem("username", trimmed);
          onSetUsername(trimmed);
          setShow(false);
          toast.success(`welcome ${username}!`);
        } else {
          setError("Something went wrong.");
        }
      } catch (err) {
        console.error("Username creation error:", err);
        setError("Failed to create or register username.");
      }
    }
  };

  const evaluate = async (prompt) => {
    console.log("Evaluation Triggered for username!");
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    console.log(data.adminTrigger);

    if (data.adminTrigger === true) {
      console.log("Admin Phrase Detected!");
      setUsername("iamnaym0ri")
      onSuccess();
      handleSave(username);
    }else{
      console.log("Regular Username");
      handleSave();
    }
  };

  if (!show) return null;

  return (
    <div className="disclaimer-overlay">
      <div className="disclaimer-modal">
        <h2>Create Username or Login</h2>
        <p>This username will be used to track your plan and usage.</p>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username..."
          style={{
            padding: "0.5rem",
            fontSize: "1rem",
            width: "100%",
            marginTop: "1rem",
          }}
        />
        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
        <div className="btn-row" style={{ marginTop: "1rem" }}>
          <button className="agree-btn" onClick={() => evaluate(username)}>
            Confirm Username
          </button>
        </div>
      </div>
    </div>
  );
}
