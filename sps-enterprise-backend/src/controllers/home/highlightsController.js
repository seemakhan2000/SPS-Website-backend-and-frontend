
const { getDB } = require("../../config/db");

// GET HIGHLIGHTS
const getHighlights = async (siteContentId) => {
  const db = getDB();

  const record = await db.collection("highlights").findOne({
    site_content_id: siteContentId,
  });

  if (!record) {
    return null;
  }

  return {
    id: record.id,
    image: record.image,
    alt: record.alt,
    title: record.title,
    description: record.description,
    siteContentId: record.site_content_id,
  };
};


// CREATE HIGHLIGHTS
const createHighlights = async (siteContentId, highlights) => {
  if (!highlights) {
    throw new Error("Highlights data is required");
  }

  const db = getDB();
  const collection = db.collection("highlights");

  const existing = await collection.findOne({
    site_content_id: siteContentId,
  });

  if (existing) {
    throw new Error("Highlights already exists");
  }

  // Generate next numeric ID
  const lastRecord = await collection
    .find({})
    .sort({ id: -1 })
    .limit(1)
    .next();

  const newId = (lastRecord?.id || 0) + 1;

  await collection.insertOne({
    id: newId,
    image: highlights.image,
    alt: highlights.alt,
    title: highlights.title,
    description: highlights.description,
    site_content_id: siteContentId,
  });

  return getHighlights(siteContentId);
};


// UPDATE HIGHLIGHTS
const updateHighlights = async (siteContentId, highlights) => {
  if (!highlights) {
    throw new Error("Highlights data is required");
  }

  const db = getDB();
  const collection = db.collection("highlights");

  const existing = await collection.findOne({
    site_content_id: siteContentId,
  });

  if (!existing) {
    throw new Error("Highlights record not found");
  }

  await collection.updateOne(
    { site_content_id: siteContentId },
    {
      $set: {
        image: highlights.image,
        alt: highlights.alt,
        title: highlights.title,
        description: highlights.description,
      },
    }
  );

  return getHighlights(siteContentId);
};


// DELETE HIGHLIGHTS
const deleteHighlights = async (siteContentId) => {
  const db = getDB();
  const collection = db.collection("highlights");

  const existing = await collection.findOne({
    site_content_id: siteContentId,
  });

  if (!existing) {
    throw new Error("Highlights record not found");
  }

  const result = await collection.deleteOne({
    site_content_id: siteContentId,
  });

  if (result.deletedCount === 0) {
    throw new Error("Highlights record not found");
  }

  return true;
};


// EXPORT
module.exports = {
  getHighlights,
  createHighlights,
  updateHighlights,
  deleteHighlights,
};
