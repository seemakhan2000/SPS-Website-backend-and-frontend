const { pool } = require("../../config/db");


// GET PRODUCTS
const getProducts = async (
  siteContentId,
  db = pool
) => {
  const [sectionRows] = await db.query(
    `
    SELECT
      id,
      title,
      years_number,
      years_text,
      years_description,
      background_image,
      site_content_id
    FROM products_section
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (sectionRows.length === 0) {
    return null;
  }

  const section = sectionRows[0];


  // GET PRODUCTS
  const [productRows] = await db.query(
    `
    SELECT
      id,
      name,
      image,
      description,
      sort_order
    FROM products
    WHERE section_id = ?
    ORDER BY sort_order ASC, id ASC
    `,
    [section.id]
  );


  // RETURN DB DATA
  return {
    id: section.id,

    title: section.title,

    yearsNumber:
      section.years_number,

    yearsText:
      section.years_text,

    yearsDescription:
      section.years_description,

    backgroundImage:
      section.background_image,

    products: productRows.map((product) => ({
      id: product.id,
      name: product.name,
      image: product.image,
      description: product.description,
      sortOrder: product.sort_order,
    })),

    siteContentId:
      section.site_content_id,
  };
};


// CREATE PRODUCTS
const createProducts = async (
  siteContentId,
  productsContent,
  db = pool
) => {
  if (!productsContent) {
    throw new Error(
      "Products data is required"
    );
  }


  // CHECK EXISTING SECTION
  const [existingRows] = await db.query(
    `
    SELECT id
    FROM products_section
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length > 0) {
    throw new Error(
      "Products section already exists"
    );
  }


  // CREATE PRODUCTS SECTION
  const [sectionResult] = await db.query(
    `
    INSERT INTO products_section
    (
      title,
      years_number,
      years_text,
      years_description,
      background_image,
      site_content_id
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      productsContent.title,
      productsContent.yearsNumber,
      productsContent.yearsText,
      productsContent.yearsDescription,
      productsContent.backgroundImage,
      siteContentId,
    ]
  );

  const sectionId =
    sectionResult.insertId;


  // CREATE PRODUCTS
  if (Array.isArray(productsContent.products)) {
    for (
      let index = 0;
      index < productsContent.products.length;
      index++
    ) {
      const product =
        productsContent.products[index];

      await db.query(
        `
        INSERT INTO products
        (
          section_id,
          name,
          image,
          description,
          sort_order
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          sectionId,
          product.name,
          product.image,
          product.description,
          product.sortOrder ?? index,
        ]
      );
    }
  }

  return getProducts(
    siteContentId,
    db
  );
};


// UPDATE PRODUCTS
const updateProducts = async (
  siteContentId,
  productsContent,
  db = pool
) => {
  if (!productsContent) {
    throw new Error(
      "Products data is required"
    );
  }


  // CHECK EXISTING SECTION
  const [existingRows] = await db.query(
    `
    SELECT id
    FROM products_section
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length === 0) {
    throw new Error(
      "Products section not found"
    );
  }

  const sectionId =
    existingRows[0].id;


  // UPDATE PRODUCTS SECTION
  await db.query(
    `
    UPDATE products_section
    SET
      title = ?,
      years_number = ?,
      years_text = ?,
      years_description = ?,
      background_image = ?
    WHERE site_content_id = ?
    `,
    [
      productsContent.title,
      productsContent.yearsNumber,
      productsContent.yearsText,
      productsContent.yearsDescription,
      productsContent.backgroundImage,
      siteContentId,
    ]
  );


  // DELETE OLD PRODUCTS
  await db.query(
    `
    DELETE FROM products
    WHERE section_id = ?
    `,
    [sectionId]
  );


  // INSERT CURRENT PRODUCTS
  if (Array.isArray(productsContent.products)) {
    for (
      let index = 0;
      index < productsContent.products.length;
      index++
    ) {
      const product =
        productsContent.products[index];

      await db.query(
        `
        INSERT INTO products
        (
          section_id,
          name,
          image,
          description,
          sort_order
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          sectionId,
          product.name,
          product.image,
          product.description,
          product.sortOrder ?? index,
        ]
      );
    }
  }

  return getProducts(
    siteContentId,
    db
  );
};


// DELETE PRODUCTS
const deleteProducts = async (
  siteContentId,
  db = pool
) => {

  // CHECK EXISTING SECTION
  const [existingRows] = await db.query(
    `
    SELECT id
    FROM products_section
    WHERE site_content_id = ?
    LIMIT 1
    `,
    [siteContentId]
  );

  if (existingRows.length === 0) {
    throw new Error(
      "Products section not found"
    );
  }

  const sectionId =
    existingRows[0].id;


  // DELETE PRODUCTS FIRST
  await db.query(
    `
    DELETE FROM products
    WHERE section_id = ?
    `,
    [sectionId]
  );


  // DELETE PRODUCTS SECTION
  const [result] = await db.query(
    `
    DELETE FROM products_section
    WHERE site_content_id = ?
    `,
    [siteContentId]
  );

  if (result.affectedRows === 0) {
    throw new Error(
      "Products section not found"
    );
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