const express = require("express");
const multer = require("multer");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");
const sharp = require("sharp");
const pdfPoppler = require("pdf-poppler");
const router = express.Router();




// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Route: POST /api/convert/word-to-pdf
router.post("/convert/word-to-pdf", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  const inputPath = path.join(__dirname, "..", req.file.path);
  const outputDir = path.join(__dirname, "..", "converted");

  // soffice CLI command
  const command = `soffice --headless --convert-to pdf "${inputPath}" --outdir "${outputDir}"`;


  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("Conversion error:", stderr);
      return res.status(500).send("Conversion failed");
    }

    const outputFileName = path.basename(req.file.filename, path.extname(req.file.filename)) + ".pdf";

    const outputPath = `/converted/${outputFileName}`;

    // Clean up uploaded file
    fs.unlinkSync(inputPath);

    return res.json({ success: true, downloadUrl: outputPath });
  });
});


// Route: POST /api/convert/jpg-to-pdf
router.post("/convert/jpg-to-pdf", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  const inputPath = path.join(__dirname, "..", req.file.path);
  const outputDir = path.join(__dirname, "..", "converted");

  // Convert to PDF using soffice (LibreOffice)
  const command = `soffice --headless --convert-to pdf "${inputPath}" --outdir "${outputDir}"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("Conversion error:", stderr || err.message);
      return res.status(500).json({ error: stderr || err.message });
    }

    const outputFileName = path.basename(req.file.filename, path.extname(req.file.filename)) + ".pdf";
    const outputPath = `/converted/${outputFileName}`;

    // Remove original uploaded file
    fs.unlinkSync(inputPath);

    return res.json({ success: true, downloadUrl: outputPath });
  });
});



// Route: POST /api/convert/pdf-to-jpg
router.post("/convert/pdf-to-jpg", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  const inputPath = path.join(__dirname, "..", req.file.path);
  const outputDir = path.join(__dirname, "..", "converted");
  const baseName = path.basename(req.file.filename, path.extname(req.file.filename));

  const opts = {
    format: "jpeg",
    out_dir: outputDir,
    out_prefix: baseName,
    page: null, // null means convert all pages
  };

  try {
    await pdfPoppler.convert(inputPath, opts);

    // Find all generated JPGs like baseName-1.jpg, baseName-2.jpg
    const files = fs.readdirSync(outputDir)
      .filter(f => f.startsWith(baseName) && f.endsWith(".jpg"))
      .sort();

    const downloadUrls = files.map(f => `/converted/${f}`);

    // Remove uploaded PDF
    fs.unlinkSync(inputPath);

    return res.json({ success: true, files: downloadUrls });
  } catch (err) {
    console.error("PDF to JPG error:", err);
    return res.status(500).json({ error: "Failed to convert PDF to JPG" });
  }
});




// PDF Compression using qpdf
router.post("/convert/compress-pdf", upload.single("file"), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join("converted", `compressed-${Date.now()}.pdf`);

  const qpdfCommand = `qpdf --object-streams=generate --stream-data=compress "${inputPath}" "${outputPath}"`;

  exec(qpdfCommand, (error, stdout, stderr) => {
    fs.unlinkSync(inputPath); // cleanup

    if (error) {
      console.error("Compression error:", error);
      return res.status(500).json({ error: "Compression failed", detail: stderr });
    }

    return res.json({ file: "/" + outputPath });
  });
});

//merging pdf
router.post("/convert/merge-pdf", upload.array("files"), async (req, res) => {
  const PDFMerger = (await import("pdf-merger-js")).default;
  if (!req.files || req.files.length < 2) {
    return res.status(400).json({ error: "Upload at least two PDF files." });
  }
  const merger = new PDFMerger();

  const outputPath = path.join("converted", `merged-${Date.now()}.pdf`);

  try {
    for (const file of req.files) {
      const filePath = path.join(__dirname, "..", file.path);
      await merger.add(filePath);
    }

    await merger.save(outputPath);

    // Clean up uploaded files
    req.files.forEach(file => fs.unlinkSync(file.path));

    return res.json({ file: "/" + outputPath });
  } catch (err) {
    console.error("Merge error:", err);
    return res.status(500).json({ error: "Merging failed" });
  }
});

module.exports = router;
