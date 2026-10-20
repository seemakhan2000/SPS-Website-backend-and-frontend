const fs = require("fs");
const path = require("path");


// UPLOAD FILE
const uploadFile = async (req, res) => {
  try {

    // CHECK FILE
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const file = req.file;
    const type = req.body.type;

    let fileUrl = "";



    // HERO VIDEO
    if (type === "hero-video") {
      fileUrl = `/uploads/videos/hero/${file.filename}`;
    }


    // HERO IMAGE
    else if (type === "hero-image") {
      fileUrl = `/uploads/images/hero/${file.filename}`;
    }


    // ABOUT BIG IMAGE
    else if (type === "about-big-image") {
      fileUrl = `/uploads/images/about/${file.filename}`;
    }


    // ABOUT SMALL IMAGE
    else if (type === "about-small-image") {
      fileUrl = `/uploads/images/about/${file.filename}`;
    }


    // STARTUP LOGO
    else if (type === "startup-logo") {
      fileUrl = `/uploads/images/startups/${file.filename}`;
    }


    // CUSTOMERS MAIN IMAGE
    else if (type === "customers-main-image") {
      fileUrl = `/uploads/images/customers/${file.filename}`;
    }


    // CUSTOMERS TESTIMONIAL IMAGE
    else if (type === "customers-testimonial-image") {
      fileUrl = `/uploads/images/customers/${file.filename}`;
    }


    // CUSTOMERS IMPACT IMAGE
    else if (type === "customers-impact-image") {
      fileUrl = `/uploads/images/customers/${file.filename}`;
    }


    // CUSTOMERS AVATAR
    else if (
      typeof type === "string" &&
      type.startsWith("customers-avatar-")
    ) {
      fileUrl = `/uploads/images/customers/${file.filename}`;
    }


    // HOW IT WORKS IMAGE
    else if (type === "howitworks-image") {
      fileUrl = `/uploads/images/howitworks/${file.filename}`;
    }


    // TECHNOLOGY PARTNER IMAGE
    else if (type === "technology-partner-image") {
      fileUrl =
        `/uploads/images/technology-partners/${file.filename}`;
    }


    // HIGHLIGHTS IMAGE
    else if (type === "highlights-image") {
      fileUrl =
        `/uploads/images/highlights/${file.filename}`;
    }


    // CLIENT LOGO
    else if (type === "client-logo") {
      fileUrl = `/uploads/images/clients/${file.filename}`;
    }


    // NEWS IMAGE
    else if (type === "news-image") {
      fileUrl =
        `/uploads/images/news/${file.filename}`;
    }


    // VERTICAL IMAGE
    else if (type === "vertical-image") {
      fileUrl =
        `/uploads/images/verticals/${file.filename}`;
    }

    // INVALID TYPE
    else {
      console.error(
        "Invalid upload type received:",
        type
      );

      return res.status(400).json({
        message: "Invalid upload type",
        receivedType: type,
      });
    }


    // SUCCESS RESPONSE
    return res.status(200).json({
      message: "File uploaded successfully",

      fileUrl,

      file: {
        originalName: file.originalname,
        fileName: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        path: fileUrl,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "File upload failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};


// DELETE FILE
const deleteFile = async (req, res) => {
  try {
    const { filePath } = req.body;


    // VALIDATE FILE PATH
    if (!filePath) {
      return res.status(400).json({
        message: "File path is required",
      });
    }

    if (
      typeof filePath !== "string" ||
      !filePath.startsWith("/uploads/")
    ) {
      return res.status(400).json({
        message: "Invalid file path",
      });
    }


    // REMOVE /uploads/ FROM URL
    const relativePath = filePath.replace(
      /^\/uploads\//,
      ""
    );

    // UPLOAD ROOT
    const uploadRoot = path.join(
      __dirname,
      "../../uploads"
    );


    // BUILD ABSOLUTE PATH
    const fullPath = path.join(
      uploadRoot,
      relativePath
    );


    // SECURITY CHECK
    const normalizedRoot =
      path.resolve(uploadRoot);

    const normalizedFile =
      path.resolve(fullPath);

    if (
      !normalizedFile.startsWith(
        normalizedRoot + path.sep
      )
    ) {
      return res.status(400).json({
        message: "Invalid file path",
      });
    }


    // DELETE FILE
    if (fs.existsSync(normalizedFile)) {
      fs.unlinkSync(normalizedFile);

      console.log(
        "File deleted:",
        normalizedFile
      );
    } else {
      console.log(
        "File does not exist:",
        normalizedFile
      );
    }


    // SUCCESS
    return res.status(200).json({
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete file error:",
      error
    );

    return res.status(500).json({
      message: "Failed to delete file",
    });
  }
};


// EXPORT
module.exports = {
  uploadFile,
  deleteFile,
};