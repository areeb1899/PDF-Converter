import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const JPGToPDF = () => {
  const BASE_URL = import.meta.env.PROD
    ? "https://pdf-converter-qsbi.onrender.com"
    : "http://localhost:5000";

  const [file, setFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDownloadLink("");
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return setError("Please select a JPG/JPEG file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/api/convert/jpg-to-pdf`, formData);
      setDownloadLink(`${BASE_URL}${res.data.downloadUrl}`);
      setError("");
    } catch (err) {
      setError("Conversion failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-12">
      <h2 className="text-3xl sm:text-5xl font-bold mb-10 text-center text-gray-800">
        JPG to PDF Converter
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
            id="jpgUpload"
            type="file"
            accept=".jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="jpgUpload"
            className="inline-flex items-center px-5 py-2 bg-white text-blue-600 font-semibold rounded shadow hover:bg-gray-100 cursor-pointer"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Choose File
          </label>
        </div>

        {file && <p className="mt-3 text-sm text-white">Selected: {file.name}</p>}

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`mt-6 inline-block w-full sm:w-auto px-6 py-2 bg-blue-700 hover:bg-blue-800 font-medium text-white rounded ${loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          {loading ? "Converting..." : "Convert to PDF"}
        </button>

        {error && <p className="mt-4 text-sm text-red-100">{error}</p>}
        {downloadLink && (
          <div className="mt-6">
            <a
              href={downloadLink}
              download
              target="_blank"
              rel="noreferrer"
              className="inline-block px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold transition"
            >
              Download PDF
            </a>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default JPGToPDF;
