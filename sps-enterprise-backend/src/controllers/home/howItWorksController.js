const { pool } = require("../../config/db");


// GET HOW IT WORKS
const getHowItWorks = async (
  siteContentId,
  db = pool
) => {
  const [howItWorksRows] = await db.query(
    `
    SELECT
      id,
      heading,
      description,
      image,
      button_text,
      button_link,
      specialists_number,
      specialists_text,
      clients_number,
      clients_text,
      site_content_id
    FROM how_it_works
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (howItWorksRows.length === 0) {
    return null;
  }

  const howItWorks = howItWorksRows[0];


  // Get Steps
  const [stepRows] = await db.query(
    `
    SELECT
      id,
      icon,
      title,
      sort_order
    FROM how_it_works_steps
    WHERE how_it_works_id = ?
    ORDER BY sort_order ASC, id ASC
    `,
    [howItWorks.id]
  );


  // Return DB data
  return {
    id: howItWorks.id,

    heading: howItWorks.heading,

    description: howItWorks.description,

    steps: stepRows.map((step) => ({
      id: step.id,
      icon: step.icon,
      title: step.title,
      sortOrder: step.sort_order,
    })),

    image: howItWorks.image,

    buttonText: howItWorks.button_text,

    buttonLink: howItWorks.button_link,

    specialistsNumber:
      howItWorks.specialists_number,

    specialistsText:
      howItWorks.specialists_text,

    clientsNumber:
      howItWorks.clients_number,

    clientsText:
      howItWorks.clients_text,

    siteContentId:
      howItWorks.site_content_id,
  };
};


// CREATE HOW IT WORKS
const createHowItWorks = async (
  siteContentId,
  howItWorks,
  db = pool
) => {
  if (!howItWorks) {
    throw new Error("How It Works data is required");
  }


  // Check existing record
  const [existingRows] = await db.query(
    `
    SELECT id
    FROM how_it_works
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length > 0) {
    throw new Error("How It Works already exists");
  }


  // Insert main record
  const [result] = await db.query(
    `
    INSERT INTO how_it_works
    (
      heading,
      description,
      image,
      button_text,
      button_link,
      specialists_number,
      specialists_text,
      clients_number,
      clients_text,
      site_content_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      howItWorks.heading,
      howItWorks.description,
      howItWorks.image,
      howItWorks.buttonText,
      howItWorks.buttonLink,
      howItWorks.specialistsNumber,
      howItWorks.specialistsText,
      howItWorks.clientsNumber,
      howItWorks.clientsText,
      siteContentId,
    ]
  );

  const howItWorksId = result.insertId;


  // Insert steps
  if (Array.isArray(howItWorks.steps)) {
    for (
      let index = 0;
      index < howItWorks.steps.length;
      index++
    ) {
      const step = howItWorks.steps[index];

      await db.query(
        `
        INSERT INTO how_it_works_steps
        (
          how_it_works_id,
          icon,
          title,
          sort_order
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          howItWorksId,
          step.icon,
          step.title,
          step.sortOrder ?? index,
        ]
      );
    }
  }

  return getHowItWorks(siteContentId, db);
};


// UPDATE HOW IT WORKS
const updateHowItWorks = async (
  siteContentId,
  howItWorks,
  db = pool
) => {
  if (!howItWorks) {
    throw new Error("How It Works data is required");
  }


  // Check existing record
  const [existingRows] = await db.query(
    `
    SELECT id
    FROM how_it_works
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length === 0) {
    throw new Error("How It Works record not found");
  }

  const howItWorksId = existingRows[0].id;


  // Update main record
  await db.query(
    `
    UPDATE how_it_works
    SET
      heading = ?,
      description = ?,
      image = ?,
      button_text = ?,
      button_link = ?,
      specialists_number = ?,
      specialists_text = ?,
      clients_number = ?,
      clients_text = ?
    WHERE site_content_id = ?
    `,
    [
      howItWorks.heading,
      howItWorks.description,
      howItWorks.image,
      howItWorks.buttonText,
      howItWorks.buttonLink,
      howItWorks.specialistsNumber,
      howItWorks.specialistsText,
      howItWorks.clientsNumber,
      howItWorks.clientsText,
      siteContentId,
    ]
  );


  // Remove existing steps
  await db.query(
    `
    DELETE FROM how_it_works_steps
    WHERE how_it_works_id = ?
    `,
    [howItWorksId]
  );


  // Insert current steps
  if (Array.isArray(howItWorks.steps)) {
    for (
      let index = 0;
      index < howItWorks.steps.length;
      index++
    ) {
      const step = howItWorks.steps[index];

      await db.query(
        `
        INSERT INTO how_it_works_steps
        (
          how_it_works_id,
          icon,
          title,
          sort_order
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          howItWorksId,
          step.icon,
          step.title,
          step.sortOrder ?? index,
        ]
      );
    }
  }

  return getHowItWorks(siteContentId, db);
};


// DELETE HOW IT WORKS
const deleteHowItWorks = async (
  siteContentId,
  db = pool
) => {

  // Check existing record


  const [existingRows] = await db.query(
    `
    SELECT id
    FROM how_it_works
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length === 0) {
    throw new Error("How It Works record not found");
  }

  const howItWorksId = existingRows[0].id;


  // Delete steps first
  await db.query(
    `
    DELETE FROM how_it_works_steps
    WHERE how_it_works_id = ?
    `,
    [howItWorksId]
  );


  // Delete main record
  const [result] = await db.query(
    `
    DELETE FROM how_it_works
    WHERE site_content_id = ?
    `,
    [siteContentId]
  );

  if (result.affectedRows === 0) {
    throw new Error("How It Works record not found");
  }

  return true;
};


// EXPORT
module.exports = {
  getHowItWorks,
  createHowItWorks,
  updateHowItWorks,
  deleteHowItWorks,
};