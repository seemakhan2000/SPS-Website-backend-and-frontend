
const cloudinary = require("../config/cloudinary");

// ========================================
// CLOUDINARY FOLDER MAPPING
// ========================================

const getUploadFolder = (type) => {
  if (type === "hero-video") {
    return "sps-enterprise/videos/hero";
  }

  if (type === "hero-image") {
    return "sps-enterprise/images/hero";
  }

  if (
    type === "about-big-image" ||
    type === "about-small-image"
  ) {
    return "sps-enterprise/images/about";
  }

  if (type === "startup-logo") {
    return "sps-enterprise/images/startups";
  }

  if (
    type === "customers-main-image" ||
    type === "customers-testimonial-image" ||
    type === "customers-impact-image" ||
    type.startsWith("customers-avatar-")
  ) {
    return "sps-enterprise/images/customers";
  }

  const folders = {
    "howitworks-image": "howitworks",
    "technology-partner-image": "technology-partners",
    "highlights-image": "highlights",
    "client-logo": "clients",
    "news-image": "news",
    "vertical-image": "verticals",
  };

  if (folders[type]) {
    return `sps-enterprise/images/${folders[type]}`;
  }

  return null;
};


// ========================================
// CLOUDINARY UPLOAD
// ========================================

const uploadToCloudinary = (file, folder, isVideo) => {
  return new Promise((resolve, reject) => {
    const options = {
      folder,
      resource_type: isVideo ? "video" : "image",
      timeout: 120000,

      ...(isVideo
        ? {
            chunk_size: 6000000,
            eager_async: false,
          }
        : {}),
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          console.error("Cloudinary detailed error:", error);
          return reject(error);
        }

        resolve(result);
      }
    );

    uploadStream.on("error", reject);

    uploadStream.end(file.buffer);
  });
};


// ========================================
// UPLOAD FILE
// ========================================

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const { type } = req.body;

    const folder = getUploadFolder(type);

    if (!folder) {
      return res.status(400).json({
        message: "Invalid upload type",
        receivedType: type,
      });
    }

    const isVideo = type === "hero-video";

    const result = await uploadToCloudinary(
      req.file,
      folder,
      isVideo
    );

    return res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,

      file: {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: result.secure_url,
        publicId: result.public_id,
      },
    });

  } catch (error) {
    console.error("Cloudinary upload error:", error);

    return res.status(500).json({
      message: "File upload failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};


// ========================================
// EXTRACT CLOUDINARY PUBLIC ID FROM URL
// ========================================

const extractCloudinaryPublicId = (filePath) => {
  try {
    const url = new URL(filePath);

    if (url.hostname !== "res.cloudinary.com") {
      return null;
    }

    const resourceMatch = url.pathname.match(
      /\/(video|image)\/upload\//
    );

    if (!resourceMatch) {
      return null;
    }

    const resourceType = resourceMatch[1];

    const uploadIndex = url.pathname.indexOf("/upload/");

    if (uploadIndex === -1) {
      return null;
    }

    const filePathAfterUpload = url.pathname.slice(
      uploadIndex + "/upload/".length
    );

    const parts = filePathAfterUpload.split("/");

    // Remove Cloudinary transformations
    while (
      parts.length > 0 &&
      (
        parts[0].includes(",") ||
        /^q_|^f_|^w_|^h_|^c_|^e_/.test(parts[0])
      )
    ) {
      parts.shift();
    }

    // Remove Cloudinary version
    if (parts[0] && /^v\d+$/.test(parts[0])) {
      parts.shift();
    }

    let publicId = parts.join("/");

    // Remove file extension
    publicId = publicId.replace(/\.[^/.]+$/, "");

    if (!publicId.startsWith("sps-enterprise/")) {
      return null;
    }

    return {
      publicId,
      resourceType,
    };

  } catch (error) {
    return null;
  }
};


// ========================================
// DELETE FILE
// ========================================

const deleteFile = async (req, res) => {
  try {
    let {
      publicId,
      resourceType,
      filePath,
    } = req.body;

    // Extract Public ID from Cloudinary URL
    if (!publicId && filePath) {
      const extracted = extractCloudinaryPublicId(filePath);

      if (!extracted) {
        return res.status(400).json({
          message: "Invalid Cloudinary URL",
        });
      }

      publicId = extracted.publicId;
      resourceType = extracted.resourceType;
    }

    // Validate Public ID
    if (
      !publicId ||
      typeof publicId !== "string" ||
      !publicId.startsWith("sps-enterprise/")
    ) {
      return res.status(400).json({
        message: "Invalid Cloudinary public ID",
      });
    }

    // Validate resource type
    if (!["image", "video"].includes(resourceType)) {
      return res.status(400).json({
        message: "Invalid resource type",
      });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: resourceType,
        invalidate: true,
      }
    );

    if (
      result.result !== "ok" &&
      result.result !== "not found"
    ) {
      return res.status(400).json({
        message: "Cloudinary file deletion failed",
      });
    }

    return res.status(200).json({
      message: "File deleted successfully",
      publicId,
      resourceType,
      result: result.result,
    });

  } catch (error) {
    console.error("Cloudinary delete error:", error);

    return res.status(500).json({
      message: "Failed to delete file",
    });
  }
};


// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {
  uploadFile,
  deleteFile,
};
