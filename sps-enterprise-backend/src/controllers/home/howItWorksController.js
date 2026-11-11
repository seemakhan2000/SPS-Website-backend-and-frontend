
const { getDB } = require("../../config/db");

// GET HOW IT WORKS
const getHowItWorks = async (siteContentId) => {
  const db = getDB();

  const howItWorks = await db.collection("how_it_works").findOne({
    site_content_id: siteContentId,
  });

  if (!howItWorks) {
    return null;
  }

  // Get steps
  const stepRows = await db
    .collection("how_it_works_steps")
    .find({ how_it_works_id: howItWorks.id })
    .sort({ sort_order: 1, id: 1 })
    .toArray();

  return {
    id: howItWorks.id,
    heading: howItWorks.heading,
    description: howItWorks.description,

    steps: stepRows.map((step) => ({
      id: step.id,
      icon: step.icon,
      title: step.title,
      sortOrder: step.sort_order,
    })),

    image: howItWorks.image,
    buttonText: howItWorks.button_text,
    buttonLink: howItWorks.button_link,
    specialistsNumber: howItWorks.specialists_number,
    specialistsText: howItWorks.specialists_text,
    clientsNumber: howItWorks.clients_number,
    clientsText: howItWorks.clients_text,
    siteContentId: howItWorks.site_content_id,
  };
};


// CREATE HOW IT WORKS
const createHowItWorks = async (siteContentId, howItWorks) => {
  if (!howItWorks) {
    throw new Error("How It Works data is required");
  }

  const db = getDB();

  const mainCollection = db.collection("how_it_works");
  const stepsCollection = db.collection("how_it_works_steps");

  // Check existing record
  const existing = await mainCollection.findOne({
    site_content_id: siteContentId,
  });

  if (existing) {
    throw new Error("How It Works already exists");
  }

  // Generate main record ID
  const lastRecord = await mainCollection
    .find({})
    .sort({ id: -1 })
    .limit(1)
    .next();

  const howItWorksId = (lastRecord?.id || 0) + 1;

  // Insert main record
  await mainCollection.insertOne({
    id: howItWorksId,
    heading: howItWorks.heading,
    description: howItWorks.description,
    image: howItWorks.image,
    button_text: howItWorks.buttonText,
    button_link: howItWorks.buttonLink,
    specialists_number: howItWorks.specialistsNumber,
    specialists_text: howItWorks.specialistsText,
    clients_number: howItWorks.clientsNumber,
    clients_text: howItWorks.clientsText,
    site_content_id: siteContentId,
  });

  // Insert steps
  if (Array.isArray(howItWorks.steps) && howItWorks.steps.length > 0) {
    const lastStep = await stepsCollection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .next();

    let nextStepId = (lastStep?.id || 0) + 1;

    const steps = howItWorks.steps.map((step, index) => ({
      id: nextStepId++,
      how_it_works_id: howItWorksId,
      icon: step.icon,
      title: step.title,
      sort_order: step.sortOrder ?? index,
    }));

    await stepsCollection.insertMany(steps);
  }

  return getHowItWorks(siteContentId);
};


// UPDATE HOW IT WORKS
const updateHowItWorks = async (siteContentId, howItWorks) => {
  if (!howItWorks) {
    throw new Error("How It Works data is required");
  }

  const db = getDB();

  const mainCollection = db.collection("how_it_works");
  const stepsCollection = db.collection("how_it_works_steps");

  const existing = await mainCollection.findOne({
    site_content_id: siteContentId,
  });

  if (!existing) {
    throw new Error("How It Works record not found");
  }

  const howItWorksId = existing.id;

  // Update main record
  await mainCollection.updateOne(
    { id: howItWorksId },
    {
      $set: {
        heading: howItWorks.heading,
        description: howItWorks.description,
        image: howItWorks.image,
        button_text: howItWorks.buttonText,
        button_link: howItWorks.buttonLink,
        specialists_number: howItWorks.specialistsNumber,
        specialists_text: howItWorks.specialistsText,
        clients_number: howItWorks.clientsNumber,
        clients_text: howItWorks.clientsText,
      },
    }
  );

  // Remove existing steps
  await stepsCollection.deleteMany({
    how_it_works_id: howItWorksId,
  });

  // Insert updated steps
  if (Array.isArray(howItWorks.steps) && howItWorks.steps.length > 0) {
    const lastStep = await stepsCollection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .next();

    let nextStepId = (lastStep?.id || 0) + 1;

    const steps = howItWorks.steps.map((step, index) => ({
      id: nextStepId++,
      how_it_works_id: howItWorksId,
      icon: step.icon,
      title: step.title,
      sort_order: step.sortOrder ?? index,
    }));

    await stepsCollection.insertMany(steps);
  }

  return getHowItWorks(siteContentId);
};


// DELETE HOW IT WORKS
const deleteHowItWorks = async (siteContentId) => {
  const db = getDB();

  const mainCollection = db.collection("how_it_works");
  const stepsCollection = db.collection("how_it_works_steps");

  const existing = await mainCollection.findOne({
    site_content_id: siteContentId,
  });

  if (!existing) {
    throw new Error("How It Works record not found");
  }

  const howItWorksId = existing.id;

  // Delete related steps first
  await stepsCollection.deleteMany({
    how_it_works_id: howItWorksId,
  });

  // Delete main record
  const result = await mainCollection.deleteOne({
    site_content_id: siteContentId,
  });

  if (result.deletedCount === 0) {
    throw new Error("How It Works record not found");
  }

  return true;
};


// EXPORT
module.exports = {
  getHowItWorks,
  createHowItWorks,
  updateHowItWorks,
  deleteHowItWorks,
};
