
const { MongoClient } = require("mongodb");

let client;
let database;

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
      throw new Error("MONGO_URL is missing in .env");
    }

    client = new MongoClient(mongoUrl);

    await client.connect();

    database = client.db(
      process.env.MONGODB_DATABASE || "sps_enterprise"
    );

    await database.command({ ping: 1 });

    console.log("MongoDB connected successfully!");

    return database;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

const getDB = () => {
  if (!database) {
    throw new Error("MongoDB is not connected. Call connectDB first.");
  }

  return database;
};

const closeDB = async () => {
  if (client) {
    await client.close();
    client = null;
    database = null;
  }
};

module.exports = {
  connectDB,
  getDB,
  closeDB,
};