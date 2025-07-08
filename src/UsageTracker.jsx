import { useEffect, useState } from "react";
import "./styles.css";

export default function UsageTracker({
  username,
  triggerRefresh,
  admin,
  model,
}) {
  const [usage, setUsage] = useState(null);
  const [limit, setLimit] = useState(null);
  const [plan, setPlan] = useState("free");

  useEffect(() => {
    if (!username) return;

    const fetchUsage = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/usage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });
        const data = await res.json();
        if (data && data.allowed !== undefined) {
          setUsage(data.usage || 0);
          setLimit(data.limit || 0);
        }
      } catch (err) {
        console.error("Failed to fetch usage:", err);
      }
    };

    fetchUsage();
  }, [username, triggerRefresh]);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) return;

    const fetchPlan = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/username/${username}`);
        const data = await res.json();
        if (res.ok && data.user?.plan) {
          setPlan(data.user.plan);
        }
      } catch (err) {
        console.error("Failed to fetch plan:", err);
      }
    };

    fetchPlan();
  }, []);

  const percentage = Math.min((usage / limit) * 100, 100);

  if (admin === true) {
    return (
      <>
        <div style={{ textAlign: "center", marginTop: "12px" }} className="adminM">
          <div
            style={{
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: "8px",
              backgroundColor: "#000",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "0.9rem",
              boxShadow: "0 0 6px 2px white",
              marginBottom: "6px",
            }}
          >
            ADMIN MODE
          </div>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ marginTop: "6px", color: "#fff", fontSize: "0.85rem" }}
          >
            <i
              className="bi bi-infinity mt-1"
              style={{ fontSize: "18px", marginRight: "6px" }}
            ></i>
            Generations
          </div>
          <div style={{ color: "#ccc", fontSize: "0.8rem", marginTop: "4px" }}>
            {usage} Images Generated
          </div>
        </div>
        <div className="d-flex align-items-center">
          <p className="mt-4 ms-3">Current Model In Use: {model}</p>
        </div>
      </>
    );
  }

  if (plan === "payg") {
    return (
      <div className="payg-Tracker">
        <div className="payg1">{usage} / </div>
        <div className="payg2">
          <i className="bi bi-infinity" style={{ fontSize: "26px" }}></i>
        </div>
        <div className="payg3">Images Used</div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "12px", textAlign: "center" }} className="tracker">
      <div
        style={{
          backgroundColor: "#333",
          borderRadius: "12px",
          overflow: "hidden",
          height: "16px",
          width: "80%",
          margin: "0 auto",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: percentage < 100 ? "#0d6efd" : "#dc3545",
            transition: "width 0.3s ease",
          }}
        ></div>
      </div>
      <div
        style={{
          marginTop: "6px",
          fontSize: "0.85rem",
          color: percentage < 100 ? "#ccc" : "#ff6666",
        }}
      >
        {usage} / {limit} Images Used
      </div>
    </div>
  );
}
