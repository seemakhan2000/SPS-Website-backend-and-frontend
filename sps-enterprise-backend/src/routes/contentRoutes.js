const express = require("express");

const {
  getHomeContent,
  updateHomeContent,
} = require("../controllers/contentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/home", getHomeContent);

router.put("/home", protect, updateHomeContent);

module.exports = router;