const { pool } = require("../../config/db");


// GET STARTUPS SECTION
const getStartupsSection = async (
  siteContentId,
  db = pool
) => {
  const [rows] = await db.query(
    `
    SELECT
      id,
      title,
      subtitle,
      description,
      site_content_id
    FROM startups_section
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

    title: rows[0].title,

    subtitle: rows[0].subtitle,

    description: rows[0].description,

    siteContentId:
      rows[0].site_content_id,
  };
};


// CREATE STARTUPS SECTION
const createStartupsSection = async (
  siteContentId,
  startupsSection,
  db = pool
) => {
  if (!startupsSection) {
    throw new Error(
      "Startups Section data is required"
    );
  }


  // CHECK EXISTING SECTION
  const [existingRows] = await db.query(
    `
    SELECT id
    FROM startups_section
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length > 0) {
    throw new Error(
      "Startups Section already exists"
    );
  }


  // CREATE SECTION
  await db.query(
    `
    INSERT INTO startups_section
    (
      title,
      subtitle,
      description,
      site_content_id
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      startupsSection.title,
      startupsSection.subtitle,
      startupsSection.description,
      siteContentId,
    ]
  );

  return getStartupsSection(
    siteContentId,
    db
  );
};


// UPDATE STARTUPS SECTION
const updateStartupsSection = async (
  siteContentId,
  startupsSection,
  db = pool
) => {
  if (!startupsSection) {
    throw new Error(
      "Startups Section data is required"
    );
  }


  // CHECK EXISTING SECTION
  const [existingRows] = await db.query(
    `
    SELECT id
    FROM startups_section
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length === 0) {
    throw new Error(
      "Startups Section record not found"
    );
  }


  // UPDATE SECTION
  await db.query(
    `
    UPDATE startups_section
    SET
      title = ?,
      subtitle = ?,
      description = ?
    WHERE site_content_id = ?
    `,
    [
      startupsSection.title,
      startupsSection.subtitle,
      startupsSection.description,
      siteContentId,
    ]
  );

  return getStartupsSection(
    siteContentId,
    db
  );
};


// DELETE STARTUPS SECTION
const deleteStartupsSection = async (
  siteContentId,
  db = pool
) => {

  // CHECK EXISTING SECTION
  const [existingRows] = await db.query(
    `
    SELECT id
    FROM startups_section
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length === 0) {
    throw new Error(
      "Startups Section record not found"
    );
  }


  // DELETE SECTION
  const [result] = await db.query(
    `
    DELETE FROM startups_section
    WHERE site_content_id = ?
    `,
    [siteContentId]
  );

  if (result.affectedRows === 0) {
    throw new Error(
      "Startups Section record not found"
    );
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