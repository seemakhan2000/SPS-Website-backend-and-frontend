
const { pool } = require("../../config/db");


// GET ABOUT US
const getAboutUs = async (siteContentId, db = pool) => {
  const [rows] = await db.query(
    `
    SELECT
      id,
      label,
      title,
      description,
      big_image,
      small_image,
      button_text,
      button_link,
      site_content_id
    FROM about_us
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (rows.length === 0) {
    return null;
  }

  return {
    id: rows[0].id,
    label: rows[0].label,
    title: rows[0].title,
    description: rows[0].description,
    bigImage: rows[0].big_image,
    smallImage: rows[0].small_image,
    buttonText: rows[0].button_text,
    buttonLink: rows[0].button_link,
    siteContentId: rows[0].site_content_id,
  };
};


// CREATE ABOUT US
const createAboutUs = async (
  siteContentId,
  aboutUs,
  db = pool
) => {
  if (!aboutUs) {
    throw new Error("About Us data is required");
  }

  const [existing] = await db.query(
    `
    SELECT id
    FROM about_us
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existing.length > 0) {
    throw new Error("About Us already exists");
  }

  const [result] = await db.query(
    `
    INSERT INTO about_us
    (
      label,
      title,
      description,
      big_image,
      small_image,
      button_text,
      button_link,
      site_content_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      aboutUs.label,
      aboutUs.title,
      aboutUs.description,
      aboutUs.bigImage,
      aboutUs.smallImage,
      aboutUs.buttonText,
      aboutUs.buttonLink,
      siteContentId,
    ]
  );

  return {
    id: result.insertId,
    ...aboutUs,
    siteContentId,
  };
};


// UPDATE ABOUT US
const updateAboutUs = async (
  siteContentId,
  aboutUs,
  db = pool
) => {
  if (!aboutUs) {
    throw new Error("About Us data is required");
  }

  const [existing] = await db.query(
    `
    SELECT id
    FROM about_us
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existing.length === 0) {
    throw new Error("About Us record not found");
  }

  await db.query(
    `
    UPDATE about_us
    SET
      label = ?,
      title = ?,
      description = ?,
      big_image = ?,
      small_image = ?,
      button_text = ?,
      button_link = ?
    WHERE site_content_id = ?
    `,
    [
      aboutUs.label,
      aboutUs.title,
      aboutUs.description,
      aboutUs.bigImage,
      aboutUs.smallImage,
      aboutUs.buttonText,
      aboutUs.buttonLink,
      siteContentId,
    ]
  );

  return getAboutUs(siteContentId, db);
};


// DELETE ABOUT US
const deleteAboutUs = async (
  siteContentId,
  db = pool
) => {
  const [result] = await db.query(
    `
    DELETE FROM about_us
    WHERE site_content_id = ?
    `,
    [siteContentId]
  );

  if (result.affectedRows === 0) {
    throw new Error("About Us record not found");
  }

  return true;
};


// EXPORT
module.exports = {
  getAboutUs,
  createAboutUs,
  updateAboutUs,
  deleteAboutUs,
};
