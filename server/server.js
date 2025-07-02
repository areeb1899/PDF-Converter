const express = require("express");
const cors = require("cors");
const path = require("path");
const convertRoutes = require("./routes/convertRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve converted files statically
app.use("/converted", express.static(path.join(__dirname, "converted")));


app.use("/api", convertRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
