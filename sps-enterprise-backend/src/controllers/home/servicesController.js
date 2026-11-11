
const { getDB } = require("../../config/db");

// GET SERVICES OVERVIEW
const getServicesOverview = async (siteContentId) => {
  const db = getDB();

  const categoryCollection = db.collection("service_categories");
  const cardCollection = db.collection("service_cards");

  // Get service categories
  const serviceCategoryRows = await categoryCollection
    .find({ site_content_id: siteContentId })
    .sort({ sort_order: 1, id: 1 })
    .toArray();

  if (serviceCategoryRows.length === 0) {
    return null;
  }

  // Get cards belonging to these categories
  const categoryIds = serviceCategoryRows.map(
    (category) => category.id
  );

  const serviceCardRows = await cardCollection
    .find({ category_id: { $in: categoryIds } })
    .sort({ sort_order: 1, id: 1 })
    .toArray();

  // Return DB data
  return {
    categories: serviceCategoryRows.map((category) => ({
      id: category.id,
      slug: category.slug,
      label: category.label,
      description: category.description,
      icon: category.icon,
      sortOrder: category.sort_order,
      siteContentId: category.site_content_id,

      cards: serviceCardRows
        .filter((card) => card.category_id === category.id)
        .map((card) => ({
          id: card.id,
          slug: card.slug,
          title: card.title,
          description: card.description,
          href: card.href,
          icon: card.icon,
          sortOrder: card.sort_order,
          categoryId: card.category_id,
        })),
    })),
  };
};


// CREATE SERVICES OVERVIEW
const createServicesOverview = async (
  siteContentId,
  servicesOverview
) => {
  if (!servicesOverview) {
    throw new Error("Services Overview data is required");
  }

  if (!Array.isArray(servicesOverview.categories)) {
    throw new Error("Services Overview categories are required");
  }

  const db = getDB();

  const categoryCollection = db.collection("service_categories");
  const cardCollection = db.collection("service_cards");

  // Check existing categories
  const existing = await categoryCollection.findOne({
    site_content_id: siteContentId,
  });

  if (existing) {
    throw new Error("Services Overview already exists");
  }

  // Generate category IDs
  const lastCategory = await categoryCollection
    .find({})
    .sort({ id: -1 })
    .limit(1)
    .next();

  let nextCategoryId = (lastCategory?.id || 0) + 1;

  // Generate card IDs
  const lastCard = await cardCollection
    .find({})
    .sort({ id: -1 })
    .limit(1)
    .next();

  let nextCardId = (lastCard?.id || 0) + 1;

  const categoriesToInsert = [];
  const cardsToInsert = [];

  // Prepare categories and cards
  for (
    let categoryIndex = 0;
    categoryIndex < servicesOverview.categories.length;
    categoryIndex++
  ) {
    const category = servicesOverview.categories[categoryIndex];

    const categoryId = nextCategoryId++;

    categoriesToInsert.push({
      id: categoryId,
      slug: category.slug,
      label: category.label,
      description: category.description,
      icon: category.icon,
      sort_order: category.sortOrder ?? categoryIndex,
      site_content_id: siteContentId,
    });

    // Prepare cards
    if (Array.isArray(category.cards)) {
      for (
        let cardIndex = 0;
        cardIndex < category.cards.length;
        cardIndex++
      ) {
        const card = category.cards[cardIndex];

        cardsToInsert.push({
          id: nextCardId++,
          slug: card.slug,
          title: card.title,
          description: card.description,
          href: card.href,
          icon: card.icon,
          sort_order: card.sortOrder ?? cardIndex,
          category_id: categoryId,
        });
      }
    }
  }

  // Insert categories
  if (categoriesToInsert.length > 0) {
    await categoryCollection.insertMany(categoriesToInsert);
  }

  // Insert cards
  if (cardsToInsert.length > 0) {
    await cardCollection.insertMany(cardsToInsert);
  }

  return getServicesOverview(siteContentId);
};


// UPDATE SERVICES OVERVIEW
const updateServicesOverview = async (
  siteContentId,
  servicesOverview
) => {
  if (!servicesOverview) {
    throw new Error("Services Overview data is required");
  }

  if (!Array.isArray(servicesOverview.categories)) {
    throw new Error("Services Overview categories are required");
  }

  const db = getDB();

  const categoryCollection = db.collection("service_categories");
  const cardCollection = db.collection("service_cards");

  // Check existing categories
  const existingCategories = await categoryCollection
    .find({ site_content_id: siteContentId })
    .toArray();

  if (existingCategories.length === 0) {
    throw new Error("Services Overview record not found");
  }

  const oldCategoryIds = existingCategories.map(
    (category) => category.id
  );

  // Delete old cards first
  await cardCollection.deleteMany({
    category_id: { $in: oldCategoryIds },
  });

  // Delete old categories
  await categoryCollection.deleteMany({
    site_content_id: siteContentId,
  });

  // Generate category IDs
  const lastCategory = await categoryCollection
    .find({})
    .sort({ id: -1 })
    .limit(1)
    .next();

  let nextCategoryId = (lastCategory?.id || 0) + 1;

  // Generate card IDs
  const lastCard = await cardCollection
    .find({})
    .sort({ id: -1 })
    .limit(1)
    .next();

  let nextCardId = (lastCard?.id || 0) + 1;

  const categoriesToInsert = [];
  const cardsToInsert = [];

  // Prepare new categories and cards
  for (
    let categoryIndex = 0;
    categoryIndex < servicesOverview.categories.length;
    categoryIndex++
  ) {
    const category = servicesOverview.categories[categoryIndex];

    const categoryId = nextCategoryId++;

    categoriesToInsert.push({
      id: categoryId,
      slug: category.slug,
      label: category.label,
      description: category.description,
      icon: category.icon,
      sort_order: category.sortOrder ?? categoryIndex,
      site_content_id: siteContentId,
    });

    if (Array.isArray(category.cards)) {
      for (
        let cardIndex = 0;
        cardIndex < category.cards.length;
        cardIndex++
      ) {
        const card = category.cards[cardIndex];

        cardsToInsert.push({
          id: nextCardId++,
          slug: card.slug,
          title: card.title,
          description: card.description,
          href: card.href,
          icon: card.icon,
          sort_order: card.sortOrder ?? cardIndex,
          category_id: categoryId,
        });
      }
    }
  }

  // Insert categories
  if (categoriesToInsert.length > 0) {
    await categoryCollection.insertMany(categoriesToInsert);
  }

  // Insert cards
  if (cardsToInsert.length > 0) {
    await cardCollection.insertMany(cardsToInsert);
  }

  return getServicesOverview(siteContentId);
};


// DELETE SERVICES OVERVIEW
const deleteServicesOverview = async (siteContentId) => {
  const db = getDB();

  const categoryCollection = db.collection("service_categories");
  const cardCollection = db.collection("service_cards");

  // Get existing categories
  const existingCategories = await categoryCollection
    .find({ site_content_id: siteContentId })
    .toArray();

  if (existingCategories.length === 0) {
    throw new Error("Services Overview record not found");
  }

  const categoryIds = existingCategories.map(
    (category) => category.id
  );

  // Delete related cards first
  await cardCollection.deleteMany({
    category_id: { $in: categoryIds },
  });

  // Delete categories
  const result = await categoryCollection.deleteMany({
    site_content_id: siteContentId,
  });

  if (result.deletedCount === 0) {
    throw new Error("Services Overview record not found");
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
