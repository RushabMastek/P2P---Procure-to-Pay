require("dotenv").config({ path: ".env" });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// ✅ Just import (DO NOT CALL)
const db = require('./config/db');

const vendorRoutes = require('./routes/vendor')

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// ❌ REMOVE THIS
// connectDB()

app.use('/api/vendor', vendorRoutes)

// Optional test route
app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});