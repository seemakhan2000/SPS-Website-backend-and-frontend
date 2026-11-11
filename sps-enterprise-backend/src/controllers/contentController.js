
const { getDB } = require("../config/db");


// HOME SECTION CONTROLLERS
const {
  getHeroSlides,
  updateHeroSlides,
} = require("./home/heroController");

const {
  getAboutUs,
  updateAboutUs,
} = require("./home/aboutUsController");

const {
  getServicesOverview,
  updateServicesOverview,
} = require("./home/servicesController");

const {
  getStartups,
  updateStartups,
} = require("./home/startupsController");

const {
  getStartupsSection,
  updateStartupsSection,
} = require("./home/startupsSectionController");

const {
  getProducts,
  updateProducts,
} = require("./home/productController");

const {
  getContactCTA,
  updateContactCTA,
} = require("./home/contactCTAController");

const {
  getCustomers,
  updateCustomers,
} = require("./home/customerController");

const {
  getHowItWorks,
  updateHowItWorks,
} = require("./home/howItWorksController");

const {
  getTechnologyPartners,
  updateTechnologyPartners,
} = require("./home/technologyPartnersController");

const {
  getHighlights,
  updateHighlights,
} = require("./home/highlightsController");

const {
  getClientsMarquee,
  updateClientsMarquee,
} = require("./home/clientsMarqueeController");

const {
  getNewsInsights,
  updateNewsInsights,
} = require("./home/newsInsightsController");

const {
  getVerticalsOverview,
  updateVerticalsOverview,
} = require("./home/verticalsOverviewController");


// GET HOME CONTENT
const getHomeContent = async (req, res) => {
  try {
    const db = getDB();

    // FIND HOME SITE CONTENT
    const siteContent = await db.collection("site_content").findOne({
      key: "home",
    });

    // HOME DOES NOT EXIST
    if (!siteContent) {
      return res.status(200).json({
        _id: null,
        key: "home",

        heroSlides: [],
        aboutUs: null,
        servicesOverview: null,
        startups: [],
        startupsSection: null,
        products: null,
        contactCTA: null,
        customers: null,
        howItWorks: null,
        technologyPartners: null,
        highlights: null,
        clientsMarquee: null,
        newsInsights: null,
        verticalsOverview: null,
      });
    }

    // SITE CONTENT ID
    const siteContentId = siteContent.id;

    // GET ALL HOME SECTIONS
    const [
      heroSlides,
      aboutUs,
      servicesOverview,
      startups,
      startupsSection,
      products,
      contactCTA,
      customers,
      howItWorks,
      technologyPartners,
      highlights,
      clientsMarquee,
      newsInsights,
      verticalsOverview,
    ] = await Promise.all([
      getHeroSlides(siteContentId),
      getAboutUs(siteContentId),
      getServicesOverview(siteContentId),
      getStartups(siteContentId),
      getStartupsSection(siteContentId),
      getProducts(siteContentId),
      getContactCTA(siteContentId),
      getCustomers(siteContentId),
      getHowItWorks(siteContentId),
      getTechnologyPartners(siteContentId),
      getHighlights(siteContentId),
      getClientsMarquee(siteContentId),
      getNewsInsights(siteContentId),
      getVerticalsOverview(siteContentId),
    ]);

    // RETURN DATABASE DATA
    return res.status(200).json({
      _id: String(siteContentId),

      key: siteContent.key,

      heroSlides: heroSlides || [],
      aboutUs: aboutUs || null,
      servicesOverview: servicesOverview || null,
      startups: startups || [],
      startupsSection: startupsSection || null,
      products: products || null,
      contactCTA: contactCTA || null,
      customers: customers || null,
      howItWorks: howItWorks || null,
      technologyPartners: technologyPartners || null,
      highlights: highlights || null,
      clientsMarquee: clientsMarquee || null,
      newsInsights: newsInsights || null,
      verticalsOverview: verticalsOverview || null,
    });

  } catch (error) {
    console.error("GET HOME CONTENT ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch home content",
      error: error.message,
    });
  }
};


// UPDATE HOME CONTENT
const updateHomeContent = async (req, res) => {
  try {
    const db = getDB();

    // REQUEST BODY
    const {
      heroSlides,
      aboutUs,
      servicesOverview,
      startups,
      startupsSection,
      products,
      contactCTA,
      customers,
      howItWorks,
      technologyPartners,
      highlights,
      clientsMarquee,
      newsInsights,
      verticalsOverview,
    } = req.body || {};

    // FIND HOME SITE CONTENT
    const siteContent = await db.collection("site_content").findOne({
      key: "home",
    });

    // HOME DOES NOT EXIST
    if (!siteContent) {
      return res.status(404).json({
        message: "Home site content does not exist",
      });
    }

    // SITE CONTENT ID
    const siteContentId = siteContent.id;

    // UPDATE HERO
    if (heroSlides !== undefined) {
      await updateHeroSlides(siteContentId, heroSlides);
    }

    // UPDATE ABOUT US
    if (aboutUs !== undefined) {
      await updateAboutUs(siteContentId, aboutUs);
    }

    // UPDATE SERVICES OVERVIEW
    if (servicesOverview !== undefined) {
      await updateServicesOverview(siteContentId, servicesOverview);
    }

    // UPDATE STARTUPS
    if (startups !== undefined) {
      await updateStartups(siteContentId, startups);
    }

    // UPDATE STARTUPS SECTION
    if (startupsSection !== undefined) {
      await updateStartupsSection(siteContentId, startupsSection);
    }

    // UPDATE PRODUCTS
    if (products !== undefined) {
      await updateProducts(siteContentId, products);
    }

    // UPDATE CONTACT CTA
    if (contactCTA !== undefined) {
      await updateContactCTA(siteContentId, contactCTA);
    }

    // UPDATE CUSTOMERS
    if (customers !== undefined) {
      await updateCustomers(siteContentId, customers);
    }

    // UPDATE HOW IT WORKS
    if (howItWorks !== undefined) {
      await updateHowItWorks(siteContentId, howItWorks);
    }

    // UPDATE TECHNOLOGY PARTNERS
    if (technologyPartners !== undefined) {
      await updateTechnologyPartners(
        siteContentId,
        technologyPartners
      );
    }

    // UPDATE HIGHLIGHTS
    if (highlights !== undefined) {
      await updateHighlights(siteContentId, highlights);
    }

    // UPDATE CLIENTS MARQUEE
    if (clientsMarquee !== undefined) {
      await updateClientsMarquee(siteContentId, clientsMarquee);
    }

    // UPDATE NEWS & INSIGHTS
    if (newsInsights !== undefined) {
      await updateNewsInsights(siteContentId, newsInsights);
    }

    // UPDATE VERTICALS OVERVIEW
    if (verticalsOverview !== undefined) {
      await updateVerticalsOverview(
        siteContentId,
        verticalsOverview
      );
    }

    // GET UPDATED CONTENT FROM DATABASE
    const [
      updatedHeroSlides,
      updatedAboutUs,
      updatedServicesOverview,
      updatedStartups,
      updatedStartupsSection,
      updatedProducts,
      updatedContactCTA,
      updatedCustomers,
      updatedHowItWorks,
      updatedTechnologyPartners,
      updatedHighlights,
      updatedClientsMarquee,
      updatedNewsInsights,
      updatedVerticalsOverview,
    ] = await Promise.all([
      getHeroSlides(siteContentId),
      getAboutUs(siteContentId),
      getServicesOverview(siteContentId),
      getStartups(siteContentId),
      getStartupsSection(siteContentId),
      getProducts(siteContentId),
      getContactCTA(siteContentId),
      getCustomers(siteContentId),
      getHowItWorks(siteContentId),
      getTechnologyPartners(siteContentId),
      getHighlights(siteContentId),
      getClientsMarquee(siteContentId),
      getNewsInsights(siteContentId),
      getVerticalsOverview(siteContentId),
    ]);

    // SAVED CONTENT
    const savedContent = {
      _id: String(siteContentId),

      key: siteContent.key,

      heroSlides: updatedHeroSlides || [],
      aboutUs: updatedAboutUs || null,
      servicesOverview: updatedServicesOverview || null,
      startups: updatedStartups || [],
      startupsSection: updatedStartupsSection || null,
      products: updatedProducts || null,
      contactCTA: updatedContactCTA || null,
      customers: updatedCustomers || null,
      howItWorks: updatedHowItWorks || null,
      technologyPartners: updatedTechnologyPartners || null,
      highlights: updatedHighlights || null,
      clientsMarquee: updatedClientsMarquee || null,
      newsInsights: updatedNewsInsights || null,
      verticalsOverview: updatedVerticalsOverview || null,
    };

    // RESPONSE
    return res.status(200).json({
      message: "Home content updated successfully",
      content: savedContent,
    });

  } catch (error) {
    console.error("UPDATE HOME CONTENT ERROR:", error);

    return res.status(500).json({
      message: "Failed to update home content",
      error: error.message,
    });
  }
};


// EXPORTS
module.exports = {
  getHomeContent,
  updateHomeContent,
};
