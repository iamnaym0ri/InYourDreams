// CancelConfirmModal.jsx
import "./styles.css";

export default function CancelConfirmModal({ plan, onConfirm, onClose }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-cancel">
        <div className="confirm-cancel-inner">
          <h2>Are You Really Sure?😔</h2>
          <p>
            Are you very very sure you want to cancel your <strong>{plan}</strong>{" "}
            subscription? You will be switched to free tier
          </p>
          <div className="modal-actions">
            <button className="confirm-btn btn btn-outline-danger" onClick={onConfirm}>
              Yes, Cancel
            </button>
            <button className="cancel-btn btn btn-outline-success" onClick={onClose}>
              Keep Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
