const { pool } = require("../../config/db");


// GET CONTACT CTA
const getContactCTA = async (
  siteContentId,
  db = pool
) => {

  // Get CTA from database
  const [ctaRows] = await db.query(
    `
    SELECT
      id,
      site_content_id,
      side_label,
      title_line1,
      highlighted_title,
      title_line2,
      title_line3,
      name_label,
      email_label,
      phone_label,
      service_label,
      message_label,
      button_text,
      image
    FROM contact_cta
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  // No DB record
  if (ctaRows.length === 0) {
    return null;
  }

  const cta = ctaRows[0];


  // Get CTA services
  const [serviceRows] = await db.query(
    `
    SELECT
      id,
      name,
      sort_order
    FROM contact_cta_services
    WHERE contact_cta_id = ?
    ORDER BY sort_order ASC, id ASC
    `,
    [cta.id]
  );


  // Return DB data
  return {
    id: cta.id,
    siteContentId: cta.site_content_id,

    sideLabel: cta.side_label,

    titleLine1: cta.title_line1,

    highlightedTitle:
      cta.highlighted_title,

    titleLine2: cta.title_line2,

    titleLine3: cta.title_line3,

    nameLabel: cta.name_label,

    emailLabel: cta.email_label,

    phoneLabel: cta.phone_label,

    serviceLabel: cta.service_label,

    messageLabel: cta.message_label,

    buttonText: cta.button_text,

    image: cta.image,

    services: serviceRows.map(
      (service) => ({
        id: service.id,
        name: service.name,
        sortOrder: service.sort_order,
      })
    ),
  };
};


// CREATE CONTACT CTA
const createContactCTA = async (
  siteContentId,
  contactCTAContent,
  db = pool
) => {
  if (!contactCTAContent) {
    throw new Error(
      "Contact CTA data is required"
    );
  }


  // Check existing CTA
  const [existingRows] = await db.query(
    `
    SELECT
      id
    FROM contact_cta
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length > 0) {
    throw new Error(
      "Contact CTA already exists"
    );
  }


  // Create CTA
  const [ctaResult] = await db.query(
    `
    INSERT INTO contact_cta
    (
      site_content_id,
      side_label,
      title_line1,
      highlighted_title,
      title_line2,
      title_line3,
      name_label,
      email_label,
      phone_label,
      service_label,
      message_label,
      button_text,
      image
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      siteContentId,
      contactCTAContent.sideLabel,
      contactCTAContent.titleLine1,
      contactCTAContent.highlightedTitle,
      contactCTAContent.titleLine2,
      contactCTAContent.titleLine3,
      contactCTAContent.nameLabel,
      contactCTAContent.emailLabel,
      contactCTAContent.phoneLabel,
      contactCTAContent.serviceLabel,
      contactCTAContent.messageLabel,
      contactCTAContent.buttonText,
      contactCTAContent.image ?? null,
    ]
  );

  const contactCTAId =
    ctaResult.insertId;


  // Insert services
  if (
    Array.isArray(
      contactCTAContent.services
    )
  ) {
    for (
      let index = 0;
      index <
      contactCTAContent.services.length;
      index++
    ) {
      const service =
        contactCTAContent.services[index];

      await db.query(
        `
        INSERT INTO contact_cta_services
        (
          contact_cta_id,
          name,
          sort_order
        )
        VALUES (?, ?, ?)
        `,
        [
          contactCTAId,
          service.name,
          service.sortOrder ?? index,
        ]
      );
    }
  }


  // Return created DB record
  return getContactCTA(
    siteContentId,
    db
  );
};


// UPDATE CONTACT CTA
const updateContactCTA = async (
  siteContentId,
  contactCTAContent,
  db = pool
) => {
  if (!contactCTAContent) {
    throw new Error(
      "Contact CTA data is required"
    );
  }


  // Find existing CTA
  const [existingRows] = await db.query(
    `
    SELECT
      id
    FROM contact_cta
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );


  // Do NOT create automatically
  if (existingRows.length === 0) {
    throw new Error(
      "Contact CTA record not found"
    );
  }

  const contactCTAId =
    existingRows[0].id;


  // Update CTA
  await db.query(
    `
    UPDATE contact_cta
    SET
      side_label = ?,
      title_line1 = ?,
      highlighted_title = ?,
      title_line2 = ?,
      title_line3 = ?,
      name_label = ?,
      email_label = ?,
      phone_label = ?,
      service_label = ?,
      message_label = ?,
      button_text = ?,
      image = ?
    WHERE id = ?
    `,
    [
      contactCTAContent.sideLabel,
      contactCTAContent.titleLine1,
      contactCTAContent.highlightedTitle,
      contactCTAContent.titleLine2,
      contactCTAContent.titleLine3,
      contactCTAContent.nameLabel,
      contactCTAContent.emailLabel,
      contactCTAContent.phoneLabel,
      contactCTAContent.serviceLabel,
      contactCTAContent.messageLabel,
      contactCTAContent.buttonText,
      contactCTAContent.image ?? null,
      contactCTAId,
    ]
  );


  // Delete old services
  await db.query(
    `
    DELETE FROM contact_cta_services
    WHERE contact_cta_id = ?
    `,
    [contactCTAId]
  );


  // Insert updated services
  if (
    Array.isArray(
      contactCTAContent.services
    )
  ) {
    for (
      let index = 0;
      index <
      contactCTAContent.services.length;
      index++
    ) {
      const service =
        contactCTAContent.services[index];

      await db.query(
        `
        INSERT INTO contact_cta_services
        (
          contact_cta_id,
          name,
          sort_order
        )
        VALUES (?, ?, ?)
        `,
        [
          contactCTAId,
          service.name,
          service.sortOrder ?? index,
        ]
      );
    }
  }


  // Return updated DB record
  return getContactCTA(
    siteContentId,
    db
  );
};


// DELETE CONTACT CTA
const deleteContactCTA = async (
  siteContentId,
  db = pool
) => {

  // Find existing CTA
  const [existingRows] = await db.query(
    `
    SELECT
      id
    FROM contact_cta
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length === 0) {
    throw new Error(
      "Contact CTA record not found"
    );
  }

  const contactCTAId =
    existingRows[0].id;


  // Delete CTA services first
  await db.query(
    `
    DELETE FROM contact_cta_services
    WHERE contact_cta_id = ?
    `,
    [contactCTAId]
  );


  // Delete main CTA
  const [result] = await db.query(
    `
    DELETE FROM contact_cta
    WHERE id = ?
    `,
    [contactCTAId]
  );

  if (result.affectedRows === 0) {
    throw new Error(
      "Contact CTA record not found"
    );
  }

  return true;
};


// EXPORT
module.exports = {
  getContactCTA,
  createContactCTA,
  updateContactCTA,
  deleteContactCTA,
};