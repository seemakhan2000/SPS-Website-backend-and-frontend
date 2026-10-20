const { pool } = require("../../config/db");


// GET HIGHLIGHTS
const getHighlights = async (
  siteContentId,
  db = pool
) => {
  const [rows] = await db.query(
    `
    SELECT
      id,
      image,
      alt,
      title,
      description,
      site_content_id
    FROM highlights
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  // No DB record
  if (rows.length === 0) {
    return null;
  }

  return {
    id: rows[0].id,
    image: rows[0].image,
    alt: rows[0].alt,
    title: rows[0].title,
    description: rows[0].description,
    siteContentId: rows[0].site_content_id,
  };
};


// CREATE HIGHLIGHTS
const createHighlights = async (
  siteContentId,
  highlights,
  db = pool
) => {
  if (!highlights) {
    throw new Error(
      "Highlights data is required"
    );
  }


  // Check existing record
  const [existingRows] = await db.query(
    `
    SELECT
      id
    FROM highlights
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length > 0) {
    throw new Error(
      "Highlights already exists"
    );
  }


  // Create highlights
  await db.query(
    `
    INSERT INTO highlights
    (
      image,
      alt,
      title,
      description,
      site_content_id
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      highlights.image,
      highlights.alt,
      highlights.title,
      highlights.description,
      siteContentId,
    ]
  );


  // Return created DB data
  return getHighlights(
    siteContentId,
    db
  );
};


// UPDATE HIGHLIGHTS
const updateHighlights = async (
  siteContentId,
  highlights,
  db = pool
) => {
  if (!highlights) {
    throw new Error(
      "Highlights data is required"
    );
  }


  // Check existing record
  const [existingRows] = await db.query(
    `
    SELECT
      id
    FROM highlights
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );


  // Do NOT automatically create
  if (existingRows.length === 0) {
    throw new Error(
      "Highlights record not found"
    );
  }


  // Update DB
  await db.query(
    `
    UPDATE highlights
    SET
      image = ?,
      alt = ?,
      title = ?,
      description = ?
    WHERE site_content_id = ?
    `,
    [
      highlights.image,
      highlights.alt,
      highlights.title,
      highlights.description,
      siteContentId,
    ]
  );


  // Return updated DB data
  return getHighlights(
    siteContentId,
    db
  );
};


// DELETE HIGHLIGHTS
const deleteHighlights = async (
  siteContentId,
  db = pool
) => {

  // Check existing record
  const [existingRows] = await db.query(
    `
    SELECT
      id
    FROM highlights
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length === 0) {
    throw new Error(
      "Highlights record not found"
    );
  }


  // Delete DB record
  const [result] = await db.query(
    `
    DELETE FROM highlights
    WHERE site_content_id = ?
    `,
    [siteContentId]
  );

  if (result.affectedRows === 0) {
    throw new Error(
      "Highlights record not found"
    );
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