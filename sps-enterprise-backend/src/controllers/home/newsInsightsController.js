
const { getDB } = require("../../config/db");

// GET NEWS & INSIGHTS
const getNewsInsights = async (siteContentId) => {
  const db = getDB();

  const newsInsights = await db.collection("news_insights").findOne({
    site_content_id: siteContentId,
  });

  if (!newsInsights) {
    return null;
  }

  // Get news items
  const itemRows = await db
    .collection("news_items")
    .find({ news_insights_id: newsInsights.id })
    .sort({ sort_order: 1, id: 1 })
    .toArray();

  return {
    id: newsInsights.id,
    title: newsInsights.title,
    viewAllText: newsInsights.view_all_text,
    viewAllLink: newsInsights.view_all_link,

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

    siteContentId: newsInsights.site_content_id,
  };
};


// CREATE NEWS & INSIGHTS
const createNewsInsights = async (siteContentId, newsInsights) => {
  if (!newsInsights) {
    throw new Error("News & Insights data is required");
  }

  const db = getDB();

  const sectionCollection = db.collection("news_insights");
  const itemsCollection = db.collection("news_items");

  // Check existing section
  const existing = await sectionCollection.findOne({
    site_content_id: siteContentId,
  });

  if (existing) {
    throw new Error("News & Insights already exists");
  }

  // Generate section ID
  const lastSection = await sectionCollection
    .find({})
    .sort({ id: -1 })
    .limit(1)
    .next();

  const newsInsightsId = (lastSection?.id || 0) + 1;

  // Create main section
  await sectionCollection.insertOne({
    id: newsInsightsId,
    title: newsInsights.title,
    view_all_text: newsInsights.viewAllText,
    view_all_link: newsInsights.viewAllLink,
    site_content_id: siteContentId,
  });

  // Create news items
  if (Array.isArray(newsInsights.items) && newsInsights.items.length > 0) {
    const lastItem = await itemsCollection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .next();

    let nextItemId = (lastItem?.id || 0) + 1;

    const items = newsInsights.items.map((item, index) => ({
      id: nextItemId++,
      news_insights_id: newsInsightsId,
      item_key: item.id,
      badge: item.badge,
      title: item.title,
      image: item.image,
      href: item.href,
      cta: item.cta,
      variant: item.variant,
      sort_order: item.sortOrder ?? index,
    }));

    await itemsCollection.insertMany(items);
  }

  return getNewsInsights(siteContentId);
};


// UPDATE NEWS & INSIGHTS
const updateNewsInsights = async (siteContentId, newsInsights) => {
  if (!newsInsights) {
    throw new Error("News & Insights data is required");
  }

  const db = getDB();

  const sectionCollection = db.collection("news_insights");
  const itemsCollection = db.collection("news_items");

  // Check existing section
  const existing = await sectionCollection.findOne({
    site_content_id: siteContentId,
  });

  if (!existing) {
    throw new Error("News & Insights record not found");
  }

  const newsInsightsId = existing.id;

  // Update main section
  await sectionCollection.updateOne(
    { id: newsInsightsId },
    {
      $set: {
        title: newsInsights.title,
        view_all_text: newsInsights.viewAllText,
        view_all_link: newsInsights.viewAllLink,
      },
    }
  );

  // Delete old items
  await itemsCollection.deleteMany({
    news_insights_id: newsInsightsId,
  });

  // Insert current items
  if (Array.isArray(newsInsights.items) && newsInsights.items.length > 0) {
    const lastItem = await itemsCollection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .next();

    let nextItemId = (lastItem?.id || 0) + 1;

    const items = newsInsights.items.map((item, index) => ({
      id: nextItemId++,
      news_insights_id: newsInsightsId,
      item_key: item.id,
      badge: item.badge,
      title: item.title,
      image: item.image,
      href: item.href,
      cta: item.cta,
      variant: item.variant,
      sort_order: item.sortOrder ?? index,
    }));

    await itemsCollection.insertMany(items);
  }

  return getNewsInsights(siteContentId);
};


// DELETE NEWS & INSIGHTS
const deleteNewsInsights = async (siteContentId) => {
  const db = getDB();

  const sectionCollection = db.collection("news_insights");
  const itemsCollection = db.collection("news_items");

  // Check existing section
  const existing = await sectionCollection.findOne({
    site_content_id: siteContentId,
  });

  if (!existing) {
    throw new Error("News & Insights record not found");
  }

  const newsInsightsId = existing.id;

  // Delete related news items first
  await itemsCollection.deleteMany({
    news_insights_id: newsInsightsId,
  });

  // Delete main section
  const result = await sectionCollection.deleteOne({
    site_content_id: siteContentId,
  });

  if (result.deletedCount === 0) {
    throw new Error("News & Insights record not found");
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
