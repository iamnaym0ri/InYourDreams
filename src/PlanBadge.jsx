import "./styles.css"

const planStyles = {
  free: {
    background: "#888",
    label: "FREE",
    shadow: "0 0 4px #aaa",
    fontSize: "0.75rem",
    fontWeight: "normal",
    padding: "4px 10px",
    borderRadius: "6px",
    letterSpacing: "0.3px",
  },
  plus: {
    background: "#0d6efd",
    label: "PLUS",
    shadow: "0 0 6px rgba(13, 110, 253, 0.6)",
    fontSize: "0.85rem",
    fontWeight: "600",
    padding: "5px 12px",
    borderRadius: "8px",
    letterSpacing: "0.5px",
  },
  premium: {
    background: "#d63384",
    label: "PREMIUM",
    shadow: "0 0 10px rgba(236, 222, 15, 0.7)",
    fontSize: "0.95rem",
    fontWeight: "700",
    padding: "6px 14px",
    borderRadius: "10px",
    letterSpacing: "0.8px",
  },
  payg: {
    background: "#20c997",
    label: "PAY-AS-YOU-GO",
    shadow: "0 0 12px rgba(32, 201, 116, 0.7)",
    fontSize: "0.9rem",
    fontWeight: "600",
    padding: "5px 13px",
    borderRadius: "12px",
    letterSpacing: "0.6px",
  },
};

export default function PlanBadge({ plan, admin }) {
  const style = planStyles[plan?.toLowerCase()] || planStyles["free"];
  if(admin) return;

  return (
    <span
      style={{
        marginLeft: "10px",
        backgroundColor: style.background,
        color: "#fff",
        padding: style.padding,
        borderRadius: style.borderRadius,
        fontWeight: style.fontWeight,
        fontSize: style.fontSize,
        boxShadow: style.shadow,
        letterSpacing: style.letterSpacing,
        textTransform: "uppercase",
      }}
      className="badges"
    >
      {style.label}
    </span>
  );
}
