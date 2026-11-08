const { pool } = require("../../config/db");


// GET HERO SLIDES
const getHeroSlides = async (
  siteContentId,
  db = pool
) => {
  const [heroRows] = await db.query(
    `
    SELECT
      id,
      video,
      title,
      subtitle,
      description,
      button_text,
      button_link,
      is_list,
      site_content_id
    FROM hero_slides
    WHERE site_content_id = ?
    ORDER BY id ASC
    `,
    [siteContentId]
  );

  return heroRows.map((slide) => ({
    id: slide.id,

    video: slide.video,

    title: slide.title,

    subtitle: slide.subtitle,

    description:
      typeof slide.description === "string"
        ? JSON.parse(slide.description)
        : slide.description,

    buttonText: slide.button_text,

    buttonLink: slide.button_link,

    isList: Boolean(slide.is_list),

    siteContentId:
      slide.site_content_id,
  }));
};


// CREATE HERO SLIDES
const createHeroSlides = async (
  siteContentId,
  heroSlides,
  db = pool
) => {
  if (!Array.isArray(heroSlides)) {
    throw new Error(
      "Hero slides data is required"
    );
  }


  // Check if hero slides already exist
  const [existingRows] = await db.query(
    `
    SELECT
      id
    FROM hero_slides
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length > 0) {
    throw new Error(
      "Hero slides already exist"
    );
  }


  // Insert hero slides
  for (const slide of heroSlides) {
    await db.query(
      `
      INSERT INTO hero_slides
      (
        video,
        title,
        subtitle,
        description,
        button_text,
        button_link,
        is_list,
        site_content_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        slide.video,
        slide.title,
        slide.subtitle,
        JSON.stringify(slide.description),
        slide.buttonText,
        slide.buttonLink,
        Boolean(slide.isList),
        siteContentId,
      ]
    );
  }


  // Return created DB data
  return getHeroSlides(
    siteContentId,
    db
  );
};

// UPDATE HERO SLIDES
const updateHeroSlides = async (
  siteContentId,
  heroSlides,
  db = pool
) => {
  if (!Array.isArray(heroSlides)) {
    throw new Error("Hero slides data is required");
  }

  const [existingRows] = await db.query(
    `
    SELECT id
    FROM hero_slides
    WHERE site_content_id = ?
    `,
    [siteContentId]
  );

  if (existingRows.length === 0) {
    throw new Error("Hero slides not found");
  }

  for (const slide of heroSlides) {
    if (!slide.id) {
      throw new Error("Hero slide ID is required");
    }

    const [result] = await db.query(
      `
      UPDATE hero_slides
      SET
        video = ?,
        title = ?,
        subtitle = ?,
        description = ?,
        button_text = ?,
        button_link = ?,
        is_list = ?
      WHERE id = ?
        AND site_content_id = ?
      `,
      [
        slide.video,
        slide.title,
        slide.subtitle,
        JSON.stringify(slide.description),
        slide.buttonText,
        slide.buttonLink,
        Boolean(slide.isList),
        slide.id,
        siteContentId,
      ]
    );

    if (result.affectedRows === 0) {
      throw new Error(
        `Hero slide with ID ${slide.id} not found`
      );
    }
  }

  return getHeroSlides(siteContentId, db);
};

// DELETE HERO SLIDES
const deleteHeroSlides = async (
  siteContentId,
  db = pool
) => {

  // Check existing hero slides
  const [existingRows] = await db.query(
    `
    SELECT
      id
    FROM hero_slides
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length === 0) {
    throw new Error(
      "Hero slides not found"
    );
  }


  // Delete all hero slides
  const [result] = await db.query(
    `
    DELETE FROM hero_slides
    WHERE site_content_id = ?
    `,
    [siteContentId]
  );

  if (result.affectedRows === 0) {
    throw new Error(
      "Hero slides not found"
    );
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