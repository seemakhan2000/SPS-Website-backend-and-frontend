const { pool } = require("../../config/db");


// GET NEWS & INSIGHTS
const getNewsInsights = async (
  siteContentId,
  db = pool
) => {
  const [sectionRows] = await db.query(
    `
    SELECT
      id,
      title,
      view_all_text,
      view_all_link,
      site_content_id
    FROM news_insights
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (sectionRows.length === 0) {
    return null;
  }

  const newsInsights = sectionRows[0];


  // GET NEWS ITEMS
  const [itemRows] = await db.query(
    `
    SELECT
      id,
      item_key,
      badge,
      title,
      image,
      href,
      cta,
      variant,
      sort_order
    FROM news_items
    WHERE news_insights_id = ?
    ORDER BY sort_order ASC, id ASC
    `,
    [newsInsights.id]
  );


  // RETURN DB DATA
  return {
    id: newsInsights.id,

    title: newsInsights.title,

    viewAllText:
      newsInsights.view_all_text,

    viewAllLink:
      newsInsights.view_all_link,

    items: itemRows.map((item) => ({
      id: item.item_key,
      badge: item.badge,
      title: item.title,
      image: item.image,
      href: item.href,
      cta: item.cta,
      variant: item.variant,
      sortOrder: item.sort_order,
    })),

    siteContentId:
      newsInsights.site_content_id,
  };
};


// CREATE NEWS & INSIGHTS
const createNewsInsights = async (
  siteContentId,
  newsInsights,
  db = pool
) => {
  if (!newsInsights) {
    throw new Error(
      "News & Insights data is required"
    );
  }


  // CHECK EXISTING SECTION
  const [existingRows] = await db.query(
    `
    SELECT id
    FROM news_insights
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length > 0) {
    throw new Error(
      "News & Insights already exists"
    );
  }


  // CREATE MAIN SECTION
  const [sectionResult] = await db.query(
    `
    INSERT INTO news_insights
    (
      title,
      view_all_text,
      view_all_link,
      site_content_id
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      newsInsights.title,
      newsInsights.viewAllText,
      newsInsights.viewAllLink,
      siteContentId,
    ]
  );

  const newsInsightsId =
    sectionResult.insertId;


  // CREATE NEWS ITEMS
  if (Array.isArray(newsInsights.items)) {
    for (
      let index = 0;
      index < newsInsights.items.length;
      index++
    ) {
      const item =
        newsInsights.items[index];

      await db.query(
        `
        INSERT INTO news_items
        (
          news_insights_id,
          item_key,
          badge,
          title,
          image,
          href,
          cta,
          variant,
          sort_order
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          newsInsightsId,
          item.id,
          item.badge,
          item.title,
          item.image,
          item.href,
          item.cta,
          item.variant,
          item.sortOrder ?? index,
        ]
      );
    }
  }

  return getNewsInsights(
    siteContentId,
    db
  );
};


// UPDATE NEWS & INSIGHTS
const updateNewsInsights = async (
  siteContentId,
  newsInsights,
  db = pool
) => {
  if (!newsInsights) {
    throw new Error(
      "News & Insights data is required"
    );
  }


  // CHECK EXISTING SECTION
  const [existingRows] = await db.query(
    `
    SELECT id
    FROM news_insights
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length === 0) {
    throw new Error(
      "News & Insights record not found"
    );
  }

  const newsInsightsId =
    existingRows[0].id;


  // UPDATE MAIN SECTION
  await db.query(
    `
    UPDATE news_insights
    SET
      title = ?,
      view_all_text = ?,
      view_all_link = ?
    WHERE site_content_id = ?
    `,
    [
      newsInsights.title,
      newsInsights.viewAllText,
      newsInsights.viewAllLink,
      siteContentId,
    ]
  );


  // DELETE OLD ITEMS
  await db.query(
    `
    DELETE FROM news_items
    WHERE news_insights_id = ?
    `,
    [newsInsightsId]
  );


  // INSERT CURRENT ITEMS
  if (Array.isArray(newsInsights.items)) {
    for (
      let index = 0;
      index < newsInsights.items.length;
      index++
    ) {
      const item =
        newsInsights.items[index];

      await db.query(
        `
        INSERT INTO news_items
        (
          news_insights_id,
          item_key,
          badge,
          title,
          image,
          href,
          cta,
          variant,
          sort_order
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          newsInsightsId,
          item.id,
          item.badge,
          item.title,
          item.image,
          item.href,
          item.cta,
          item.variant,
          item.sortOrder ?? index,
        ]
      );
    }
  }

  return getNewsInsights(
    siteContentId,
    db
  );
};


// DELETE NEWS & INSIGHTS
const deleteNewsInsights = async (
  siteContentId,
  db = pool
) => {

  // CHECK EXISTING SECTION
  const [existingRows] = await db.query(
    `
    SELECT id
    FROM news_insights
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length === 0) {
    throw new Error(
      "News & Insights record not found"
    );
  }

  const newsInsightsId =
    existingRows[0].id;


  // DELETE NEWS ITEMS FIRST
  await db.query(
    `
    DELETE FROM news_items
    WHERE news_insights_id = ?
    `,
    [newsInsightsId]
  );


  // DELETE MAIN SECTION
  const [result] = await db.query(
    `
    DELETE FROM news_insights
    WHERE site_content_id = ?
    `,
    [siteContentId]
  );

  if (result.affectedRows === 0) {
    throw new Error(
      "News & Insights record not found"
    );
  }

  return true;
};


// EXPORT
module.exports = {
  getNewsInsights,
  createNewsInsights,
  updateNewsInsights,
  deleteNewsInsights,
};