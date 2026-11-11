
const { getDB } = require("../../config/db");

// GET CLIENTS MARQUEE
const getClientsMarquee = async (siteContentId) => {
  const db = getDB();

  const marquee = await db.collection("clients_marquee").findOne({
    site_content_id: siteContentId,
  });

  if (!marquee) {
    return null;
  }

  const clientRows = await db
    .collection("client_logos")
    .find({ clients_marquee_id: marquee.id })
    .sort({ sort_order: 1, id: 1 })
    .toArray();

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
const createClientsMarquee = async (siteContentId, clientsMarquee) => {
  if (!clientsMarquee) {
    throw new Error("Clients Marquee data is required");
  }

  const db = getDB();
  const marqueeCollection = db.collection("clients_marquee");
  const logosCollection = db.collection("client_logos");

  const existing = await marqueeCollection.findOne({
    site_content_id: siteContentId,
  });

  if (existing) {
    throw new Error("Clients Marquee already exists");
  }

  const lastRecord = await marqueeCollection
    .find({})
    .sort({ id: -1 })
    .limit(1)
    .next();

  const newId = (lastRecord?.id || 0) + 1;

  const newMarquee = {
    id: newId,
    title: clientsMarquee.title,
    site_content_id: siteContentId,
  };

  await marqueeCollection.insertOne(newMarquee);

  if (
    Array.isArray(clientsMarquee.clients) &&
    clientsMarquee.clients.length > 0
  ) {
    const lastLogo = await logosCollection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .next();

    let nextLogoId = (lastLogo?.id || 0) + 1;

    const logos = clientsMarquee.clients.map((client, index) => ({
      id: nextLogoId++,
      clients_marquee_id: newId,
      name: client.name,
      logo: client.logo,
      alt: client.alt,
      sort_order: client.sortOrder ?? index,
    }));

    await logosCollection.insertMany(logos);
  }

  return getClientsMarquee(siteContentId);
};


// UPDATE CLIENTS MARQUEE
const updateClientsMarquee = async (siteContentId, clientsMarquee) => {
  if (!clientsMarquee) {
    throw new Error("Clients Marquee data is required");
  }

  const db = getDB();
  const marqueeCollection = db.collection("clients_marquee");
  const logosCollection = db.collection("client_logos");

  const existing = await marqueeCollection.findOne({
    site_content_id: siteContentId,
  });

  if (!existing) {
    throw new Error("Clients Marquee record not found");
  }

  await marqueeCollection.updateOne(
    { id: existing.id },
    {
      $set: {
        title: clientsMarquee.title,
      },
    }
  );

  // Remove old logos
  await logosCollection.deleteMany({
    clients_marquee_id: existing.id,
  });

  // Insert updated logos
  if (
    Array.isArray(clientsMarquee.clients) &&
    clientsMarquee.clients.length > 0
  ) {
    const lastLogo = await logosCollection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .next();

    let nextLogoId = (lastLogo?.id || 0) + 1;

    const logos = clientsMarquee.clients.map((client, index) => ({
      id: nextLogoId++,
      clients_marquee_id: existing.id,
      name: client.name,
      logo: client.logo,
      alt: client.alt,
      sort_order: client.sortOrder ?? index,
    }));

    await logosCollection.insertMany(logos);
  }

  return getClientsMarquee(siteContentId);
};


// DELETE CLIENTS MARQUEE
const deleteClientsMarquee = async (siteContentId) => {
  const db = getDB();

  const marqueeCollection = db.collection("clients_marquee");
  const logosCollection = db.collection("client_logos");

  const existing = await marqueeCollection.findOne({
    site_content_id: siteContentId,
  });

  if (!existing) {
    throw new Error("Clients Marquee record not found");
  }

  // Delete associated logos first
  await logosCollection.deleteMany({
    clients_marquee_id: existing.id,
  });

  const result = await marqueeCollection.deleteOne({
    id: existing.id,
  });

  if (result.deletedCount === 0) {
    throw new Error("Clients Marquee record not found");
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
