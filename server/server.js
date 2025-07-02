const express = require("express");
const cors = require("cors");
const path = require("path");
const convertRoutes = require("./routes/convertRoutes");
const fs = require("fs");

// Ensure uploads and converted directories exist
const uploadDir = path.join(__dirname, "uploads");
const convertedDir = path.join(__dirname, "converted");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(convertedDir)) fs.mkdirSync(convertedDir);

const app = express();

app.use(cors());
app.use(express.json());

// Serve converted files statically
app.use("/converted", express.static(path.join(__dirname, "converted")));


app.use("/api/convert", convertRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
