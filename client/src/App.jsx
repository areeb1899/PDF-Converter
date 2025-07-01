import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import WordToPDF from "./components/WordToPDF";
import JPGToPDF from "./components/JPGToPDF";
import PDFToJPG from "./components/PDFToJPG";
import CompressPDF from "./components/CompressPDF";
import MergePDF from "./components/MergePDF";
import Footer from "./Footer";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/word-to-pdf" />} />
        <Route path="/word-to-pdf" element={<WordToPDF />} />
        <Route path="/jpg-to-pdf" element={<JPGToPDF />} />
        <Route path="/pdf-to-jpg" element={<PDFToJPG />} />
        <Route path="/compress-pdf" element={<CompressPDF />} />
        <Route path="/merge-pdf" element={<MergePDF />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
