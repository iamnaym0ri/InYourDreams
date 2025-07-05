import { useState } from "react";
import toast from "react-hot-toast";
import "./styles.css";

export default function FeedbackModal({ username, onClose }) {
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, feedback }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Feedback Submitted!");
        onClose();
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error("❌ Feedback error:", err);
      alert("Server error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay-feedback">
      <div className="modal-content-feedback">
        <h3 className="mb-2 text-align-center mb-4">What would you like to be improved or changed?</h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Type your thoughts here..."
          className="form-control mb-3"
          rows={5}
        />
        <div className="d-flex justify-content-end">
          <button className="btn btn-danger me-2" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-success"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
