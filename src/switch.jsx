import { useState } from "react";
import "./styles.css";

export default function ModelSwitchModal({ onClose, onConfirm }) {
  const [selectedModel, setSelectedModel] = useState(null);

  const handleConfirm = () => {
    if (!selectedModel) return; // optional: prevent confirming without selection
    onConfirm(selectedModel);
  };

  return (
    <div className="modal-overlay-switch">
      <div className="modal-container-switch">
        <h2>Select Model Type</h2>

        <div className="model-options-switch">
          <label className="model-choice-switch">
            <input
              type="radio"
              name="modelType"
              value="sfw"
              onChange={(e) => setSelectedModel(e.target.value)}
            />
            <span>SFW Model</span>
          </label>

          <label className="model-choice-switch">
            <input
              type="radio"
              name="modelType"
              value="nsfw"
              onChange={(e) => setSelectedModel(e.target.value)}
            />
            <span>NSFW Models</span>
          </label>
          <label className="model-choice-switch">
            <input
              type="radio"
              name="modelType"
              value="free"
              onChange={(e) => setSelectedModel(e.target.value)}
            />
            <span>Free Model Stable Horde</span>
          </label>
        </div>

        <div className="modal-actions-switch">
          <button className="btn btn-outline-success" onClick={handleConfirm}>Select</button>
          <button className="btn btn-outline-danger" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
