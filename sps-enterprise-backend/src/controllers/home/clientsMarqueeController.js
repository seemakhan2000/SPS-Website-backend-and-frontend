const { pool } = require("../../config/db");


// GET CLIENTS MARQUEE
const getClientsMarquee = async (
  siteContentId,
  db = pool
) => {

  // Get main Clients Marquee record
  const [marqueeRows] = await db.query(
    `
    SELECT
      id,
      title,
      site_content_id
    FROM clients_marquee
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  // No DB record
  if (marqueeRows.length === 0) {
    return null;
  }

  const marquee = marqueeRows[0];


  // Get client logos
  const [clientRows] = await db.query(
    `
    SELECT
      id,
      name,
      logo,
      alt,
      sort_order
    FROM client_logos
    WHERE clients_marquee_id = ?
    ORDER BY sort_order ASC, id ASC
    `,
    [marquee.id]
  );


  // Return DB data
  return {
    id: marquee.id,
    title: marquee.title,
    siteContentId: marquee.site_content_id,

    clients: clientRows.map((client) => ({
      id: client.id,
      name: client.name,
      logo: client.logo,
      alt: client.alt,
      sortOrder: client.sort_order,
    })),
  };
};


// CREATE CLIENTS MARQUEE
const createClientsMarquee = async (
  siteContentId,
  clientsMarquee,
  db = pool
) => {
  if (!clientsMarquee) {
    throw new Error("Clients Marquee data is required");
  }


  // Check existing record
  const [existingRows] = await db.query(
    `
    SELECT
      id
    FROM clients_marquee
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length > 0) {
    throw new Error(
      "Clients Marquee already exists"
    );
  }


  // Create main marquee record
  const [marqueeResult] = await db.query(
    `
    INSERT INTO clients_marquee
    (
      title,
      site_content_id
    )
    VALUES (?, ?)
    `,
    [
      clientsMarquee.title,
      siteContentId,
    ]
  );

  const clientsMarqueeId =
    marqueeResult.insertId;


  // Insert client logos
  if (Array.isArray(clientsMarquee.clients)) {
    for (
      let index = 0;
      index < clientsMarquee.clients.length;
      index++
    ) {
      const client =
        clientsMarquee.clients[index];

      await db.query(
        `
        INSERT INTO client_logos
        (
          clients_marquee_id,
          name,
          logo,
          alt,
          sort_order
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          clientsMarqueeId,
          client.name,
          client.logo,
          client.alt,
          client.sortOrder ?? index,
        ]
      );
    }
  }


  // Return created DB record
  return getClientsMarquee(
    siteContentId,
    db
  );
};


// UPDATE CLIENTS MARQUEE
const updateClientsMarquee = async (
  siteContentId,
  clientsMarquee,
  db = pool
) => {
  if (!clientsMarquee) {
    throw new Error("Clients Marquee data is required");
  }


  // Find existing marquee
  const [existingRows] = await db.query(
    `
    SELECT
      id
    FROM clients_marquee
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length === 0) {
    throw new Error(
      "Clients Marquee record not found"
    );
  }

  const clientsMarqueeId =
    existingRows[0].id;


  // Update main marquee
  await db.query(
    `
    UPDATE clients_marquee
    SET
      title = ?
    WHERE id = ?
    `,
    [
      clientsMarquee.title,
      clientsMarqueeId,
    ]
  );


  // Delete existing client logos
  await db.query(
    `
    DELETE FROM client_logos
    WHERE clients_marquee_id = ?
    `,
    [clientsMarqueeId]
  );


  // Insert updated client logos
  if (Array.isArray(clientsMarquee.clients)) {
    for (
      let index = 0;
      index < clientsMarquee.clients.length;
      index++
    ) {
      const client =
        clientsMarquee.clients[index];

      await db.query(
        `
        INSERT INTO client_logos
        (
          clients_marquee_id,
          name,
          logo,
          alt,
          sort_order
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          clientsMarqueeId,
          client.name,
          client.logo,
          client.alt,
          client.sortOrder ?? index,
        ]
      );
    }
  }


  // Return updated DB record
  return getClientsMarquee(
    siteContentId,
    db
  );
};


// DELETE CLIENTS MARQUEE
const deleteClientsMarquee = async (
  siteContentId,
  db = pool
) => {

  // Find existing marquee
  const [existingRows] = await db.query(
    `
    SELECT
      id
    FROM clients_marquee
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length === 0) {
    throw new Error(
      "Clients Marquee record not found"
    );
  }

  const clientsMarqueeId =
    existingRows[0].id;


  // Delete client logos first
  await db.query(
    `
    DELETE FROM client_logos
    WHERE clients_marquee_id = ?
    `,
    [clientsMarqueeId]
  );


  // Delete 
  const [result] = await db.query(
    `
    DELETE FROM clients_marquee
    WHERE id = ?
    `,
    [clientsMarqueeId]
  );

  if (result.affectedRows === 0) {
    throw new Error(
      "Clients Marquee record not found"
    );
  }

  return true;
};


// EXPORT
module.exports = {
  getClientsMarquee,
  createClientsMarquee,
  updateClientsMarquee,
  deleteClientsMarquee,
};