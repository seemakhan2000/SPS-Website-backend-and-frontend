const jwt = require("jsonwebtoken");

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    if (
      email.trim() !== (process.env.ADMIN_EMAIL || "").trim() ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        message: "Invalid admin credentials",
      });
    }

    const token = jwt.sign(
      {
        name: process.env.ADMIN_NAME || "Admin",
        email: email.trim(),
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("admin_token", token, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      admin: {
        name: process.env.ADMIN_NAME || "Admin",
        email: email.trim(),
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const logout = async (req, res) => {
  res.clearCookie("admin_token", cookieOptions);

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

const me = async (req, res) => {
  return res.status(200).json({
    admin: req.admin,
  });
};

module.exports = {
  login,
  logout,
  me,
};