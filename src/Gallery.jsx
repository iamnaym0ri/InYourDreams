import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useImages } from "../ImageContext";
import axios from "axios";
import GalleryDown from "./gallDownload";
import "./styles.css";
import DisclaimerModal from "../disclaimer";

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const [input, setInput] = useState(query); // for controlled input
  const [suggestions, setSuggestions] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);

  const { images, setImages } = useImages();

  const pageImages = images.slice(0, 100);

  useEffect(() => {
    if (!query) {
      setSearchParams({ query: "highres" });
      return;
    }

    axios
      .get("/api/gallery", { params: { query } })
      .then((res) => {
        setImages(res.data || []);
        if ((res.data || []).length === 0) setErrorMsg("No results found.");
        else setErrorMsg("");
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          setImages([]);
          setErrorMsg("Nothing to see here.");
        } else {
          setErrorMsg("Something went wrong while loading images.");
          console.error("Gallery load error:", err);
        }
      });
  }, [query]);

  const fetchTagSuggestions = async (text) => {
    if (!text) return setSuggestions([]);
    const res = await axios.get("/api/tags", { params: { term: text } });
    setSuggestions(res.data || []);
  };

  const handleSearch = () => {
    setSearchParams({ query: input }); // updates the URL
    setSuggestions([]);
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < images.length - 1)
      setSelectedIndex(selectedIndex + 1);
  };

  const handlePrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0)
      setSelectedIndex(selectedIndex - 1);
  };

  console.log("Images in context:", images.length);

  return (
    <>
    <DisclaimerModal />
      <div className="container py-4 gallery">
        <div className="nav-bar">
          <div className="item1">
            <input
              type="text"
              className="form-control search"
              placeholder="Search gallery..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                fetchTagSuggestions(e.target.value);
              }}
            />
            <button className="btn btn-success" onClick={handleSearch}>
              Search <i className="bi bi-search-heart" />
            </button>
            <Link to="/" className="btn btn-outline-secondary">
              Back <i className="bi bi-arrow-return-left" />
            </Link>
          </div>
          <div className="d-flex justify-content-center flex-column gap-1">
            <small>Use _ for for space instead😊</small>
            <Link to="/DMCA" className="dmca">Disclaimer and Copyright</Link>
          </div>

          {errorMsg && <h2 className="text-danger text-center">{errorMsg}</h2>}

          <div className="item2">
            {suggestions.length > 0 && (
              <div className="suggestion-box border bg-dark rounded child-item">
                {suggestions.slice(0, 10).map((tag) => (
                  <div
                    key={tag.label}
                    className="suggestion-item p-2 hover:bg-light cursor-pointer child"
                    onClick={() => {
                      setInput(tag.label);
                      setSearchParams({ query: tag.label });
                      setSuggestions([]);
                    }}
                  >
                    {tag.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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
          {Array.from({ length: Math.floor(images.length / 100) })
            .slice(1) // skip first page
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
                <GalleryDown imageUrl={images[selectedIndex].file_url} />
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
