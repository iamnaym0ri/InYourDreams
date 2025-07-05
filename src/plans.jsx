// PlansModal.jsx
import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import "./styles.css";
import toast from "react-hot-toast";

const PlansModal = forwardRef(
  ({ onClose, showtheConfirm, onCancelSuccess, onClickSuccess }, ref) => {
    const [subscriptionId, setSubscriptionId] = useState(null);
    const [plan, setPlan] = useState("free");
    const [loading, setLoading] = useState(false);
    const username = sessionStorage.getItem("username");

    useEffect(() => {
      if (!username) return;

      const fetchUserData = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/username/${username}`);
          const data = await res.json();
          if (res.ok && data.user) {
            setSubscriptionId(data.user.subscription_id || null);
            setPlan(data.user.plan || null);
          }
        } catch (err) {
          console.error("Failed to fetch user data:", err);
        }
      };

      fetchUserData();
    }, []);

    const startCheckout = async (plan) => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stripe/subscription-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId }),
      });
      const data = await res.json();

      if (subscriptionId && plan !== "free" && data.status === "active") {
        try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stripe/manage-subscription`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, newPlan: plan }),
          });

          const data = await res.json();
          if (data.success) {
            toast.success("Subscription updated!");
          } else {
            alert(data.error || "Failed to update subscription.");
          }
        } catch (err) {
          console.error("Manage sub error:", err);
          alert("Error updating subscription.");
        }
      } else {
        try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stripe/create-checkout-session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, plan }),
          });

          const data = await res.json();
          if (data.url) {
            console.log("redirecting...");
            window.location.href = data.url;
          } else {
            alert("Failed to create checkout session.");
          }
        } catch (err) {
          console.error("Checkout error:", err);
          alert("An error occurred during checkout.");
        }
      }
    };

    const handleCancel = async () => {
      if (!subscriptionId) return alert("No subscription ID");

      console.log("handleCancel has been initiated!");

      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stripe/cancel-subscription`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscriptionId, username }),
        });

        const data = await res.json();
        if (data.success) {
          toast.success(
            "Your Subscription has been cancelled. Come back any time!"
          );
          setSubscriptionId(null);
          if (onCancelSuccess) onCancelSuccess(); // Notify parent
        } else {
          alert("Cancellation failed.");
        }
      } catch (err) {
        console.error("Cancel error:", err);
        alert("Error canceling subscription.");
      } finally {
        setLoading(false);
      }
    };

    // 👇 Expose cancel function to parent
    useImperativeHandle(ref, () => ({
      triggerCancel: handleCancel,
      triggerCheckout: startCheckout, 
    }));

    return (
      <div className="disclaimer-overlay-plans">
        <div className="disclaimer-modal-plans">
          <h2>Choose Your Plan</h2>

          <h3>Plus – $7/month</h3>
          <div className="plan-card">
            <ul>
              <li>Limit Increase to 100 Image Gen/day</li>
              <li>
                High Generation Speed and High Quality Downloadable Images
              </li>
            </ul>
            <button className="plan-btn" onClick={() => {
              onClickSuccess("plus");
              }}>
              Choose Plus
            </button>
          </div>

          <h3>Pay-As-You-Go</h3>
          <div className="plan-card">
            <ul>
              <li>Unlimited Generation from Premium Models</li>
              <li>Just 5¢/Image Generation ($0.05), Billed Monthly</li>
              <li>After 1000 Generations, Price Drops to $0.03/Image!</li>
            </ul>
            <button className="plan-btn" onClick={() => {
              onClickSuccess("payg");
              }}>
              Choose Pay As You Go
            </button>
          </div>

          <h3>Premium – $14/month</h3>
          <div className="plan-card">
            <ul>
              <li>Limit Increase to 300 Image Gen/Day</li>
              <li>Access to Premium Models and Priority Queuing</li>
              <li>
                High Quality Downloadable Images and Fast Generation Times!
              </li>
              <li>
                Access to Image Search Function That Are Downloadable As Well!
              </li>
            </ul>
            <button
              className="plan-btn"
              onClick={() => {
                onClickSuccess("premium");
              }}
            >
              Choose Premium
            </button>
          </div>

          <button className="exit-btn-plans" onClick={onClose}>
            Close
          </button>

          {subscriptionId && plan != "free" && (
            <button
              onClick={showtheConfirm}
              disabled={loading}
              className="btn btn-outline-danger cancel-sub"
            >
              {loading ? "Canceling..." : "Cancel Subscription"}
            </button>
          )}
        </div>
      </div>
    );
  }
);

export default PlansModal;
