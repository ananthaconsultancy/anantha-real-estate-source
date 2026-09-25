export type PropertyStatus = "available" | "sold" | "under-negotiation" | "unavailable";
export type PropertyType = "plots" | "apartments" | "villas" | "commercial" | "land" | "township";
export type PriceType = "fixed" | "starting-from" | "negotiable" | "on-request";

export type PropertyImage = {
  src: string;
  alt: string;
};

export type Property = {
  slug: string;
  publicId?: string;
  insightSignals?: string[];
  name: string;
  type: PropertyType;
  status: PropertyStatus;
  verified: boolean;
  lastVerifiedAt?: string;
  location: string;
  city: string;
  latitude?: number;
  longitude?: number;
  mapsUrl?: string;
  developer?: string;
  projectSlug?: string;
  projectName?: string;
  area?: string;
  areaValue?: number;
  areaUnit?: "sq ft" | "sq yd" | "acre" | "cent";
  price?: number;
  priceLabel?: string;
  priceType?: PriceType;
  bedrooms?: number;
  bathrooms?: number;
  facing?: string;
  roadWidth?: string;
  shortDescription: string;
  description: string;
  highlights: string[];
  amenities?: string[];
  enquiryPhone: string;
  whatsappPhone?: string;
  sourceRoute?: string;
  image?: string;
  imageAlt?: string;
  gallery?: PropertyImage[];
  videoUrl?: string;
  brochureUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  updatedAt?: string;
};

// Customer-facing inventory is intentionally separate from project inventory.
// Only approved public fields belong here. Never publish private owner details,
// confidential documents, personal contact information, or unverified claims.
// `verified` means Anantha has recently confirmed the public listing information;
// it must not be used to imply legal/title verification unless that work was actually completed.
export const properties: Property[] = [];

export const propertyCategories = [
  {
    slug: "plots",
    name: "Plots for Sale",
    description: "Explore plotted development opportunities in and around Nellore.",
  },
  {
    slug: "apartments",
    name: "Apartments",
    description: "Residential apartment opportunities for buyers and investors.",
  },
  {
    slug: "villas",
    name: "Villas",
    description: "Villa and premium residential opportunities in Nellore.",
  },
  {
    slug: "commercial",
    name: "Commercial Property",
    description: "Office, retail and other commercial property opportunities.",
  },
  {
    slug: "land",
    name: "Land & Farmland",
    description: "Land opportunities for end use, development and investment.",
  },
] as const;

export const getPropertyBySlug = (slug: string) =>
  properties.find((property) => property.slug === slug);

export const getPropertiesByProject = (projectSlug: string) =>
  properties.filter((property) => property.projectSlug === projectSlug);

export const getPublicProperties = () =>
  properties.filter((property) => property.status !== "unavailable");
