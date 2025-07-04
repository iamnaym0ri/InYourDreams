import { useSearchParams, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useImages } from "../ImageContext";
import GalleryDown from "./gallDownload";

export default function GalleryPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const page = parseInt(id, 10) || 1;
  const start = (page - 1) * 100;
  const end = page * 100;

  const { images, setImages } = useImages();
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    if (!query) return;
    if (images.length === 0) {
      axios.get("/api/gallery", { params: { query } }).then((res) => {
        setImages(res.data || []);
      });
    }
  }, [query]);

  const pageImages = images.slice(start, end);

  console.log("Images in context:", images.length);
  console.log("Page:", page);
  console.log("Sliced images:", images.slice(start, end).length);

  return (
    <>
      <div className="switch">
        <Link to={`/gallery?query=${query}`} className="btn switch-btn">
          <i className="bi bi-arrow-left-circle" /> Page 1
        </Link>
        {Array.from({ length: Math.floor(images.length / 100) })
          .slice(1)
          .map((_, i) => {
            const page = i + 2;
            return (
              <Link
                key={page}
                to={`/gallery/page/${page}?query=${query}`}
                className="btn switch-btn"
              >
                <i className={`bi bi-${page}-circle`} />
              </Link>
            );
          })}
      </div>

      <div className="container py-4 gallery">
        <div className="image-grid">
          {pageImages.map((img, index) => (
            <img
              key={index}
              src={img.preview_url}
              onClick={() => setSelectedIndex(index)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>

        <div className="switch">
          <Link to={`/gallery?query=${query}`} className="btn switch-btn">
            <i className="bi bi-arrow-left-circle" /> Page 1
          </Link>
          {Array.from({ length: Math.floor(images.length / 100) })
            .slice(1)
            .map((_, i) => {
              const page = i + 2;
              return (
                <Link
                  key={page}
                  to={`/gallery/page/${page}?query=${query}`}
                  className="btn switch-btn"
                >
                  <i className={`bi bi-${page}-circle`} />
                </Link>
              );
            })}
        </div>

        {selectedIndex !== null && (
          <div className="preview-overlay">
            <div className="preview-container">
              <img
                src={pageImages[selectedIndex].file_url}
                alt="Full View"
                style={{ maxWidth: "100%", maxHeight: "80vh" }}
              />
              <div className="d-flex justify-content-between mt-2 gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedIndex(selectedIndex - 1)}
                  disabled={selectedIndex === 0}
                >
                  Previous
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedIndex(selectedIndex + 1)}
                  disabled={selectedIndex === pageImages.length - 1}
                >
                  Next
                </button>
                <GalleryDown imageUrl={pageImages[selectedIndex].file_url} />
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
      </div>
    </>
  );
}
