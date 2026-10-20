const { pool } = require("../../config/db");


// GET STARTUPS
const getStartups = async (
  siteContentId,
  db = pool
) => {
  const [startupRows] = await db.query(
    `
    SELECT
      id,
      name,
      logo,
      description,
      sort_order,
      site_content_id
    FROM startups
    WHERE site_content_id = ?
    ORDER BY sort_order ASC, id ASC
    `,
    [siteContentId]
  );

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
const createStartups = async (
  siteContentId,
  startups,
  db = pool
) => {
  if (!Array.isArray(startups)) {
    throw new Error(
      "Startups data is required"
    );
  }


  // CHECK EXISTING STARTUPS
  const [existingRows] = await db.query(
    `
    SELECT id
    FROM startups
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length > 0) {
    throw new Error(
      "Startups already exist"
    );
  }


  // INSERT STARTUPS
  for (
    let startupIndex = 0;
    startupIndex < startups.length;
    startupIndex++
  ) {
    const startup =
      startups[startupIndex];

    await db.query(
      `
      INSERT INTO startups
      (
        name,
        logo,
        description,
        sort_order,
        site_content_id
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        startup.name,
        startup.logo,
        startup.description,
        startup.sortOrder ?? startupIndex,
        siteContentId,
      ]
    );
  }

  return getStartups(
    siteContentId,
    db
  );
};


// UPDATE STARTUPs
const updateStartups = async (
  siteContentId,
  startups,
  db = pool
) => {
  if (!Array.isArray(startups)) {
    throw new Error(
      "Startups data is required"
    );
  }


  // CHECK EXISTING STARTUPS
  const [existingRows] = await db.query(
    `
    SELECT id
    FROM startups
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length === 0) {
    throw new Error(
      "Startups record not found"
    );
  }


  // DELETE OLD STARTUPS
  await db.query(
    `
    DELETE FROM startups
    WHERE site_content_id = ?
    `,
    [siteContentId]
  );


  // INSERT CURRENT STARTUPS
  for (
    let startupIndex = 0;
    startupIndex < startups.length;
    startupIndex++
  ) {
    const startup =
      startups[startupIndex];

    await db.query(
      `
      INSERT INTO startups
      (
        name,
        logo,
        description,
        sort_order,
        site_content_id
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        startup.name,
        startup.logo,
        startup.description,
        startup.sortOrder ?? startupIndex,
        siteContentId,
      ]
    );
  }

  return getStartups(
    siteContentId,
    db
  );
};


// DELETE STARTUPS
const deleteStartups = async (
  siteContentId,
  db = pool
) => {

  // CHECK EXISTING STARTUPS
  const [existingRows] = await db.query(
    `
    SELECT id
    FROM startups
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length === 0) {
    throw new Error(
      "Startups record not found"
    );
  }


  // DELETE STARTUPS
  const [result] = await db.query(
    `
    DELETE FROM startups
    WHERE site_content_id = ?
    `,
    [siteContentId]
  );

  if (result.affectedRows === 0) {
    throw new Error(
      "Startups record not found"
    );
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