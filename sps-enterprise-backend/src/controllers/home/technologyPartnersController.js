const { pool } = require("../../config/db");


// GET TECHNOLOGY PARTNERS
const getTechnologyPartners = async (
  siteContentId,
  db = pool
) => {
  const [sectionRows] = await db.query(
    `
    SELECT
      id,
      title,
      description,
      site_content_id
    FROM technology_partners
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (sectionRows.length === 0) {
    return null;
  }

  const section = sectionRows[0];

  const [partnerRows] = await db.query(
    `
    SELECT
      id,
      name,
      tagline,
      image,
      href,
      sort_order
    FROM technology_partner_items
    WHERE technology_partners_id = ?
    ORDER BY sort_order ASC, id ASC
    `,
    [section.id]
  );

  return {
    id: section.id,

    title: section.title,

    description: section.description,

    partners: partnerRows.map((partner) => ({
      id: partner.id,
      name: partner.name,
      tagline: partner.tagline,
      image: partner.image,
      href: partner.href,
      sortOrder: partner.sort_order,
    })),

    siteContentId: section.site_content_id,
  };
};


// CREATE TECHNOLOGY PARTNERS
const createTechnologyPartners = async (
  siteContentId,
  technologyPartners,
  db = pool
) => {
  if (!technologyPartners) {
    throw new Error(
      "Technology Partners data is required"
    );
  }

  const [existingRows] = await db.query(
    `
    SELECT id
    FROM technology_partners
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length > 0) {
    throw new Error(
      "Technology Partners already exists"
    );
  }

  const [sectionResult] = await db.query(
    `
    INSERT INTO technology_partners
    (
      site_content_id,
      title,
      description
    )
    VALUES (?, ?, ?)
    `,
    [
      siteContentId,
      technologyPartners.title,
      technologyPartners.description,
    ]
  );

  const technologyPartnersId =
    sectionResult.insertId;

  if (Array.isArray(technologyPartners.partners)) {
    for (
      let index = 0;
      index < technologyPartners.partners.length;
      index++
    ) {
      const partner =
        technologyPartners.partners[index];

      await db.query(
        `
        INSERT INTO technology_partner_items
        (
          technology_partners_id,
          name,
          tagline,
          image,
          href,
          sort_order
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          technologyPartnersId,
          partner.name,
          partner.tagline,
          partner.image,
          partner.href,
          partner.sortOrder ?? index,
        ]
      );
    }
  }

  return getTechnologyPartners(
    siteContentId,
    db
  );
};


// UPDATE TECHNOLOGY PARTNERS
const updateTechnologyPartners = async (
  siteContentId,
  technologyPartners,
  db = pool
) => {
  if (!technologyPartners) {
    throw new Error(
      "Technology Partners data is required"
    );
  }

  const [existingRows] = await db.query(
    `
    SELECT id
    FROM technology_partners
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length === 0) {
    throw new Error(
      "Technology Partners record not found"
    );
  }

  const technologyPartnersId =
    existingRows[0].id;

  await db.query(
    `
    UPDATE technology_partners
    SET
      title = ?,
      description = ?
    WHERE site_content_id = ?
    `,
    [
      technologyPartners.title,
      technologyPartners.description,
      siteContentId,
    ]
  );

  await db.query(
    `
    DELETE FROM technology_partner_items
    WHERE technology_partners_id = ?
    `,
    [technologyPartnersId]
  );

  if (Array.isArray(technologyPartners.partners)) {
    for (
      let index = 0;
      index < technologyPartners.partners.length;
      index++
    ) {
      const partner =
        technologyPartners.partners[index];

      await db.query(
        `
        INSERT INTO technology_partner_items
        (
          technology_partners_id,
          name,
          tagline,
          image,
          href,
          sort_order
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          technologyPartnersId,
          partner.name,
          partner.tagline,
          partner.image,
          partner.href,
          partner.sortOrder ?? index,
        ]
      );
    }
  }

  return getTechnologyPartners(
    siteContentId,
    db
  );
};


// DELETE TECHNOLOGY PARTNERS
const deleteTechnologyPartners = async (
  siteContentId,
  db = pool
) => {
  const [existingRows] = await db.query(
    `
    SELECT id
    FROM technology_partners
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length === 0) {
    throw new Error(
      "Technology Partners record not found"
    );
  }

  const technologyPartnersId =
    existingRows[0].id;

  await db.query(
    `
    DELETE FROM technology_partner_items
    WHERE technology_partners_id = ?
    `,
    [technologyPartnersId]
  );

  const [result] = await db.query(
    `
    DELETE FROM technology_partners
    WHERE site_content_id = ?
    `,
    [siteContentId]
  );

  if (result.affectedRows === 0) {
    throw new Error(
      "Technology Partners record not found"
    );
  }

  return true;
};


// EXPORT
module.exports = {
  getTechnologyPartners,
  createTechnologyPartners,
  updateTechnologyPartners,
  deleteTechnologyPartners,
};