const multer = require("multer");

// Allowed upload types
const imageTypes = [
  "hero-image",
  "about-big-image",
  "about-small-image",
  "startup-logo",
  "customers-main-image",
  "customers-testimonial-image",
  "customers-impact-image",
  "howitworks-image",
  "technology-partner-image",
  "highlights-image",
  "client-logo",
  "news-image",
  "vertical-image",
];

const isValidType = (type) => {
  return (
    imageTypes.includes(type) ||
    (
      typeof type === "string" &&
      type.startsWith("customers-avatar-")
    ) ||
    type === "hero-video"
  );
};

// MEMORY STORAGE
const storage = multer.memoryStorage();

// FILE FILTER
const fileFilter = (req, file, cb) => {
  const type = req.body.type;

  if (!isValidType(type)) {
    return cb(new Error("Invalid upload type"));
  }

  if (type === "hero-video") {
    const allowedVideos = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
    ];

    if (!allowedVideos.includes(file.mimetype)) {
      return cb(
        new Error("Only MP4, WebM, OGG and MOV videos are allowed")
      );
    }

    return cb(null, true);
  }

  const allowedImages = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",
  ];

  if (!allowedImages.includes(file.mimetype)) {
    return cb(
      new Error("Only JPG, PNG, WebP and SVG images are allowed")
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

module.exports = upload;