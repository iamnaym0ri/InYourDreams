const DownloadButton = ({ imageUrl }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl, { mode: "cors" });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "generated-image.jpg";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Please try again.");
    }
  };

  return (
    <button
      className="btn btn-outline-success"
      onClick={handleDownload}
      title="Download Image"
    >
      <i className="bi bi-box-arrow-down"></i>
      Download
    </button>
  );
};

export default DownloadButton;
