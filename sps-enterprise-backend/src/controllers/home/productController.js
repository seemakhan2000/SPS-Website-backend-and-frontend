
const { getDB } = require("../../config/db");

// GET PRODUCTS
const getProducts = async (siteContentId) => {
  const db = getDB();

  const section = await db.collection("products_section").findOne({
    site_content_id: siteContentId,
  });

  if (!section) {
    return null;
  }

  // Get products
  const productRows = await db
    .collection("products")
    .find({ section_id: section.id })
    .sort({ sort_order: 1, id: 1 })
    .toArray();

  return {
    id: section.id,
    title: section.title,
    yearsNumber: section.years_number,
    yearsText: section.years_text,
    yearsDescription: section.years_description,
    backgroundImage: section.background_image,

    products: productRows.map((product) => ({
      id: product.id,
      name: product.name,
      image: product.image,
      description: product.description,
      sortOrder: product.sort_order,
    })),

    siteContentId: section.site_content_id,
  };
};


// CREATE PRODUCTS
const createProducts = async (siteContentId, productsContent) => {
  if (!productsContent) {
    throw new Error("Products data is required");
  }

  const db = getDB();

  const sectionCollection = db.collection("products_section");
  const productsCollection = db.collection("products");

  // Check existing section
  const existing = await sectionCollection.findOne({
    site_content_id: siteContentId,
  });

  if (existing) {
    throw new Error("Products section already exists");
  }

  // Generate section ID
  const lastSection = await sectionCollection
    .find({})
    .sort({ id: -1 })
    .limit(1)
    .next();

  const sectionId = (lastSection?.id || 0) + 1;

  // Create products section
  await sectionCollection.insertOne({
    id: sectionId,
    title: productsContent.title,
    years_number: productsContent.yearsNumber,
    years_text: productsContent.yearsText,
    years_description: productsContent.yearsDescription,
    background_image: productsContent.backgroundImage,
    site_content_id: siteContentId,
  });

  // Create products
  if (
    Array.isArray(productsContent.products) &&
    productsContent.products.length > 0
  ) {
    const lastProduct = await productsCollection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .next();

    let nextProductId = (lastProduct?.id || 0) + 1;

    const products = productsContent.products.map((product, index) => ({
      id: nextProductId++,
      section_id: sectionId,
      name: product.name,
      image: product.image,
      description: product.description,
      sort_order: product.sortOrder ?? index,
    }));

    await productsCollection.insertMany(products);
  }

  return getProducts(siteContentId);
};


// UPDATE PRODUCTS
const updateProducts = async (siteContentId, productsContent) => {
  if (!productsContent) {
    throw new Error("Products data is required");
  }

  const db = getDB();

  const sectionCollection = db.collection("products_section");
  const productsCollection = db.collection("products");

  // Check existing section
  const existing = await sectionCollection.findOne({
    site_content_id: siteContentId,
  });

  if (!existing) {
    throw new Error("Products section not found");
  }

  const sectionId = existing.id;

  // Update products section
  await sectionCollection.updateOne(
    { id: sectionId },
    {
      $set: {
        title: productsContent.title,
        years_number: productsContent.yearsNumber,
        years_text: productsContent.yearsText,
        years_description: productsContent.yearsDescription,
        background_image: productsContent.backgroundImage,
      },
    }
  );

  // Delete old products
  await productsCollection.deleteMany({
    section_id: sectionId,
  });

  // Insert current products
  if (
    Array.isArray(productsContent.products) &&
    productsContent.products.length > 0
  ) {
    const lastProduct = await productsCollection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .next();

    let nextProductId = (lastProduct?.id || 0) + 1;

    const products = productsContent.products.map((product, index) => ({
      id: nextProductId++,
      section_id: sectionId,
      name: product.name,
      image: product.image,
      description: product.description,
      sort_order: product.sortOrder ?? index,
    }));

    await productsCollection.insertMany(products);
  }

  return getProducts(siteContentId);
};


// DELETE PRODUCTS
const deleteProducts = async (siteContentId) => {
  const db = getDB();

  const sectionCollection = db.collection("products_section");
  const productsCollection = db.collection("products");

  // Check existing section
  const existing = await sectionCollection.findOne({
    site_content_id: siteContentId,
  });

  if (!existing) {
    throw new Error("Products section not found");
  }

  const sectionId = existing.id;

  // Delete products first
  await productsCollection.deleteMany({
    section_id: sectionId,
  });

  // Delete products section
  const result = await sectionCollection.deleteOne({
    site_content_id: siteContentId,
  });

  if (result.deletedCount === 0) {
    throw new Error("Products section not found");
  }

  return true;
};


// EXPORT
module.exports = {
  getProducts,
  createProducts,
  updateProducts,
  deleteProducts,
};
