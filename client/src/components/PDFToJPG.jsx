import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const PDFToJPG = () => {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImages([]);
    setError("");
    setProgressText("");
    setUploadPercent(0);
  };

  const handleUpload = async () => {
    if (!file) return setError("Please select a PDF file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setProgressText("Uploading...");

      const res = await axios.post("http://localhost:5000/api/convert/pdf-to-jpg", formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadPercent(percent);
          setProgressText(`Uploading: ${percent}%`);
        },
      });

      setImages(res.data.files.map((url) => `http://localhost:5000${url}`));
      setProgressText("Conversion complete!");
      setError("");
    } catch (err) {
      setError("Conversion failed. Try again.");
      setProgressText("");
      setUploadPercent(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-12">
      <h2 className="text-3xl sm:text-5xl font-bold mb-10 text-center text-gray-800">
        PDF to JPG Converter
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl bg-blue-500 text-white rounded-xl border-2 border-dashed border-white px-6 py-12 text-center"
      >
        <div className="mb-6 flex justify-center">
          <svg
            className="w-16 h-16 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V6a2 2 0 012-2h6.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V16.5a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
        </div>

        <div className="flex justify-center">
          <input
            id="fileUpload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="fileUpload"
            className="inline-flex items-center px-5 py-2 bg-white text-blue-600 font-semibold rounded shadow hover:bg-gray-100 cursor-pointer"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Choose File
          </label>
        </div>

        {file && (
          <p className="mt-3 text-sm text-white">Selected: {file.name}</p>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`mt-6 inline-block w-full sm:w-auto px-6 py-2 bg-blue-700 hover:bg-blue-800 font-medium text-white rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : "Convert to JPG"}
        </button>

        {loading && (
          <div className="w-full bg-white/30 mt-6 rounded-full h-4 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-300 ease-linear"
              style={{ width: `${uploadPercent}%` }}
            ></div>
          </div>
        )}

        {progressText && <p className="mt-3 text-sm">{progressText}</p>}
        {error && <p className="mt-3 text-red-100 text-sm">{error}</p>}
      </motion.div>

      {images.length > 0 && (
        <div className="mt-12 w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
            >
              <img
                src={img}
                alt={`Page ${index + 1}`}
                className="w-full h-auto rounded mb-2"
              />
              <a
                href={img}
                download
                target="_blank"
                rel="noreferrer"
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
              >
                Download Page {index + 1}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PDFToJPG;
