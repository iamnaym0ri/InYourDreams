const GalleryDown = ({ imageUrl }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `/api/download?url=${encodeURIComponent(imageUrl)}`;
    link.download = "image.jpg";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <button className="btn btn-outline-success" onClick={handleDownload}>
      <i className="bi bi-box-arrow-down"></i> Download
    </button>
  );
};

export default GalleryDown;