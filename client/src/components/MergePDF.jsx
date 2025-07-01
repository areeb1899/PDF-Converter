import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FiFilePlus, FiTrash2, FiMove } from "react-icons/fi";

const MergePDF = () => {
  const [files, setFiles] = useState([]);
  const [mergedURL, setMergedURL] = useState("");
  const [error, setError] = useState("");
  const [progressText, setProgressText] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setError("");
    setMergedURL("");
    setProgressText("");
    setProgressPercent(0);
  };

  const handleDelete = (indexToRemove) => {
    const updated = files.filter((_, index) => index !== indexToRemove);
    setFiles(updated);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const updatedFiles = Array.from(files);
    const [moved] = updatedFiles.splice(result.source.index, 1);
    updatedFiles.splice(result.destination.index, 0, moved);
    setFiles(updatedFiles);
  };

  const handleUpload = async () => {
    if (files.length < 2) return setError("Select at least two PDFs");

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      setLoading(true);
      setProgressText("Uploading...");

      const res = await axios.post("http://localhost:5000/api/convert/merge-pdf", formData, {
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgressPercent(percent);
          setProgressText(`Uploading: ${percent}%`);
        },
      });

      setMergedURL(`http://localhost:5000${res.data.file}`);
      setProgressText("Merge complete!");
    } catch (err) {
      setError("Merging failed. Try again.");
      setProgressText("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-12">
      <h2 className="text-3xl sm:text-5xl font-bold mb-10 text-center text-gray-800">
        Merge PDF Files
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl bg-blue-500 text-white rounded-xl border-2 border-dashed border-white px-6 py-12 text-center"
      >
        <div className="mb-6 flex justify-center">
          <FiFilePlus className="w-16 h-16 text-white" />
        </div>

        <div className="flex justify-center">
          <input
            id="fileUpload"
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="fileUpload"
            className="inline-flex items-center px-5 py-2 bg-white text-blue-600 font-semibold rounded shadow hover:bg-gray-100 cursor-pointer"
          >
            <FiFilePlus className="w-5 h-5 mr-2" />
            Choose Files
          </label>
        </div>

        {files.length > 0 && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="pdf-files">
              {(provided) => (
                <ul
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="mt-5 space-y-2 text-left text-sm"
                >
                  {files.map((file, index) => (
                    <Draggable key={file.name + index} draggableId={file.name + index} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex justify-between items-center bg-blue-600 bg-opacity-30 px-4 py-2 rounded"
                        >
                          <div className="flex items-center gap-2">
                            <span className="truncate">{index + 1}. {file.name}</span>
                          </div>
                          <button
                            onClick={() => handleDelete(index)}
                            className="text-red-200 hover:text-white"
                          >
                            <FiTrash2 />
                          </button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`mt-6 inline-block w-full sm:w-auto px-6 py-2 bg-blue-700 hover:bg-blue-800 font-medium text-white rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Merging..." : "Merge PDF"}
        </button>

        {progressText && (
          <div className="mt-4 text-sm">
            <p>{progressText}</p>
            <div className="w-full bg-white rounded-full h-2 mt-2">
              <div
                className="bg-blue-800 h-2 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-red-100 text-sm">{error}</p>}

        {mergedURL && (
          <div className="mt-6">
            <a
              href={mergedURL}
              download
              target="_blank"
              rel="noreferrer"
              className="inline-block px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded"
            >
              Download Merged PDF
            </a>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MergePDF;
