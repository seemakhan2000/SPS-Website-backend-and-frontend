const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { connectDB } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const contentRoutes = require("./routes/contentRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

// Vercel proxy ke peeche hota hai (secure cookies ke liye zaroori)
app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://sps-website-backend-and-frontend.vercel.app",
  "https://sps-website-backend-and-frontend-ib.vercel.app",
];

const isAllowedVercelPreview = (origin) => {
  return /^https:\/\/sps-website-backend-and-frontend(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(
    origin
  );
};

const corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      isAllowedVercelPreview(origin)
    ) {
      return callback(null, true);
    }

    return callback(null, false);
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// MongoDB connection before all API routes
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB API connection error:", error.message);

    return res.status(503).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SPS Enterprise API is running",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/content", contentRoutes);

module.exports = app;