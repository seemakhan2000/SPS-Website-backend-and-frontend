
const multer = require("multer");
const path = require("path");
const fs = require("fs");


// UPLOAD ROOT
const uploadRoot = path.join(
  __dirname,
  "../../uploads"
);


// UPLOAD FOLDERS
const folders = [
  path.join(uploadRoot, "images", "hero"),
  path.join(uploadRoot, "images", "about"),
  path.join(uploadRoot, "images", "startups"),
  path.join(uploadRoot, "images", "customers"),
  path.join(uploadRoot, "images", "howitworks"),
  path.join(uploadRoot, "images", "highlights"),
  path.join(uploadRoot, "images", "clients"),
  path.join(uploadRoot, "images", "news"),
  path.join(uploadRoot, "images", "verticals"),
  path.join(
    uploadRoot,
    "images",
    "technology-partners"
  ),
  path.join(uploadRoot, "videos", "hero"),
];


// CREATE UPLOAD FOLDERS
folders.forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, {
      recursive: true,
    });
  }
});


// STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.body.type;

    let folder;


    // HERO VIDEO
    if (type === "hero-video") {
      folder = path.join(
        uploadRoot,
        "videos",
        "hero"
      );
    }


    // HERO IMAGE
    else if (type === "hero-image") {
      folder = path.join(
        uploadRoot,
        "images",
        "hero"
      );
    }


    // ABOUT US IMAGES
    else if (
      type === "about-big-image" ||
      type === "about-small-image"
    ) {
      folder = path.join(
        uploadRoot,
        "images",
        "about"
      );
    }


    // STARTUP LOGO
    else if (type === "startup-logo") {
      folder = path.join(
        uploadRoot,
        "images",
        "startups"
      );
    }


    // CUSTOMER IMAGES
    else if (
      type === "customers-main-image" ||
      type === "customers-testimonial-image" ||
      type === "customers-impact-image" ||
      (
        typeof type === "string" &&
        type.startsWith("customers-avatar-")
      )
    ) {
      folder = path.join(
        uploadRoot,
        "images",
        "customers"
      );
    }


    // HOW IT WORKS IMAGE
    else if (type === "howitworks-image") {
      folder = path.join(
        uploadRoot,
        "images",
        "howitworks"
      );
    }


    // TECHNOLOGY PARTNER IMAGE
    else if (type === "technology-partner-image") {
      folder = path.join(
        uploadRoot,
        "images",
        "technology-partners"
      );
    }


    // HIGHLIGHTS IMAGE
    else if (type === "highlights-image") {
      folder = path.join(
        uploadRoot,
        "images",
        "highlights"
      );
    }


    // CLIENT LOGO
    else if (type === "client-logo") {
      folder = path.join(
        uploadRoot,
        "images",
        "clients"
      );
    }


    // NEWS IMAGE
    else if (type === "news-image") {
      folder = path.join(
        uploadRoot,
        "images",
        "news"
      );
    }


    // VERTICAL IMAGE
    else if (type === "vertical-image") {
      folder = path.join(
        uploadRoot,
        "images",
        "verticals"
      );
    }


    // INVALID TYPE
    else {
      return cb(
        new Error("Invalid upload type")
      );
    }


    //  FOLDER EXISTS
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, {
        recursive: true,
      });
    }

    cb(null, folder);
  },


  // FILE NAME
  filename: (req, file, cb) => {
    const ext = path.extname(
      file.originalname
    );

    const name = path
      .basename(
        file.originalname,
        ext
      )
      .replace(
        /[^a-zA-Z0-9-_]/g,
        "-"
      )
      .toLowerCase();

    const uniqueName =
      `${name}-${Date.now()}${ext}`;

    cb(null, uniqueName);
  },
});


// FILE FILTER
const fileFilter = (
  req,
  file,
  cb
) => {
  const type = req.body.type;


  // HERO VIDEO
  if (type === "hero-video") {
    const allowedVideos = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
    ];

    if (
      !allowedVideos.includes(
        file.mimetype
      )
    ) {
      return cb(
        new Error(
          "Only MP4, WebM, OGG and MOV videos are allowed"
        )
      );
    }

    return cb(null, true);
  }


  // IMAGE TYPES
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

  const isCustomerAvatar =
    typeof type === "string" &&
    type.startsWith("customers-avatar-");

  if (
    imageTypes.includes(type) ||
    isCustomerAvatar
  ) {
    const allowedImages = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];

    if (
      !allowedImages.includes(
        file.mimetype
      )
    ) {
      return cb(
        new Error(
          "Only JPG, PNG, WebP and SVG images are allowed"
        )
      );
    }

    return cb(null, true);
  }


  // INVALID TYPE
  return cb(
    new Error("Invalid upload type")
  );
};


// MULTER
const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize:
      100 * 1024 * 1024,
  },
});


module.exports = upload;
