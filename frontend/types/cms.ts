export interface HeroSlide {
  id: number;
  video: string;
  title: string;
  subtitle: string;
  description: string[];
  buttonText: string;
  buttonLink: string;
  isList?: boolean;
}

export interface AboutUsContent {
  label: string;
  title: string;
  description: string;
  bigImage: string;
  smallImage: string;
  buttonText: string;
  buttonLink: string;
}

/*

| SERVICES OVERVIEW

*/

export interface ServiceCardContent {
  id?: number;
  slug: string;
  title: string;
  description: string;
  href: string;
  icon?: string | null;
  sortOrder?: number;
}

export interface ServiceCategoryContent {
  id?: number;
  slug: string;
  label: string;
  description: string;
  icon?: string | null;
  sortOrder?: number;
  cards: ServiceCardContent[];
}

export interface ServicesOverviewContent {
  categories: ServiceCategoryContent[];
}

/*

| STARTUPS

*/

export interface StartupContent {
  id: number;
  name: string;
  logo: string;
  description: string;
  sortOrder?: number;
}

/*

| HOME CONTENT

*/

export interface HomeContent {
  _id?: string;
  key: string;

  heroSlides: HeroSlide[];

  aboutUs: AboutUsContent;

  servicesOverview: ServicesOverviewContent;
  startupsSection: StartupsSectionContent;
  
  startups: StartupContent[];
  products: ProductsContent;
  contactCTA: ContactCTAContent;
  customers: CustomersContent;
    howItWorks: HowItWorksContent;
     technologyPartners: TechnologyPartnersContent;
     highlights?: HighlightsContent;
  clientsMarquee?: ClientsMarqueeContent;
  newsInsights?: NewsInsightsContent;
  verticalsOverview?: VerticalsOverviewContent;
}

export interface StartupsSectionContent {
  title: string;
  subtitle: string;
  description: string;
   backgroundImage?: string;
}

/* PRODUCTS*/
export interface ProductContent {
  id?: number;
  name: string;
  image: string;
  description: string;
  sortOrder?: number;
}

export interface ProductsContent {
  title: string;
  yearsText: string;
  yearsNumber: string;
  yearsDescription: string;
  backgroundImage: string;
  products: ProductContent[];
}
/*CONTACT CTA*/

export interface ContactCTAService {
  id?: number;
  name: string;
  sortOrder?: number;
}

export interface ContactCTAContent {
  sideLabel: string;
  titleLine1: string;
  highlightedTitle: string;
  titleLine2: string;
  titleLine3: string;

  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  messageLabel: string;

  serviceLabel: string;
  services: ContactCTAService[];

  buttonText: string;

  image: string;
}

/*CUSTOMERS*/

export interface CustomerAvatar {
  id: number;
  image: string;
}

export interface CustomerTestimonial {
  name: string;
  rating: number;
  message: string;
  image: string;
}

export interface CustomerDeployment {
  number: string;
  text: string;
  avatars: CustomerAvatar[];
}

export interface CustomerImpact {
  name: string;
  role: string;
  image: string;
  title: string;
  description: string;
}

export interface CustomersContent {
  headingLine1: string;
  headingLine2: string;
  headingLine3: string;

  mainImage: string;

  testimonial: CustomerTestimonial;

  deployment: CustomerDeployment;

  impact: CustomerImpact;
}
/*HOW IT WORKS*/
export interface HowItWorksStep {
  id?: number;
  icon: string;
  title: string;
  sortOrder?: number;
}

export interface HowItWorksContent {
  heading: string;
  description: string;

  steps: HowItWorksStep[];

  image: string;

  buttonText: string;
  buttonLink: string;

  specialistsNumber: string;
  specialistsText: string;

  clientsNumber: string;
  clientsText: string;
}
/*TECHNOLOGY PARTNERS*/

export interface TechnologyPartner {
  id?: number | string;
  name: string;
  tagline: string;
  image: string;
  href: string;
  sortOrder?: number;
}

export interface TechnologyPartnersContent {
  title: string;
  description: string;
  partners: TechnologyPartner[];
}
export interface HighlightsContent {
  image: string;
  alt: string;
  title: string;
  description: string;
}

export interface ClientLogoContent {
  id?: number | string;
  name: string;
  logo: string;
  alt: string;
  sortOrder?: number;
}

export interface ClientsMarqueeContent {
  title: string;
  clients: ClientLogoContent[];
}

export interface NewsItemContent {
  id: string;
  badge?: string;
  title: string;
  image?: string;
  href: string;
  cta: "readMore" | "arrow";
  variant: "plain-image" | "gradient-image" | "solid";
  sortOrder?: number;
}

export interface NewsInsightsContent {
  title: string;
  viewAllText: string;
  viewAllLink: string;
  items: NewsItemContent[];
}

export interface VerticalContent {
  id: string;
  slug: string;
  title: string;
  image: string;
  description: string;
  tags: string[];
  sortOrder?: number;
}

export interface VerticalsOverviewContent {
  label: string;
  titleLine1: string;
  titleLine2: string;
  verticals: VerticalContent[];
}