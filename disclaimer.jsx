import { useEffect, useState } from "react";
import "./src/styles.css";

export default function DisclaimerModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasAgreed = sessionStorage.getItem("agreed");
    if (!hasAgreed) {
      setShow(true);
    }
  }, []);

  const handleAgree = () => {
    sessionStorage.setItem("agreed", "true");
    setShow(false);
  };

  const handleExit = () => (window.location.href = "https://www.google.com");

  if (!show) return null;

  return (
    <div className="disclaimer-overlay">
      <div className="disclaimer-modal">
        <h2>Content Warning</h2>
        <p>This site contains AI-generated adult content / explicit content. You must be 18+ to enter.</p>
        <p style={{ fontSize: "0.85rem", marginTop: "1rem", color: "#ccc" }}>
          By clicking "I Am 18+ / Enter", you confirm you're 18 or older and agree to our{" "}
          <a href="/legal" style={{ color: "#0af", textDecoration: "underline" }}>
            Terms of Service & Privacy Policy
          </a>.
        </p>
        <div className="btn-row">
          <button className="agree-btn" onClick={handleAgree}>I Am 18+ / Enter</button>
          <button className="exit-btn" onClick={handleExit}>No / Exit Site</button>
        </div>
      </div>
    </div>
  );
}
