import "./styles.css";
import { Link } from "react-router-dom";

export default function LegalPage() {
  return (
   <>
    <div className="legal-page container py-5 text-white">
    <h1 className="mb-4">Terms of Service</h1>
    <p><strong>Effective Date:</strong> 07/04/2025</p>
    <p><strong>Eligibility:</strong> You must be 18 years or older to use this site. By accessing it, you confirm you meet this requirement.</p>
    <p><strong>Content Warning:</strong> This site contains AI-generated adult content. All content is fictional and not representative of real individuals.</p>
    <p><strong>Username and Access:</strong> You may use the platform with a self-selected username. Paid access is tied to your username and may not be shared.</p>
    <p><strong>Subscriptions:</strong> Paid access costs $7/month minimum. Payments are handled by Stripe and are non-refundable.</p>
    <p><strong>Prohibited Actions:</strong> You may not bypass age checks, scrape content, or redistribute material from this platform.</p>
    <p><strong>Termination:</strong> We may revoke access for any policy violations without notice or refund.</p>

    <h1 className="mt-5 mb-4">Privacy Policy</h1>
    <p><strong>Information Collected:</strong> We collect only your username and payment confirmation data via Stripe. No personal details or passwords.</p>
    <p><strong>Use of Data:</strong> Your username is used to track paid access. We do not sell or share data with third parties.</p>
    <p><strong>Cookies:</strong> We may use basic cookies for session management. You may disable them in your browser if desired.</p>
    <p><strong>Security:</strong> We use standard protections but cannot guarantee absolute safety. Use at your own risk.</p>
    <p><strong>Third-Party Services:</strong> Stripe processes payments under its own policies. We are not responsible for their data handling.</p>
    <p><strong>Contact:</strong> For any questions, reach us at: rora.socials77@gmail.com</p>
    </div>

    <Link to="/" className="btn btn-outline-secondary">
        Back
    </Link>
   </>
  );
}
