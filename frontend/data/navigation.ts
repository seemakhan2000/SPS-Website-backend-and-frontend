// data/navigation.ts

export interface NavItem {
  name: string;
  href: string;
  children?: NavItem[];
  icon?: string;
  isGroup?: boolean;
   id?: string;
}

export const navigation: NavItem[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Products",
    href: "/products",
    children: [
      {
        name: "SPS",
        href: "#",
        isGroup: true,
        children: [
          { name: "MYID Self Verify", href: "/products/myid-self-verify" },
          { name: "Azalio", href: "/products/azalio" },
          { name: "Fabrico", href: "/products/fabrico" },
          { name: "BMS", href: "/products/bms" },
          { name: "CSM", href: "/products/csm" },
        ],
      },
      {
        name: "IBM",
        href: "#",
        isGroup: true,
        children: [
          { name: "Automation", href: "/products/ibm-automation" },
          { name: "Data & AI", href: "/products/ibm-data-ai" },
          { name: "Security", href: "/products/ibm-security" },
          { name: "Sustainability", href: "/products/ibm-sustainability" },
        ],
      },
      {
        name: "Others",
        href: "#",
        isGroup: true,
        children: [
          { name: "Cloud Management", href: "/products/cloud-management" },
          { name: "Analytics Tools", href: "/products/analytics-tools" },
          { name: "IoT Solutions", href: "/products/iot-solutions" },
          { name: "Blockchain", href: "/products/blockchain" },
        ],
      },
    ],
  },
  {
    name: "Services",
    href: "/services",
    children: [
      {
        name: "Cybersecurity",
        href: "/services/cybersecurity",
        children: [
          { name: "Network Security", href: "/services/cybersecurity/network-security" },
          { name: "SMaas", href: "/services/cybersecurity/smaas" },
          { name: "GRC", href: "/services/cybersecurity/grc" },
          { name: "Identity & Access", href: "/services/cybersecurity/identity-access" },
          { name: "Threat Management", href: "/services/cybersecurity/threat-management" },
        ],
      },
      {
        name: "Training",
        href: "/services/training",
        children: [
          { name: "IBM", href: "/services/training/ibm" },
          { name: "Google", href: "/services/training/google" },
          { name: "AWS", href: "/services/training/aws" },
          { name: "See More", href: "/services/training/see-more" },
        ],
      },
      {
        name: "Cloud",
        href: "/services/cloud",
        children: [
          { name: "DevOps", href: "/services/cloud/devops" },
          { name: "Migration Services", href: "/services/cloud/migration-services" },
        ],
      },
      {
        name: "AI & Automation",
        href: "/services/ai-automation",
        children: [
          { name: "Automation", href: "/services/ai-automation/automation" },
          { name: "Data Science", href: "/services/ai-automation/data-science" },
        ],
      },
      {
        name: "Collaboration",
        href: "/services/collaboration",
        children: [
          { name: "Training", href: "/services/collaboration/training" },
          { name: "Events", href: "/services/collaboration/events" },
        ],
      },
    ],
  },
  {
    name: "Verticals",
    href: "/verticals",
    children: [
      {
        name: "Public Sector",
        href: "/verticals/public-sector",
        children: [
          { name: "County Government", href: "/verticals/public-sector/county-government" },
          { name: "Healthcare", href: "/verticals/public-sector/healthcare" },
          { name: "Government", href: "/verticals/public-sector/government" },
          { name: "Public Safety", href: "/verticals/public-sector/public-safety" },
          { name: "Education", href: "/verticals/public-sector/education" },
        ],
      },
      {
        name: "Industrial",
        href: "/verticals/industrial",
        children: [
          { name: "Manufacturing", href: "/verticals/industrial/manufacturing" },
          { name: "Textiles", href: "/verticals/industrial/textiles" },
          { name: "Utilities", href: "/verticals/industrial/utilities" },
        ],
      },
      {
        name: "Energy",
        href: "/verticals/energy",
        children: [
          { name: "Electric", href: "/verticals/energy/electric" },
          { name: "Oil & Gas", href: "/verticals/energy/oil-gas" },
        ],
      },
      {
        name: "Financial",
        href: "/verticals/financial",
        children: [
          { name: "Banking", href: "/verticals/financial/banking" },
          { name: "Insurance", href: "/verticals/financial/insurance" },
        ],
      },
      {
        name: "Healthcare",
        href: "/verticals/healthcare",
        children: [
          { name: "Compliance Requirements", href: "/verticals/healthcare/compliance" },
          { name: "Health Systems Interoperability", href: "/verticals/healthcare/interoperability" },
          { name: "Multi-Clinic Consolidation", href: "/verticals/healthcare/consolidation" },
          { name: "Patient Experience", href: "/verticals/healthcare/patient-experience" },
        ],
      },
      {
        name: "Telecommunications",
        href: "/verticals/telecommunications",
        children: [
          { name: "Telecommunications", href: "/verticals/telecommunications/overview" },
        ],
      },
      {
        name: "Retail",
        href: "/verticals/retail",
        children: [
          { name: "Convenience Store", href: "/verticals/retail/convenience-store" },
          { name: "Marketing/Merchandising", href: "/verticals/retail/marketing" },
          { name: "Omni-channel Operations", href: "/verticals/retail/omni-channel" },
          { name: "Personalization & Localization", href: "/verticals/retail/personalization" },
          { name: "Supply Chain", href: "/verticals/retail/supply-chain" },
        ],
      },
    ],
  },
  {
    name: "Spinnlabs",
    href: "/spinnlabs",
    children: [
      { name: "Overview", href: "/spinnlabs/overview" },
      { name: "Academia", href: "/spinnlabs/academia" },
      { name: "Industry", href: "/spinnlabs/industry" },
      { name: "Center of Expertise", href: "/spinnlabs/center-of-expertise" },
      { name: "Startups", href: "/spinnlabs/startups" },
    ],
  },
  {
    name: "Activities",
    href: "/activities",
    children: [
      { name: "News & Insights", href: "/activities/news" },
      { name: "Events", href: "/activities/events" },
      { name: "Blog", href: "/activities/blog" },
      { name: "Webinars", href: "/activities/webinars" },
    ],
  },
  {
    name: "About Us",
    href: "/about-us",
    children: [
      { name: "Our Story", href: "/about-us/our-story" },
      { name: "Leadership", href: "/about-us/leadership" },
      { name: "Achievements", href: "/about-us/achievements" },
      { name: "Careers", href: "/about-us/careers" },
    ],
  },
  {
    name: "Contracts",
    href: "/contracts",
    children: [
      { name: "Federal", href: "/contracts/federal" },
      { name: "State", href: "/contracts/state" },
      { name: "Local", href: "/contracts/local" },
    ],
  },
  
  {
    name: "Internship",
    href: "/internship",
    children: [
      { name: "Apply Now", href: "/internship/apply" },
    ],
  },
];