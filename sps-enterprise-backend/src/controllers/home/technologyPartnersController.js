
const { getDB } = require("../../config/db");

// GET TECHNOLOGY PARTNERS
const getTechnologyPartners = async (siteContentId) => {
  const db = getDB();

  const section = await db.collection("technology_partners").findOne({
    site_content_id: siteContentId,
  });

  if (!section) {
    return null;
  }

  // Get partner items
  const partnerRows = await db
    .collection("technology_partner_items")
    .find({ technology_partners_id: section.id })
    .sort({ sort_order: 1, id: 1 })
    .toArray();

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
  technologyPartners
) => {
  if (!technologyPartners) {
    throw new Error("Technology Partners data is required");
  }

  const db = getDB();

  const sectionCollection = db.collection("technology_partners");
  const itemsCollection = db.collection("technology_partner_items");

  // Check existing section
  const existing = await sectionCollection.findOne({
    site_content_id: siteContentId,
  });

  if (existing) {
    throw new Error("Technology Partners already exists");
  }

  // Generate section ID
  const lastSection = await sectionCollection
    .find({})
    .sort({ id: -1 })
    .limit(1)
    .next();

  const technologyPartnersId = (lastSection?.id || 0) + 1;

  // Create main section
  await sectionCollection.insertOne({
    id: technologyPartnersId,
    site_content_id: siteContentId,
    title: technologyPartners.title,
    description: technologyPartners.description,
  });

  // Create partner items
  if (
    Array.isArray(technologyPartners.partners) &&
    technologyPartners.partners.length > 0
  ) {
    const lastPartner = await itemsCollection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .next();

    let nextPartnerId = (lastPartner?.id || 0) + 1;

    const partners = technologyPartners.partners.map((partner, index) => ({
      id: nextPartnerId++,
      technology_partners_id: technologyPartnersId,
      name: partner.name,
      tagline: partner.tagline,
      image: partner.image,
      href: partner.href,
      sort_order: partner.sortOrder ?? index,
    }));

    await itemsCollection.insertMany(partners);
  }

  return getTechnologyPartners(siteContentId);
};


// UPDATE TECHNOLOGY PARTNERS
const updateTechnologyPartners = async (
  siteContentId,
  technologyPartners
) => {
  if (!technologyPartners) {
    throw new Error("Technology Partners data is required");
  }

  const db = getDB();

  const sectionCollection = db.collection("technology_partners");
  const itemsCollection = db.collection("technology_partner_items");

  // Check existing section
  const existing = await sectionCollection.findOne({
    site_content_id: siteContentId,
  });

  if (!existing) {
    throw new Error("Technology Partners record not found");
  }

  const technologyPartnersId = existing.id;

  // Update main section
  await sectionCollection.updateOne(
    { id: technologyPartnersId },
    {
      $set: {
        title: technologyPartners.title,
        description: technologyPartners.description,
      },
    }
  );

  // Delete old partner items
  await itemsCollection.deleteMany({
    technology_partners_id: technologyPartnersId,
  });

  // Insert current partner items
  if (
    Array.isArray(technologyPartners.partners) &&
    technologyPartners.partners.length > 0
  ) {
    const lastPartner = await itemsCollection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .next();

    let nextPartnerId = (lastPartner?.id || 0) + 1;

    const partners = technologyPartners.partners.map((partner, index) => ({
      id: nextPartnerId++,
      technology_partners_id: technologyPartnersId,
      name: partner.name,
      tagline: partner.tagline,
      image: partner.image,
      href: partner.href,
      sort_order: partner.sortOrder ?? index,
    }));

    await itemsCollection.insertMany(partners);
  }

  return getTechnologyPartners(siteContentId);
};


// DELETE TECHNOLOGY PARTNERS
const deleteTechnologyPartners = async (siteContentId) => {
  const db = getDB();

  const sectionCollection = db.collection("technology_partners");
  const itemsCollection = db.collection("technology_partner_items");

  // Check existing section
  const existing = await sectionCollection.findOne({
    site_content_id: siteContentId,
  });

  if (!existing) {
    throw new Error("Technology Partners record not found");
  }

  const technologyPartnersId = existing.id;

  // Delete related partner items first
  await itemsCollection.deleteMany({
    technology_partners_id: technologyPartnersId,
  });

  // Delete main section
  const result = await sectionCollection.deleteOne({
    site_content_id: siteContentId,
  });

  if (result.deletedCount === 0) {
    throw new Error("Technology Partners record not found");
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
