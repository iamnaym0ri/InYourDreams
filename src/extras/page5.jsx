import { useState, useEffect } from "react";
import GalleryDown from "../gallDownload";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles.css";

export default function Gallery2() {
  const [images, setImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get("/api/gallery", {
          params: { pid: 400 },
        });
        setImages(res.data || []);
      } catch (err) {
        console.error("Failed to fetch images:", err);
        setErrorMsg("Could not load gallery.");
      }
    };
    fetchImages();
  }, []);

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  return (
    <>
      <div className="image-grid">
        {errorMsg && <h2 className="text-danger text-center">{errorMsg}</h2>}

        {images.map((img, index) => (
          <img
            key={index}
            src={img.preview_url}
            alt={`Post ${index}`}
            onClick={() => setSelectedIndex(index)}
            style={{ cursor: "pointer" }}
          />
        ))}
      </div>
      <div className="switch">
        <Link to="/gallery" className="btn switch-btn">
          <i className="bi bi-1-circle" />
        </Link>
        <Link to="/gallery2" className="btn switch-btn">
          <i className="bi bi-2-circle" />
        </Link>
        <Link to="/gallery3" className="btn switch-btn">
          <i className="bi bi-3-circle" />
        </Link>
        <Link to="/gallery4" className="btn switch-btn">
          <i className="bi bi-4-circle" />
        </Link>
        <Link to="/gallery5" className="btn switch-btn">
          <i className="bi bi-5-circle" />
        </Link>
      </div>

      {selectedIndex !== null && images[selectedIndex] && (
        <div className="preview-overlay">
          <div className="preview-container">
            <img
              src={images[selectedIndex].file_url}
              alt="Full View"
              style={{ maxWidth: "100%", maxHeight: "80vh" }}
            />
            <div className="d-flex justify-content-between mt-2 gap-2">
              <button
                className="btn btn-secondary"
                onClick={handlePrevious}
                disabled={selectedIndex === 0}
              >
                Previous
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleNext}
                disabled={selectedIndex === images.length - 1}
              >
                Next
              </button>
              <GalleryDown url={images[selectedIndex].file_url} />
              <button
                className="btn btn-danger"
                onClick={() => setSelectedIndex(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
