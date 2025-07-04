import { Link } from "react-router-dom";


export default function DMCA() {
  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", fontSize: "0.95rem", lineHeight: "1.5" }}>
      <h1>DMCA & Copyright Notice</h1>
      <p>
        We respect the intellectual property rights of creators and copyright holders.
        All images displayed in our Image Search feature are provided via the Gelbooru API
        and belong to their respective creators.
      </p>
      <p>
        If you are a copyright holder and believe your work has been displayed without
        permission, please contact us at <span style={{ fontWeight: "bold" , fontSize: "large"}}>rora.socials77@gmail.com</span> 
        and we will promptly remove the content.
      </p>
      <p>Thank you for your understanding and support.</p>
      <Link to="/gallery" className="btn btn-outline-secondary">Back</Link>
    </div>
  );
}
