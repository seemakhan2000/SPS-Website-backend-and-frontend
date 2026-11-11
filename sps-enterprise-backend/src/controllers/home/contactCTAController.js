
const { getDB } = require("../../config/db");

// GET CONTACT CTA
const getContactCTA = async (siteContentId) => {
  const db = getDB();

  const cta = await db.collection("contact_cta").findOne({
    site_content_id: siteContentId,
  });

  if (!cta) {
    return null;
  }

  const serviceRows = await db
    .collection("contact_cta_services")
    .find({ contact_cta_id: cta.id })
    .sort({ sort_order: 1, id: 1 })
    .toArray();

  return {
    id: cta.id,
    siteContentId: cta.site_content_id,
    sideLabel: cta.side_label,
    titleLine1: cta.title_line1,
    highlightedTitle: cta.highlighted_title,
    titleLine2: cta.title_line2,
    titleLine3: cta.title_line3,
    nameLabel: cta.name_label,
    emailLabel: cta.email_label,
    phoneLabel: cta.phone_label,
    serviceLabel: cta.service_label,
    messageLabel: cta.message_label,
    buttonText: cta.button_text,
    image: cta.image,

    services: serviceRows.map((service) => ({
      id: service.id,
      name: service.name,
      sortOrder: service.sort_order,
    })),
  };
};


// CREATE CONTACT CTA
const createContactCTA = async (siteContentId, contactCTAContent) => {
  if (!contactCTAContent) {
    throw new Error("Contact CTA data is required");
  }

  const db = getDB();

  const ctaCollection = db.collection("contact_cta");
  const servicesCollection = db.collection("contact_cta_services");

  const existing = await ctaCollection.findOne({
    site_content_id: siteContentId,
  });

  if (existing) {
    throw new Error("Contact CTA already exists");
  }

  const lastRecord = await ctaCollection
    .find({})
    .sort({ id: -1 })
    .limit(1)
    .next();

  const newId = (lastRecord?.id || 0) + 1;

  await ctaCollection.insertOne({
    id: newId,
    site_content_id: siteContentId,
    side_label: contactCTAContent.sideLabel,
    title_line1: contactCTAContent.titleLine1,
    highlighted_title: contactCTAContent.highlightedTitle,
    title_line2: contactCTAContent.titleLine2,
    title_line3: contactCTAContent.titleLine3,
    name_label: contactCTAContent.nameLabel,
    email_label: contactCTAContent.emailLabel,
    phone_label: contactCTAContent.phoneLabel,
    service_label: contactCTAContent.serviceLabel,
    message_label: contactCTAContent.messageLabel,
    button_text: contactCTAContent.buttonText,
    image: contactCTAContent.image ?? null,
  });

  if (
    Array.isArray(contactCTAContent.services) &&
    contactCTAContent.services.length > 0
  ) {
    const lastService = await servicesCollection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .next();

    let nextServiceId = (lastService?.id || 0) + 1;

    const services = contactCTAContent.services.map((service, index) => ({
      id: nextServiceId++,
      contact_cta_id: newId,
      name: service.name,
      sort_order: service.sortOrder ?? index,
    }));

    await servicesCollection.insertMany(services);
  }

  return getContactCTA(siteContentId);
};


// UPDATE CONTACT CTA
const updateContactCTA = async (siteContentId, contactCTAContent) => {
  if (!contactCTAContent) {
    throw new Error("Contact CTA data is required");
  }

  const db = getDB();

  const ctaCollection = db.collection("contact_cta");
  const servicesCollection = db.collection("contact_cta_services");

  const existing = await ctaCollection.findOne({
    site_content_id: siteContentId,
  });

  if (!existing) {
    throw new Error("Contact CTA record not found");
  }

  await ctaCollection.updateOne(
    { id: existing.id },
    {
      $set: {
        side_label: contactCTAContent.sideLabel,
        title_line1: contactCTAContent.titleLine1,
        highlighted_title: contactCTAContent.highlightedTitle,
        title_line2: contactCTAContent.titleLine2,
        title_line3: contactCTAContent.titleLine3,
        name_label: contactCTAContent.nameLabel,
        email_label: contactCTAContent.emailLabel,
        phone_label: contactCTAContent.phoneLabel,
        service_label: contactCTAContent.serviceLabel,
        message_label: contactCTAContent.messageLabel,
        button_text: contactCTAContent.buttonText,
        image: contactCTAContent.image ?? null,
      },
    }
  );

  // Delete old services
  await servicesCollection.deleteMany({
    contact_cta_id: existing.id,
  });

  // Insert updated services
  if (
    Array.isArray(contactCTAContent.services) &&
    contactCTAContent.services.length > 0
  ) {
    const lastService = await servicesCollection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .next();

    let nextServiceId = (lastService?.id || 0) + 1;

    const services = contactCTAContent.services.map((service, index) => ({
      id: nextServiceId++,
      contact_cta_id: existing.id,
      name: service.name,
      sort_order: service.sortOrder ?? index,
    }));

    await servicesCollection.insertMany(services);
  }

  return getContactCTA(siteContentId);
};


// DELETE CONTACT CTA
const deleteContactCTA = async (siteContentId) => {
  const db = getDB();

  const ctaCollection = db.collection("contact_cta");
  const servicesCollection = db.collection("contact_cta_services");

  const existing = await ctaCollection.findOne({
    site_content_id: siteContentId,
  });

  if (!existing) {
    throw new Error("Contact CTA record not found");
  }

  // Delete associated services first
  await servicesCollection.deleteMany({
    contact_cta_id: existing.id,
  });

  const result = await ctaCollection.deleteOne({
    id: existing.id,
  });

  if (result.deletedCount === 0) {
    throw new Error("Contact CTA record not found");
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
