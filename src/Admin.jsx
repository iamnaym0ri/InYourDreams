// AdminPasswordModal.jsx
import { useState } from "react";
import "./styles.css"; 

export default function AdminPasswordModal({ onClose, onFailure , onSuccess }) {
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/admin/verify-admin-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      onSuccess();
    } else {
      onFailure();
    }
  };

  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal">
        <h2>Administrator Phrase Detected! Welcome Joshua</h2>
        <p>Input Your Admin Password</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********************"
        />
        <div className="buttons">
          <button className="btn btn-outline-success" onClick={handleSubmit}>Enter</button>
          <button className="btn btn-outline-danger" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
