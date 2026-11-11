
const { getDB } = require("../../config/db");


// GET VERTICALS OVERVIEW
const getVerticalsOverview = async (siteContentId) => {
  const db = getDB();

  // Get parent section
  const section = await db.collection("verticals_overview").findOne(
    { site_content_id: Number(siteContentId) },
    { sort: { id: 1 } }
  );

  if (!section) {
    return null;
  }

  // Get verticals
  const verticalRows = await db.collection("verticals")
    .find({ verticals_overview_id: section.id })
    .sort({ sort_order: 1, id: 1 })
    .toArray();

  // Get tags for all verticals
  const verticalIds = verticalRows.map((vertical) => vertical.id);

  const tagRows = verticalIds.length
    ? await db.collection("vertical_tags")
        .find({ vertical_id: { $in: verticalIds } })
        .sort({ vertical_id: 1, sort_order: 1, id: 1 })
        .toArray()
    : [];

  // Create tags map
  const tagsMap = {};

  for (const row of tagRows) {
    if (!tagsMap[row.vertical_id]) {
      tagsMap[row.vertical_id] = [];
    }

    tagsMap[row.vertical_id].push(row.tag);
  }

  // Return frontend structure
  return {
    label: section.label,
    titleLine1: section.title_line1,
    titleLine2: section.title_line2,

    verticals: verticalRows.map((vertical) => ({
      id: vertical.vertical_key,
      slug: vertical.slug,
      title: vertical.title,
      image: vertical.image,
      description: vertical.description,
      tags: tagsMap[vertical.id] || [],
      sortOrder: vertical.sort_order,
    })),
  };
};


// GET NEXT NUMERIC ID
const getNextId = async (collectionName) => {
  const db = getDB();

  const lastRecord = await db.collection(collectionName)
    .find({})
    .sort({ id: -1 })
    .limit(1)
    .next();

  return lastRecord ? Number(lastRecord.id) + 1 : 1;
};


// CREATE DEFAULT VERTICALS OVERVIEW
const createDefaultVerticalsOverview = async (
  siteContentId,
  defaultVerticalsOverview
) => {
  const db = getDB();

  const overviewId = await getNextId("verticals_overview");

  // Create parent section
  await db.collection("verticals_overview").insertOne({
    id: overviewId,
    label: defaultVerticalsOverview.label || "",
    title_line1: defaultVerticalsOverview.titleLine1 || "",
    title_line2: defaultVerticalsOverview.titleLine2 || "",
    site_content_id: Number(siteContentId),
  });

  // Create verticals
  const verticals = Array.isArray(defaultVerticalsOverview.verticals)
    ? defaultVerticalsOverview.verticals
    : [];

  for (let index = 0; index < verticals.length; index++) {
    const vertical = verticals[index];

    const verticalId = await getNextId("verticals");

    const verticalKey =
      vertical.id || `vertical-${Date.now()}-${index}`;

    // Insert vertical
    await db.collection("verticals").insertOne({
      id: verticalId,
      verticals_overview_id: overviewId,
      vertical_key: verticalKey,
      slug: vertical.slug || "",
      title: vertical.title || "",
      image: vertical.image || "",
      description: vertical.description || "",
      sort_order: vertical.sortOrder ?? index,
    });

    // Insert tags
    const tags = Array.isArray(vertical.tags) ? vertical.tags : [];

    if (tags.length > 0) {
      const tagDocuments = [];

      for (let tagIndex = 0; tagIndex < tags.length; tagIndex++) {
        tagDocuments.push({
          id: await getNextId("vertical_tags"),
          vertical_id: verticalId,
          tag: tags[tagIndex],
          sort_order: tagIndex,
        });
      }

      await db.collection("vertical_tags").insertMany(tagDocuments);
    }
  }

  return overviewId;
};


// UPDATE VERTICALS OVERVIEW
const updateVerticalsOverview = async (
  siteContentId,
  verticalsOverview
) => {
  if (verticalsOverview === undefined) {
    return;
  }

  const db = getDB();

  // Find existing section
  let section = await db.collection("verticals_overview").findOne({
    site_content_id: Number(siteContentId),
  });

  let overviewId;

  // Update existing section
  if (section) {
    overviewId = section.id;

    await db.collection("verticals_overview").updateOne(
      { id: overviewId },
      {
        $set: {
          label: verticalsOverview.label || "SPS Verticals",
          title_line1:
            verticalsOverview.titleLine1 ||
            "Comprehensive Industry Solutions",
          title_line2:
            verticalsOverview.titleLine2 ||
            "Digital Transformation",
        },
      }
    );
  } else {
    // Create section if missing
    overviewId = await getNextId("verticals_overview");

    await db.collection("verticals_overview").insertOne({
      id: overviewId,
      site_content_id: Number(siteContentId),
      label: verticalsOverview.label || "SPS Verticals",
      title_line1:
        verticalsOverview.titleLine1 ||
        "Comprehensive Industry Solutions",
      title_line2:
        verticalsOverview.titleLine2 ||
        "Digital Transformation",
    });
  }

  // Get existing verticals
  const existingVerticals = await db.collection("verticals")
    .find({ verticals_overview_id: overviewId })
    .project({ id: 1 })
    .toArray();

  const existingVerticalIds = existingVerticals.map(
    (vertical) => vertical.id
  );

  // Delete existing tags first
  if (existingVerticalIds.length > 0) {
    await db.collection("vertical_tags").deleteMany({
      vertical_id: { $in: existingVerticalIds },
    });
  }

  // Delete existing verticals
  await db.collection("verticals").deleteMany({
    verticals_overview_id: overviewId,
  });

  // Insert updated verticals
  const verticals = Array.isArray(verticalsOverview.verticals)
    ? verticalsOverview.verticals
    : [];

  for (let index = 0; index < verticals.length; index++) {
    const vertical = verticals[index];

    const verticalId = await getNextId("verticals");

    const verticalKey =
      vertical.id || `vertical-${Date.now()}-${index}`;

    // Insert vertical
    await db.collection("verticals").insertOne({
      id: verticalId,
      verticals_overview_id: overviewId,
      vertical_key: verticalKey,
      slug: vertical.slug || "",
      title: vertical.title || "",
      image: vertical.image || "",
      description: vertical.description || "",
      sort_order: vertical.sortOrder ?? index,
    });

    // Insert tags
    const tags = Array.isArray(vertical.tags) ? vertical.tags : [];

    if (tags.length > 0) {
      const tagDocuments = [];

      for (let tagIndex = 0; tagIndex < tags.length; tagIndex++) {
        tagDocuments.push({
          id: await getNextId("vertical_tags"),
          vertical_id: verticalId,
          tag: tags[tagIndex],
          sort_order: tagIndex,
        });
      }

      await db.collection("vertical_tags").insertMany(tagDocuments);
    }
  }
};


// EXPORT
module.exports = {
  getVerticalsOverview,
  createDefaultVerticalsOverview,
  updateVerticalsOverview,
};
