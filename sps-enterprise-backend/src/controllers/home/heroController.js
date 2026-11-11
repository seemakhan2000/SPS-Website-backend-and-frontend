
const { getDB } = require("../../config/db");

// GET HERO SLIDES
const getHeroSlides = async (siteContentId) => {
  const db = getDB();

  const heroRows = await db
    .collection("hero_slides")
    .find({ site_content_id: siteContentId })
    .sort({ id: 1 })
    .toArray();

  return heroRows.map((slide) => ({
    id: slide.id,
    video: slide.video,
    title: slide.title,
    subtitle: slide.subtitle,

    description:
      typeof slide.description === "string"
        ? (() => {
            try {
              return JSON.parse(slide.description);
            } catch {
              return slide.description;
            }
          })()
        : slide.description,

    buttonText: slide.button_text,
    buttonLink: slide.button_link,
    isList: Boolean(slide.is_list),
    siteContentId: slide.site_content_id,
  }));
};


// CREATE HERO SLIDES
const createHeroSlides = async (siteContentId, heroSlides) => {
  if (!Array.isArray(heroSlides)) {
    throw new Error("Hero slides data is required");
  }

  const db = getDB();
  const collection = db.collection("hero_slides");

  const existing = await collection.findOne({
    site_content_id: siteContentId,
  });

  if (existing) {
    throw new Error("Hero slides already exist");
  }

  if (heroSlides.length === 0) {
    return [];
  }

  // Generate IDs while preserving existing numeric IDs
  const lastRecord = await collection
    .find({})
    .sort({ id: -1 })
    .limit(1)
    .next();

  let nextId = (lastRecord?.id || 0) + 1;

  const documents = heroSlides.map((slide) => ({
    id: nextId++,
    video: slide.video,
    title: slide.title,
    subtitle: slide.subtitle,
    description: slide.description,
    button_text: slide.buttonText,
    button_link: slide.buttonLink,
    is_list: Boolean(slide.isList),
    site_content_id: siteContentId,
  }));

  await collection.insertMany(documents);

  return getHeroSlides(siteContentId);
};


// UPDATE HERO SLIDES
const updateHeroSlides = async (siteContentId, heroSlides) => {
  if (!Array.isArray(heroSlides)) {
    throw new Error("Hero slides data is required");
  }

  const db = getDB();
  const collection = db.collection("hero_slides");

  const existingRows = await collection
    .find({ site_content_id: siteContentId })
    .toArray();

  if (existingRows.length === 0) {
    throw new Error("Hero slides not found");
  }

  // Validate all slide IDs before updating
  for (const slide of heroSlides) {
    if (!slide.id) {
      throw new Error("Hero slide ID is required");
    }

    const existingSlide = existingRows.find(
      (item) => item.id === slide.id
    );

    if (!existingSlide) {
      throw new Error(
        `Hero slide with ID ${slide.id} not found`
      );
    }
  }

  // Update each slide
  for (const slide of heroSlides) {
    await collection.updateOne(
      {
        id: slide.id,
        site_content_id: siteContentId,
      },
      {
        $set: {
          video: slide.video,
          title: slide.title,
          subtitle: slide.subtitle,
          description: slide.description,
          button_text: slide.buttonText,
          button_link: slide.buttonLink,
          is_list: Boolean(slide.isList),
        },
      }
    );
  }

  return getHeroSlides(siteContentId);
};


// DELETE HERO SLIDES
const deleteHeroSlides = async (siteContentId) => {
  const db = getDB();
  const collection = db.collection("hero_slides");

  const existing = await collection.findOne({
    site_content_id: siteContentId,
  });

  if (!existing) {
    throw new Error("Hero slides not found");
  }

  const result = await collection.deleteMany({
    site_content_id: siteContentId,
  });

  if (result.deletedCount === 0) {
    throw new Error("Hero slides not found");
  }

  return true;
};


// EXPORT
module.exports = {
  getHeroSlides,
  createHeroSlides,
  updateHeroSlides,
  deleteHeroSlides,
};
