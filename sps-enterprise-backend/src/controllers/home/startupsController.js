
const { getDB } = require("../../config/db");

// GET STARTUPS
const getStartups = async (siteContentId) => {
  const db = getDB();

  const startupRows = await db
    .collection("startups")
    .find({ site_content_id: siteContentId })
    .sort({ sort_order: 1, id: 1 })
    .toArray();

  return startupRows.map((startup) => ({
    id: startup.id,
    name: startup.name,
    logo: startup.logo,
    description: startup.description,
    sortOrder: startup.sort_order,
    siteContentId: startup.site_content_id,
  }));
};


// CREATE STARTUPS
const createStartups = async (siteContentId, startups) => {
  if (!Array.isArray(startups)) {
    throw new Error("Startups data is required");
  }

  const db = getDB();
  const collection = db.collection("startups");

  // Check existing startups
  const existing = await collection.findOne({
    site_content_id: siteContentId,
  });

  if (existing) {
    throw new Error("Startups already exist");
  }

  if (startups.length > 0) {
    // Generate IDs
    const lastStartup = await collection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .next();

    let nextId = (lastStartup?.id || 0) + 1;

    // Prepare documents
    const startupDocuments = startups.map((startup, index) => ({
      id: nextId++,
      name: startup.name,
      logo: startup.logo,
      description: startup.description,
      sort_order: startup.sortOrder ?? index,
      site_content_id: siteContentId,
    }));

    await collection.insertMany(startupDocuments);
  }

  return getStartups(siteContentId);
};


// UPDATE STARTUPS
const updateStartups = async (siteContentId, startups) => {
  if (!Array.isArray(startups)) {
    throw new Error("Startups data is required");
  }

  const db = getDB();
  const collection = db.collection("startups");

  // Check existing startups
  const existing = await collection.findOne({
    site_content_id: siteContentId,
  });

  if (!existing) {
    throw new Error("Startups record not found");
  }

  // Delete old startups
  await collection.deleteMany({
    site_content_id: siteContentId,
  });

  // Insert current startups
  if (startups.length > 0) {
    const lastStartup = await collection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .next();

    let nextId = (lastStartup?.id || 0) + 1;

    const startupDocuments = startups.map((startup, index) => ({
      id: nextId++,
      name: startup.name,
      logo: startup.logo,
      description: startup.description,
      sort_order: startup.sortOrder ?? index,
      site_content_id: siteContentId,
    }));

    await collection.insertMany(startupDocuments);
  }

  return getStartups(siteContentId);
};


// DELETE STARTUPS
const deleteStartups = async (siteContentId) => {
  const db = getDB();
  const collection = db.collection("startups");

  // Check existing startups
  const existing = await collection.findOne({
    site_content_id: siteContentId,
  });

  if (!existing) {
    throw new Error("Startups record not found");
  }

  // Delete startups
  const result = await collection.deleteMany({
    site_content_id: siteContentId,
  });

  if (result.deletedCount === 0) {
    throw new Error("Startups record not found");
  }

  return true;
};


// EXPORT
module.exports = {
  getStartups,
  createStartups,
  updateStartups,
  deleteStartups,
};
