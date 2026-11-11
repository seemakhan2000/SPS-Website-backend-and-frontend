
const { getDB } = require("../../config/db");

// GET ABOUT US
const getAboutUs = async (siteContentId) => {
  const db = getDB();

  const record = await db.collection("about_us").findOne({
    site_content_id: siteContentId,
  });

  if (!record) {
    return null;
  }

  return {
    id: record.id,
    label: record.label,
    title: record.title,
    description: record.description,
    bigImage: record.big_image,
    smallImage: record.small_image,
    buttonText: record.button_text,
    buttonLink: record.button_link,
    siteContentId: record.site_content_id,
  };
};

// CREATE ABOUT US
const createAboutUs = async (siteContentId, aboutUs) => {
  if (!aboutUs) {
    throw new Error("About Us data is required");
  }

  const db = getDB();
  const collection = db.collection("about_us");

  const existing = await collection.findOne({
    site_content_id: siteContentId,
  });

  if (existing) {
    throw new Error("About Us already exists");
  }

  const lastRecord = await collection
    .find({})
    .sort({ id: -1 })
    .limit(1)
    .next();

  const newId = (lastRecord?.id || 0) + 1;

  const newRecord = {
    id: newId,
    label: aboutUs.label,
    title: aboutUs.title,
    description: aboutUs.description,
    big_image: aboutUs.bigImage,
    small_image: aboutUs.smallImage,
    button_text: aboutUs.buttonText,
    button_link: aboutUs.buttonLink,
    site_content_id: siteContentId,
  };

  await collection.insertOne(newRecord);

  return {
    id: newId,
    ...aboutUs,
    siteContentId,
  };
};

// UPDATE ABOUT US
const updateAboutUs = async (siteContentId, aboutUs) => {
  if (!aboutUs) {
    throw new Error("About Us data is required");
  }

  const db = getDB();
  const collection = db.collection("about_us");

  const existing = await collection.findOne({
    site_content_id: siteContentId,
  });

  if (!existing) {
    throw new Error("About Us record not found");
  }

  await collection.updateOne(
    { site_content_id: siteContentId },
    {
      $set: {
        label: aboutUs.label,
        title: aboutUs.title,
        description: aboutUs.description,
        big_image: aboutUs.bigImage,
        small_image: aboutUs.smallImage,
        button_text: aboutUs.buttonText,
        button_link: aboutUs.buttonLink,
      },
    }
  );

  return getAboutUs(siteContentId);
};

// DELETE ABOUT US
const deleteAboutUs = async (siteContentId) => {
  const db = getDB();

  const result = await db.collection("about_us").deleteOne({
    site_content_id: siteContentId,
  });

  if (result.deletedCount === 0) {
    throw new Error("About Us record not found");
  }

  return true;
};

module.exports = {
  getAboutUs,
  createAboutUs,
  updateAboutUs,
  deleteAboutUs,
};
