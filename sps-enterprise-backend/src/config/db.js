const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST ,
  port: Number(process.env.DB_PORT) ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD  ,
  database: process.env.DB_NAME ,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();

    console.log("DB connected successfully");

    connection.release();
  } catch (error) {
    console.error("MariaDB connection failed:", error.message);
    throw error;
  }
};

module.exports = {
  pool,
  connectDB,
};