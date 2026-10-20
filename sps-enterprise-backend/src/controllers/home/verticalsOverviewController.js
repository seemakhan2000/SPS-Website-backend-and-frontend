const { pool } = require("../../config/db");


// GET VERTICALS OVERVIEW
const getVerticalsOverview = async (
  siteContentId,
  db = pool
) => {

  // Get section
  const [sectionRows] = await db.query(
    `
    SELECT
      id,
      label,
      title_line1,
      title_line2
    FROM verticals_overview
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (sectionRows.length === 0) {
    return null;
  }

  const overviewId = sectionRows[0].id;


  // Get verticals
  const [verticalRows] = await db.query(
    `
    SELECT
      id,
      vertical_key,
      slug,
      title,
      image,
      description,
      sort_order
    FROM verticals
    WHERE verticals_overview_id = ?
    ORDER BY sort_order ASC, id ASC
    `,
    [overviewId]
  );


  // Get tags
  let tagRows = [];

  if (verticalRows.length > 0) {
    const verticalIds = verticalRows.map(
      (vertical) => vertical.id
    );

    [tagRows] = await db.query(
      `
      SELECT
        id,
        vertical_id,
        tag,
        sort_order
      FROM vertical_tags
      WHERE vertical_id IN (?)
      ORDER BY
        vertical_id ASC,
        sort_order ASC,
        id ASC
      `,
      [verticalIds]
    );
  }


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
    label: sectionRows[0].label,

    titleLine1:
      sectionRows[0].title_line1,

    titleLine2:
      sectionRows[0].title_line2,

    verticals: verticalRows.map(
      (vertical) => ({
        id: vertical.vertical_key,

        slug: vertical.slug,

        title: vertical.title,

        image: vertical.image,

        description:
          vertical.description,

        tags:
          tagsMap[vertical.id] || [],

        sortOrder:
          vertical.sort_order,
      })
    ),
  };
};


// CREATE DEFAULT VERTICALS OVERVIEW
const createDefaultVerticalsOverview = async (
  siteContentId,
  defaultVerticalsOverview,
  db
) => {

  // Create parent section
  const [sectionResult] = await db.query(
    `
    INSERT INTO verticals_overview
    (
      label,
      title_line1,
      title_line2,
      site_content_id
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      defaultVerticalsOverview.label,
      defaultVerticalsOverview.titleLine1,
      defaultVerticalsOverview.titleLine2,
      siteContentId,
    ]
  );

  const verticalsOverviewId =
    sectionResult.insertId;


  // Create verticals
  const verticals =
    Array.isArray(
      defaultVerticalsOverview.verticals
    )
      ? defaultVerticalsOverview.verticals
      : [];

  for (
    let index = 0;
    index < verticals.length;
    index++
  ) {
    const vertical = verticals[index];

    const verticalKey =
      vertical.id ||
      `vertical-${Date.now()}-${index}`;

    const [verticalResult] =
      await db.query(
        `
        INSERT INTO verticals
        (
          verticals_overview_id,
          vertical_key,
          slug,
          title,
          image,
          description,
          sort_order
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          verticalsOverviewId,

          verticalKey,

          vertical.slug || "",

          vertical.title || "",

          vertical.image || "",

          vertical.description || "",

          vertical.sortOrder ?? index,
        ]
      );

    const verticalId =
      verticalResult.insertId;


    // Create tags
    const tags =
      Array.isArray(vertical.tags)
        ? vertical.tags
        : [];

    for (
      let tagIndex = 0;
      tagIndex < tags.length;
      tagIndex++
    ) {
      await db.query(
        `
        INSERT INTO vertical_tags
        (
          vertical_id,
          tag,
          sort_order
        )
        VALUES (?, ?, ?)
        `,
        [
          verticalId,

          tags[tagIndex],

          tagIndex,
        ]
      );
    }
  }
};


// UPDATE VERTICALS OVERVIEW
const updateVerticalsOverview = async (
  siteContentId,
  verticalsOverview,
  connection
) => {

  // Nothing received


  if (verticalsOverview === undefined) {
    return;
  }


  // Find existing section
  const [existingSection] =
    await connection.query(
      `
      SELECT id
      FROM verticals_overview
      WHERE site_content_id = ?
      LIMIT 1
      `,
      [siteContentId]
    );

  let overviewId;


  // Update existing section
  if (existingSection.length > 0) {
    overviewId =
      existingSection[0].id;

    await connection.query(
      `
      UPDATE verticals_overview
      SET
        label = ?,
        title_line1 = ?,
        title_line2 = ?
      WHERE id = ?
      `,
      [
        verticalsOverview.label ||
        "SPS Verticals",

        verticalsOverview.titleLine1 ||
        "Comprehensive Industry Solutions",

        verticalsOverview.titleLine2 ||
        "Digital Transformation",

        overviewId,
      ]
    );
  }


  // Create section if missing
  else {
    const [sectionResult] =
      await connection.query(
        `
        INSERT INTO verticals_overview
        (
          label,
          title_line1,
          title_line2,
          site_content_id
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          verticalsOverview.label ||
          "SPS Verticals",

          verticalsOverview.titleLine1 ||
          "Comprehensive Industry Solutions",

          verticalsOverview.titleLine2 ||
          "Digital Transformation",

          siteContentId,
        ]
      );

    overviewId =
      sectionResult.insertId;
  }


  // Delete existing tags
  //
  // We must delete tags BEFORE deleting verticals
  // because vertical_tags.vertical_id is a FK.

  await connection.query(
    `
    DELETE vt
    FROM vertical_tags vt
    INNER JOIN verticals v
      ON vt.vertical_id = v.id
    WHERE v.verticals_overview_id = ?
    `,
    [overviewId]
  );


  // Delete existing verticals
  await connection.query(
    `
    DELETE FROM verticals
    WHERE verticals_overview_id = ?
    `,
    [overviewId]
  );


  // Insert new verticals
  const verticals =
    Array.isArray(
      verticalsOverview.verticals
    )
      ? verticalsOverview.verticals
      : [];

  for (
    let index = 0;
    index < verticals.length;
    index++
  ) {
    const vertical = verticals[index];

    const verticalKey =
      vertical.id ||
      `vertical-${Date.now()}-${index}`;

    const [verticalResult] =
      await connection.query(
        `
        INSERT INTO verticals
        (
          verticals_overview_id,
          vertical_key,
          slug,
          title,
          image,
          description,
          sort_order
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          overviewId,

          verticalKey,

          vertical.slug || "",

          vertical.title || "",

          vertical.image || "",

          vertical.description || "",

          vertical.sortOrder ?? index,
        ]
      );

    const verticalId =
      verticalResult.insertId;


    // Insert tags
    const tags =
      Array.isArray(vertical.tags)
        ? vertical.tags
        : [];

    for (
      let tagIndex = 0;
      tagIndex < tags.length;
      tagIndex++
    ) {
      await connection.query(
        `
        INSERT INTO vertical_tags
        (
          vertical_id,
          tag,
          sort_order
        )
        VALUES (?, ?, ?)
        `,
        [
          verticalId,

          tags[tagIndex],

          tagIndex,
        ]
      );
    }
  }
};


// EXPORT
module.exports = {
  getVerticalsOverview,
  createDefaultVerticalsOverview,
  updateVerticalsOverview,
};