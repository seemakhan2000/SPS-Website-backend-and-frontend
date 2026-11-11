const mongoose = require("mongoose");

let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is not set");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 10000,
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; 
    throw err;
  }
  return cached.conn;
};


const getDB = () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error("MongoDB is not connected. Call connectDB first.");
  }
  return mongoose.connection.db;
};

module.exports = { connectDB, getDB };