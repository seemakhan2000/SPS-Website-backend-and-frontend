const { pool } = require("../../config/db");


// GET CUSTOMERS
const getCustomers = async (
  siteContentId,
  db = pool
) => {

  // Get customer section
  const [sectionRows] = await db.query(
    `
    SELECT
      id,
      site_content_id,
      heading_line1,
      heading_line2,
      heading_line3,
      main_image,
      deployment_number,
      deployment_text
    FROM customers_section
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  // No DB record
  if (sectionRows.length === 0) {
    return null;
  }

  const section = sectionRows[0];


  // Get testimonial
  const [testimonialRows] = await db.query(
    `
    SELECT
      id,
      name,
      rating,
      message,
      image
    FROM customer_testimonial
    WHERE section_id = ?
    LIMIT 1
    `,
    [section.id]
  );

  const testimonial =
    testimonialRows.length > 0
      ? {
        id: testimonialRows[0].id,
        name: testimonialRows[0].name,
        rating: Number(
          testimonialRows[0].rating
        ),
        message:
          testimonialRows[0].message,
        image: testimonialRows[0].image,
      }
      : null;


  // Get deployment avatars
  const [avatarRows] = await db.query(
    `
    SELECT
      id,
      image,
      sort_order
    FROM customer_deployment_avatars
    WHERE section_id = ?
    ORDER BY sort_order ASC, id ASC
    `,
    [section.id]
  );


  // Get impact
  const [impactRows] = await db.query(
    `
    SELECT
      id,
      name,
      role,
      title,
      description,
      image
    FROM customer_impact
    WHERE section_id = ?
    LIMIT 1
    `,
    [section.id]
  );

  const impact =
    impactRows.length > 0
      ? {
        id: impactRows[0].id,
        name: impactRows[0].name,
        role: impactRows[0].role,
        title: impactRows[0].title,
        description:
          impactRows[0].description,
        image: impactRows[0].image,
      }
      : null;


  // Return only DB data
  return {
    id: section.id,
    siteContentId:
      section.site_content_id,

    headingLine1:
      section.heading_line1,

    headingLine2:
      section.heading_line2,

    headingLine3:
      section.heading_line3,

    mainImage:
      section.main_image,

    testimonial,

    deployment: {
      number:
        section.deployment_number,

      text:
        section.deployment_text,

      avatars: avatarRows.map(
        (avatar) => ({
          id: avatar.id,
          image: avatar.image,
          sortOrder:
            avatar.sort_order,
        })
      ),
    },

    impact,
  };
};


// CREATE CUSTOMERS
const createCustomers = async (
  siteContentId,
  customersContent,
  db = pool
) => {
  if (!customersContent) {
    throw new Error(
      "Customers data is required"
    );
  }


  // Check existing customer section
  const [existingRows] = await db.query(
    `
    SELECT
      id
    FROM customers_section
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length > 0) {
    throw new Error(
      "Customers section already exists"
    );
  }


  // Create customer section
  const [sectionResult] =
    await db.query(
      `
      INSERT INTO customers_section
      (
        site_content_id,
        heading_line1,
        heading_line2,
        heading_line3,
        main_image,
        deployment_number,
        deployment_text
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        siteContentId,
        customersContent.headingLine1,
        customersContent.headingLine2,
        customersContent.headingLine3,
        customersContent.mainImage,
        customersContent.deployment?.number,
        customersContent.deployment?.text,
      ]
    );

  const sectionId =
    sectionResult.insertId;


  // Create testimonial
  if (customersContent.testimonial) {
    await db.query(
      `
      INSERT INTO customer_testimonial
      (
        section_id,
        name,
        rating,
        message,
        image
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        sectionId,
        customersContent.testimonial.name,
        customersContent.testimonial.rating,
        customersContent.testimonial.message,
        customersContent.testimonial.image,
      ]
    );
  }


  // Create deployment avatars
  if (
    Array.isArray(
      customersContent.deployment?.avatars
    )
  ) {
    for (
      let index = 0;
      index <
      customersContent.deployment.avatars.length;
      index++
    ) {
      const avatar =
        customersContent.deployment.avatars[index];

      await db.query(
        `
        INSERT INTO customer_deployment_avatars
        (
          section_id,
          image,
          sort_order
        )
        VALUES (?, ?, ?)
        `,
        [
          sectionId,
          avatar.image,
          avatar.sortOrder ?? index,
        ]
      );
    }
  }


  // Create impact
  if (customersContent.impact) {
    await db.query(
      `
      INSERT INTO customer_impact
      (
        section_id,
        name,
        role,
        title,
        description,
        image
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        sectionId,
        customersContent.impact.name,
        customersContent.impact.role,
        customersContent.impact.title,
        customersContent.impact.description,
        customersContent.impact.image,
      ]
    );
  }


  // Return created DB data
  return getCustomers(
    siteContentId,
    db
  );
};


// UPDATE CUSTOMERS
const updateCustomers = async (
  siteContentId,
  customersContent,
  db = pool
) => {
  if (!customersContent) {
    throw new Error(
      "Customers data is required"
    );
  }


  // Find existing customer section
  const [existingRows] = await db.query(
    `
    SELECT
      id
    FROM customers_section
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );


  // Do NOT create automatically
  if (existingRows.length === 0) {
    throw new Error(
      "Customers section not found"
    );
  }

  const sectionId =
    existingRows[0].id;


  // Update customer section
  await db.query(
    `
    UPDATE customers_section
    SET
      heading_line1 = ?,
      heading_line2 = ?,
      heading_line3 = ?,
      main_image = ?,
      deployment_number = ?,
      deployment_text = ?
    WHERE id = ?
    `,
    [
      customersContent.headingLine1,
      customersContent.headingLine2,
      customersContent.headingLine3,
      customersContent.mainImage,
      customersContent.deployment?.number,
      customersContent.deployment?.text,
      sectionId,
    ]
  );


  // Update testimonial
  const [existingTestimonial] =
    await db.query(
      `
      SELECT
        id
      FROM customer_testimonial
      WHERE section_id = ?
      LIMIT 1
      `,
      [sectionId]
    );

  if (
    customersContent.testimonial
  ) {
    if (
      existingTestimonial.length > 0
    ) {
      await db.query(
        `
        UPDATE customer_testimonial
        SET
          name = ?,
          rating = ?,
          message = ?,
          image = ?
        WHERE section_id = ?
        `,
        [
          customersContent.testimonial.name,
          customersContent.testimonial.rating,
          customersContent.testimonial.message,
          customersContent.testimonial.image,
          sectionId,
        ]
      );
    } else {
      await db.query(
        `
        INSERT INTO customer_testimonial
        (
          section_id,
          name,
          rating,
          message,
          image
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          sectionId,
          customersContent.testimonial.name,
          customersContent.testimonial.rating,
          customersContent.testimonial.message,
          customersContent.testimonial.image,
        ]
      );
    }
  }


  // Replace deployment avatars
  await db.query(
    `
    DELETE FROM customer_deployment_avatars
    WHERE section_id = ?
    `,
    [sectionId]
  );

  if (
    Array.isArray(
      customersContent.deployment?.avatars
    )
  ) {
    for (
      let index = 0;
      index <
      customersContent.deployment.avatars.length;
      index++
    ) {
      const avatar =
        customersContent.deployment.avatars[index];

      await db.query(
        `
        INSERT INTO customer_deployment_avatars
        (
          section_id,
          image,
          sort_order
        )
        VALUES (?, ?, ?)
        `,
        [
          sectionId,
          avatar.image,
          avatar.sortOrder ?? index,
        ]
      );
    }
  }


  // Update impact
  const [existingImpact] =
    await db.query(
      `
      SELECT
        id
      FROM customer_impact
      WHERE section_id = ?
      LIMIT 1
      `,
      [sectionId]
    );

  if (customersContent.impact) {
    if (
      existingImpact.length > 0
    ) {
      await db.query(
        `
        UPDATE customer_impact
        SET
          name = ?,
          role = ?,
          title = ?,
          description = ?,
          image = ?
        WHERE section_id = ?
        `,
        [
          customersContent.impact.name,
          customersContent.impact.role,
          customersContent.impact.title,
          customersContent.impact.description,
          customersContent.impact.image,
          sectionId,
        ]
      );
    } else {
      await db.query(
        `
        INSERT INTO customer_impact
        (
          section_id,
          name,
          role,
          title,
          description,
          image
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          sectionId,
          customersContent.impact.name,
          customersContent.impact.role,
          customersContent.impact.title,
          customersContent.impact.description,
          customersContent.impact.image,
        ]
      );
    }
  }


  // Return updated DB data
  return getCustomers(
    siteContentId,
    db
  );
};


// DELETE CUSTOMERS
const deleteCustomers = async (
  siteContentId,
  db = pool
) => {

  // Find customer section
  const [existingRows] = await db.query(
    `
    SELECT
      id
    FROM customers_section
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length === 0) {
    throw new Error(
      "Customers section not found"
    );
  }

  const sectionId =
    existingRows[0].id;


  // Delete testimonial
  await db.query(
    `
    DELETE FROM customer_testimonial
    WHERE section_id = ?
    `,
    [sectionId]
  );


  // Delete deployment avatars
  await db.query(
    `
    DELETE FROM customer_deployment_avatars
    WHERE section_id = ?
    `,
    [sectionId]
  );


  // Delete impact
  await db.query(
    `
    DELETE FROM customer_impact
    WHERE section_id = ?
    `,
    [sectionId]
  );


  // Delete customer section
  const [result] = await db.query(
    `
    DELETE FROM customers_section
    WHERE id = ?
    `,
    [sectionId]
  );

  if (result.affectedRows === 0) {
    throw new Error(
      "Customers section not found"
    );
  }

  return true;
};


// EXPORT
module.exports = {
  getCustomers,
  createCustomers,
  updateCustomers,
  deleteCustomers,
};