
const { getDB } = require("../../config/db");

// GET STARTUPS SECTION
const getStartupsSection = async (siteContentId) => {
  const db = getDB();

  const section = await db.collection("startups_section").findOne({
    site_content_id: siteContentId,
  });

  if (!section) {
    return null;
  }

  return {
    id: section.id,
    title: section.title,
    subtitle: section.subtitle,
    description: section.description,
    siteContentId: section.site_content_id,
  };
};


// CREATE STARTUPS SECTION
const createStartupsSection = async (
  siteContentId,
  startupsSection
) => {
  if (!startupsSection) {
    throw new Error("Startups Section data is required");
  }

  const db = getDB();
  const collection = db.collection("startups_section");

  // Check existing section
  const existing = await collection.findOne({
    site_content_id: siteContentId,
  });

  if (existing) {
    throw new Error("Startups Section already exists");
  }

  // Generate section ID
  const lastSection = await collection
    .find({})
    .sort({ id: -1 })
    .limit(1)
    .next();

  const sectionId = (lastSection?.id || 0) + 1;

  // Create section
  await collection.insertOne({
    id: sectionId,
    title: startupsSection.title,
    subtitle: startupsSection.subtitle,
    description: startupsSection.description,
    site_content_id: siteContentId,
  });

  return getStartupsSection(siteContentId);
};


// UPDATE STARTUPS SECTION
const updateStartupsSection = async (
  siteContentId,
  startupsSection
) => {
  if (!startupsSection) {
    throw new Error("Startups Section data is required");
  }

  const db = getDB();
  const collection = db.collection("startups_section");

  // Check existing section
  const existing = await collection.findOne({
    site_content_id: siteContentId,
  });

  if (!existing) {
    throw new Error("Startups Section record not found");
  }

  // Update section
  await collection.updateOne(
    { site_content_id: siteContentId },
    {
      $set: {
        title: startupsSection.title,
        subtitle: startupsSection.subtitle,
        description: startupsSection.description,
      },
    }
  );

  return getStartupsSection(siteContentId);
};


// DELETE STARTUPS SECTION
const deleteStartupsSection = async (siteContentId) => {
  const db = getDB();
  const collection = db.collection("startups_section");

  // Check existing section
  const existing = await collection.findOne({
    site_content_id: siteContentId,
  });

  if (!existing) {
    throw new Error("Startups Section record not found");
  }

  // Delete section
  const result = await collection.deleteOne({
    site_content_id: siteContentId,
  });

  if (result.deletedCount === 0) {
    throw new Error("Startups Section record not found");
  }

  return true;
};


// EXPORT
module.exports = {
  getStartupsSection,
  createStartupsSection,
  updateStartupsSection,
  deleteStartupsSection,
};
