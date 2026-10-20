const express = require("express");

const upload = require("../middleware/uploadMiddleware");

const {
  uploadFile,
  deleteFile,
} = require("../controllers/uploadController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  upload.single("file"),
  uploadFile
);

router.delete(
  "/",
  protect,
  deleteFile
);

module.exports = router;