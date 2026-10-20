const { pool } = require("../../config/db");


// GET SERVICES OVERVIEW
const getServicesOverview = async (
  siteContentId,
  db = pool
) => {

  // GET SERVICE CATEGORIES
  const [serviceCategoryRows] =
    await db.query(
      `
      SELECT
        id,
        slug,
        label,
        description,
        icon,
        sort_order,
        site_content_id
      FROM service_categories
      WHERE site_content_id = ?
      ORDER BY sort_order ASC, id ASC
      `,
      [siteContentId]
    );


  // GET SERVICE CARDS
  const [serviceCardRows] =
    await db.query(
      `
      SELECT
        id,
        slug,
        title,
        description,
        href,
        icon,
        sort_order,
        category_id
      FROM service_cards
      WHERE category_id IN (
        SELECT id
        FROM service_categories
        WHERE site_content_id = ?
      )
      ORDER BY sort_order ASC, id ASC
      `,
      [siteContentId]
    );


  // NO DATA
  if (serviceCategoryRows.length === 0) {
    return null;
  }


  // RETURN DB DATA
  return {
    categories: serviceCategoryRows.map(
      (category) => ({
        id: category.id,

        slug: category.slug,

        label: category.label,

        description:
          category.description,

        icon:
          category.icon,

        sortOrder:
          category.sort_order,

        siteContentId:
          category.site_content_id,

        cards: serviceCardRows
          .filter(
            (card) =>
              card.category_id ===
              category.id
          )
          .map((card) => ({
            id: card.id,

            slug: card.slug,

            title: card.title,

            description:
              card.description,

            href:
              card.href,

            icon:
              card.icon,

            sortOrder:
              card.sort_order,

            categoryId:
              card.category_id,
          })),
      })
    ),
  };
};


// CREATE SERVICES OVERVIEW
const createServicesOverview = async (
  siteContentId,
  servicesOverview,
  db = pool
) => {
  if (!servicesOverview) {
    throw new Error(
      "Services Overview data is required"
    );
  }

  if (
    !Array.isArray(
      servicesOverview.categories
    )
  ) {
    throw new Error(
      "Services Overview categories are required"
    );
  }


  // CHECK EXISTING CATEGORIES
  const [existingRows] =
    await db.query(
      `
      SELECT id
      FROM service_categories
      WHERE site_content_id = ?
      LIMIT 1
      `,
      [siteContentId]
    );

  if (existingRows.length > 0) {
    throw new Error(
      "Services Overview already exists"
    );
  }


  // CREATE CATEGORIES
  for (
    let categoryIndex = 0;
    categoryIndex <
    servicesOverview.categories.length;
    categoryIndex++
  ) {
    const category =
      servicesOverview.categories[
      categoryIndex
      ];

    const [categoryResult] =
      await db.query(
        `
        INSERT INTO service_categories
        (
          slug,
          label,
          description,
          icon,
          sort_order,
          site_content_id
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          category.slug,
          category.label,
          category.description,
          category.icon,
          category.sortOrder ?? categoryIndex,
          siteContentId,
        ]
      );

    const categoryId =
      categoryResult.insertId;


    // CREATE CARDS
    if (Array.isArray(category.cards)) {
      for (
        let cardIndex = 0;
        cardIndex < category.cards.length;
        cardIndex++
      ) {
        const card =
          category.cards[cardIndex];

        await db.query(
          `
          INSERT INTO service_cards
          (
            slug,
            title,
            description,
            href,
            icon,
            sort_order,
            category_id
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          [
            card.slug,
            card.title,
            card.description,
            card.href,
            card.icon,
            card.sortOrder ?? cardIndex,
            categoryId,
          ]
        );
      }
    }
  }

  return getServicesOverview(
    siteContentId,
    db
  );
};


// UPDATE SERVICES OVERVIEW
const updateServicesOverview = async (
  siteContentId,
  servicesOverview,
  db = pool
) => {
  if (!servicesOverview) {
    throw new Error(
      "Services Overview data is required"
    );
  }

  if (
    !Array.isArray(
      servicesOverview.categories
    )
  ) {
    throw new Error(
      "Services Overview categories are required"
    );
  }


  // CHECK EXISTING CATEGORIES
  const [existingRows] =
    await db.query(
      `
      SELECT id
      FROM service_categories
      WHERE site_content_id = ?
      LIMIT 1
      `,
      [siteContentId]
    );

  if (existingRows.length === 0) {
    throw new Error(
      "Services Overview record not found"
    );
  }


  // DELETE OLD CATEGORIES
  // service_cards will be deleted automatically
  // if ON DELETE CASCADE is configured.
  await db.query(
    `
    DELETE FROM service_categories
    WHERE site_content_id = ?
    `,
    [siteContentId]
  );


  // INSERT CURRENT CATEGORIES
  for (
    let categoryIndex = 0;
    categoryIndex <
    servicesOverview.categories.length;
    categoryIndex++
  ) {
    const category =
      servicesOverview.categories[
      categoryIndex
      ];

    const [categoryResult] =
      await db.query(
        `
        INSERT INTO service_categories
        (
          slug,
          label,
          description,
          icon,
          sort_order,
          site_content_id
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          category.slug,
          category.label,
          category.description,
          category.icon,
          category.sortOrder ?? categoryIndex,
          siteContentId,
        ]
      );

    const categoryId =
      categoryResult.insertId;


    // INSERT CURRENT CARDS
    if (Array.isArray(category.cards)) {
      for (
        let cardIndex = 0;
        cardIndex < category.cards.length;
        cardIndex++
      ) {
        const card =
          category.cards[cardIndex];

        await db.query(
          `
          INSERT INTO service_cards
          (
            slug,
            title,
            description,
            href,
            icon,
            sort_order,
            category_id
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          [
            card.slug,
            card.title,
            card.description,
            card.href,
            card.icon,
            card.sortOrder ?? cardIndex,
            categoryId,
          ]
        );
      }
    }
  }

  return getServicesOverview(
    siteContentId,
    db
  );
};


// DELETE SERVICES OVERVIEW
const deleteServicesOverview = async (
  siteContentId,
  db = pool
) => {

  // CHECK EXISTING CATEGORIES
  const [existingRows] =
    await db.query(
      `
      SELECT id
      FROM service_categories
      WHERE site_content_id = ?
      LIMIT 1
      `,
      [siteContentId]
    );

  if (existingRows.length === 0) {
    throw new Error(
      "Services Overview record not found"
    );
  }


  // DELETE CATEGORIES
  const [result] =
    await db.query(
      `
      DELETE FROM service_categories
      WHERE site_content_id = ?
      `,
      [siteContentId]
    );

  if (result.affectedRows === 0) {
    throw new Error(
      "Services Overview record not found"
    );
  }

  return true;
};


// EXPORT
module.exports = {
  getServicesOverview,
  createServicesOverview,
  updateServicesOverview,
  deleteServicesOverview,
}; 