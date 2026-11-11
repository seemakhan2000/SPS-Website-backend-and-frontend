const { MongoClient } = require("mongodb");

let client;
let db;
let connectionPromise;

const connectDB = async () => {
  try {
    if (db) {
      return db;
    }

    if (connectionPromise) {
      return connectionPromise;
    }

    const uri = process.env.MONGO_URL;

    if (!uri) {
      throw new Error("MONGO_URL is missing from environment variables");
    }

    connectionPromise = (async () => {
      const mongoClient = new MongoClient(uri);

      await mongoClient.connect();

      const databaseName =
        process.env.MONGODB_DB || process.env.DB_NAME;

      client = mongoClient;
      db = databaseName
        ? mongoClient.db(databaseName)
        : mongoClient.db();

      console.log("MongoDB connected successfully");

      return db;
    })();

    return await connectionPromise;
  } catch (error) {
    connectionPromise = null;
    db = null;
    client = null;

    console.error("MongoDB connection error:", error.message);

    throw error;
  }
};

const getDB = () => {
  if (!db) {
    throw new Error("MongoDB is not connected. Call connectDB first.");
  }

  return db;
};

const closeDB = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    connectionPromise = null;
  }
};

module.exports = {
  connectDB,
  getDB,
  closeDB,
};