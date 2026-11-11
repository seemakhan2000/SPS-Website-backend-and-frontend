
const { getDB } = require("../../config/db");

// GET CUSTOMERS
const getCustomers = async (siteContentId) => {
  const db = getDB();

  const section = await db.collection("customers_section").findOne({
    site_content_id: siteContentId,
  });

  if (!section) {
    return null;
  }

  // Get testimonial
  const testimonialRecord = await db
    .collection("customer_testimonial")
    .findOne({ section_id: section.id });

  const testimonial = testimonialRecord
    ? {
        id: testimonialRecord.id,
        name: testimonialRecord.name,
        rating: Number(testimonialRecord.rating),
        message: testimonialRecord.message,
        image: testimonialRecord.image,
      }
    : null;

  // Get deployment avatars
  const avatarRows = await db
    .collection("customer_deployment_avatars")
    .find({ section_id: section.id })
    .sort({ sort_order: 1, id: 1 })
    .toArray();

  // Get impact
  const impactRecord = await db
    .collection("customer_impact")
    .findOne({ section_id: section.id });

  const impact = impactRecord
    ? {
        id: impactRecord.id,
        name: impactRecord.name,
        role: impactRecord.role,
        title: impactRecord.title,
        description: impactRecord.description,
        image: impactRecord.image,
      }
    : null;

  return {
    id: section.id,
    siteContentId: section.site_content_id,
    headingLine1: section.heading_line1,
    headingLine2: section.heading_line2,
    headingLine3: section.heading_line3,
    mainImage: section.main_image,

    testimonial,

    deployment: {
      number: section.deployment_number,
      text: section.deployment_text,
      avatars: avatarRows.map((avatar) => ({
        id: avatar.id,
        image: avatar.image,
        sortOrder: avatar.sort_order,
      })),
    },

    impact,
  };
};


// CREATE CUSTOMERS
const createCustomers = async (siteContentId, customersContent) => {
  if (!customersContent) {
    throw new Error("Customers data is required");
  }

  const db = getDB();

  const sectionCollection = db.collection("customers_section");
  const testimonialCollection = db.collection("customer_testimonial");
  const avatarCollection = db.collection("customer_deployment_avatars");
  const impactCollection = db.collection("customer_impact");

  // Check existing section
  const existing = await sectionCollection.findOne({
    site_content_id: siteContentId,
  });

  if (existing) {
    throw new Error("Customers section already exists");
  }

  // Generate section ID
  const lastSection = await sectionCollection
    .find({})
    .sort({ id: -1 })
    .limit(1)
    .next();

  const sectionId = (lastSection?.id || 0) + 1;

  // Save customer section
  await sectionCollection.insertOne({
    id: sectionId,
    site_content_id: siteContentId,
    heading_line1: customersContent.headingLine1,
    heading_line2: customersContent.headingLine2,
    heading_line3: customersContent.headingLine3,
    main_image: customersContent.mainImage,
    deployment_number: customersContent.deployment?.number,
    deployment_text: customersContent.deployment?.text,
  });

  // Save testimonial
  if (customersContent.testimonial) {
    const lastTestimonial = await testimonialCollection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .next();

    const testimonialId = (lastTestimonial?.id || 0) + 1;

    await testimonialCollection.insertOne({
      id: testimonialId,
      section_id: sectionId,
      name: customersContent.testimonial.name,
      rating: customersContent.testimonial.rating,
      message: customersContent.testimonial.message,
      image: customersContent.testimonial.image,
    });
  }

  // Save deployment avatars
  if (
    Array.isArray(customersContent.deployment?.avatars) &&
    customersContent.deployment.avatars.length > 0
  ) {
    const lastAvatar = await avatarCollection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .next();

    let nextAvatarId = (lastAvatar?.id || 0) + 1;

    const avatars = customersContent.deployment.avatars.map(
      (avatar, index) => ({
        id: nextAvatarId++,
        section_id: sectionId,
        image: avatar.image,
        sort_order: avatar.sortOrder ?? index,
      })
    );

    await avatarCollection.insertMany(avatars);
  }

  // Save impact
  if (customersContent.impact) {
    const lastImpact = await impactCollection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .next();

    const impactId = (lastImpact?.id || 0) + 1;

    await impactCollection.insertOne({
      id: impactId,
      section_id: sectionId,
      name: customersContent.impact.name,
      role: customersContent.impact.role,
      title: customersContent.impact.title,
      description: customersContent.impact.description,
      image: customersContent.impact.image,
    });
  }

  return getCustomers(siteContentId);
};


// UPDATE CUSTOMERS
const updateCustomers = async (siteContentId, customersContent) => {
  if (!customersContent) {
    throw new Error("Customers data is required");
  }

  const db = getDB();

  const sectionCollection = db.collection("customers_section");
  const testimonialCollection = db.collection("customer_testimonial");
  const avatarCollection = db.collection("customer_deployment_avatars");
  const impactCollection = db.collection("customer_impact");

  const existing = await sectionCollection.findOne({
    site_content_id: siteContentId,
  });

  if (!existing) {
    throw new Error("Customers section not found");
  }

  const sectionId = existing.id;

  // Update customer section
  await sectionCollection.updateOne(
    { id: sectionId },
    {
      $set: {
        heading_line1: customersContent.headingLine1,
        heading_line2: customersContent.headingLine2,
        heading_line3: customersContent.headingLine3,
        main_image: customersContent.mainImage,
        deployment_number: customersContent.deployment?.number,
        deployment_text: customersContent.deployment?.text,
      },
    }
  );

  // Update testimonial
  if (customersContent.testimonial) {
    const testimonial = await testimonialCollection.findOne({
      section_id: sectionId,
    });

    if (testimonial) {
      await testimonialCollection.updateOne(
        { id: testimonial.id },
        {
          $set: {
            name: customersContent.testimonial.name,
            rating: customersContent.testimonial.rating,
            message: customersContent.testimonial.message,
            image: customersContent.testimonial.image,
          },
        }
      );
    } else {
      const lastTestimonial = await testimonialCollection
        .find({})
        .sort({ id: -1 })
        .limit(1)
        .next();

      await testimonialCollection.insertOne({
        id: (lastTestimonial?.id || 0) + 1,
        section_id: sectionId,
        name: customersContent.testimonial.name,
        rating: customersContent.testimonial.rating,
        message: customersContent.testimonial.message,
        image: customersContent.testimonial.image,
      });
    }
  }

  // Replace deployment avatars
  await avatarCollection.deleteMany({
    section_id: sectionId,
  });

  if (
    Array.isArray(customersContent.deployment?.avatars) &&
    customersContent.deployment.avatars.length > 0
  ) {
    const lastAvatar = await avatarCollection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .next();

    let nextAvatarId = (lastAvatar?.id || 0) + 1;

    const avatars = customersContent.deployment.avatars.map(
      (avatar, index) => ({
        id: nextAvatarId++,
        section_id: sectionId,
        image: avatar.image,
        sort_order: avatar.sortOrder ?? index,
      })
    );

    await avatarCollection.insertMany(avatars);
  }

  // Update impact
  if (customersContent.impact) {
    const impact = await impactCollection.findOne({
      section_id: sectionId,
    });

    if (impact) {
      await impactCollection.updateOne(
        { id: impact.id },
        {
          $set: {
            name: customersContent.impact.name,
            role: customersContent.impact.role,
            title: customersContent.impact.title,
            description: customersContent.impact.description,
            image: customersContent.impact.image,
          },
        }
      );
    } else {
      const lastImpact = await impactCollection
        .find({})
        .sort({ id: -1 })
        .limit(1)
        .next();

      await impactCollection.insertOne({
        id: (lastImpact?.id || 0) + 1,
        section_id: sectionId,
        name: customersContent.impact.name,
        role: customersContent.impact.role,
        title: customersContent.impact.title,
        description: customersContent.impact.description,
        image: customersContent.impact.image,
      });
    }
  }

  return getCustomers(siteContentId);
};


// DELETE CUSTOMERS
const deleteCustomers = async (siteContentId) => {
  const db = getDB();

  const sectionCollection = db.collection("customers_section");
  const testimonialCollection = db.collection("customer_testimonial");
  const avatarCollection = db.collection("customer_deployment_avatars");
  const impactCollection = db.collection("customer_impact");

  const existing = await sectionCollection.findOne({
    site_content_id: siteContentId,
  });

  if (!existing) {
    throw new Error("Customers section not found");
  }

  const sectionId = existing.id;

  // Delete related records
  await testimonialCollection.deleteMany({
    section_id: sectionId,
  });

  await avatarCollection.deleteMany({
    section_id: sectionId,
  });

  await impactCollection.deleteMany({
    section_id: sectionId,
  });

  // Delete customer section
  const result = await sectionCollection.deleteOne({
    id: sectionId,
  });

  if (result.deletedCount === 0) {
    throw new Error("Customers section not found");
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
