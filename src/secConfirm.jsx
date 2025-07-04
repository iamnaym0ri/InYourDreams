import "./styles.css";

export default function Confirm({ onConfirm, onCancel, plan }) {
  return (
    <div className="confirm-overlay-sec">
      <div className="confirm-box-sec">
        <h3>Confirm Switch To {plan.toUpperCase()} Subscription?</h3>
        <div className="confirm-buttons-sec">
          <button className="btn btn-outline-success" onClick={onConfirm}>
            Confirm
          </button>
          <button className="btn btn-outline-danger" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
