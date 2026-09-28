import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.anantharealestate.in";
const DEFAULT_IMAGE = `${SITE_URL}/ANANTHA%20LOGO.png`;
const BUSINESS_ID = `${SITE_URL}/#business`;
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const GOOGLE_SITE_VERIFICATION = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION?.trim();

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

const getBreadcrumbName = (path: string) => {
  const cleanPath = path.replace(/^\//, "").replace(/\/$/, "");
  const names: Record<string, string> = {
    about: "About",
    services: "Services",
    portfolio: "Portfolio",
    projects: "Projects",
    properties: "Properties",
    contact: "Contact",
    centralworld: "Central World",
    "buy-property": "Buy Property",
    "sell-your-property": "Sell Your Property",
    locations: "Locations",
    "property-intelligence": "Property Intelligence",
    "property-consultation": "Property Consultation",
  };

  if (cleanPath.startsWith("project/")) return "Project";
  if (cleanPath.startsWith("property/")) return "Property";
  if (cleanPath.startsWith("properties/")) return "Property Category";
  if (cleanPath.startsWith("locations/")) return "Location";

  return names[cleanPath] ?? "Page";
};

const SEO = ({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  structuredData,
}: SEOProps) => {
  const canonicalUrl = `${SITE_URL}${path === "/" ? "" : path}`;
  const isHome = path === "/";
  const pageName = getBreadcrumbName(path);

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Anantha Real Estate",
      url: SITE_URL,
      logo: DEFAULT_IMAGE,
      email: "contact@anantharealestate.in",
      telephone: "+916302966604",
      sameAs: [
        "https://www.instagram.com/anantha_real_estate",
        "https://youtube.com/@ananthaconsultancy",
      ],
    },
    {
      "@type": "RealEstateAgent",
      "@id": BUSINESS_ID,
      name: "Anantha Real Estate",
      url: SITE_URL,
      logo: DEFAULT_IMAGE,
      image: DEFAULT_IMAGE,
      telephone: "+916302966604",
      email: "contact@anantharealestate.in",
      parentOrganization: { "@id": ORGANIZATION_ID },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Satyanarayana Puram Centre, Mypadu Road",
        addressLocality: "Nellore",
        addressRegion: "Andhra Pradesh",
        postalCode: "524002",
        addressCountry: "IN",
      },
      areaServed: [
        { "@type": "City", name: "Nellore" },
        { "@type": "AdministrativeArea", name: "Andhra Pradesh" },
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+916302966604",
          contactType: "customer service",
          areaServed: "IN",
          availableLanguage: ["English", "Telugu"],
        },
      ],
      sameAs: [
        "https://www.instagram.com/anantha_real_estate",
        "https://youtube.com/@ananthaconsultancy",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Anantha Real Estate",
      publisher: { "@id": ORGANIZATION_ID },
      inLanguage: "en-IN",
    },
  ];

  if (!isHome) {
    const isProject = path.startsWith("/project/");
    const isProperty = path.startsWith("/property/");
    const isPropertyCategory = path.startsWith("/properties/");
    const isLocation = path.startsWith("/locations/");
    const parentName = isProject ? "Projects" : isProperty || isPropertyCategory ? "Properties" : isLocation ? "Locations" : undefined;
    const parentPath = isProject ? "/projects" : isProperty || isPropertyCategory ? "/properties" : isLocation ? "/locations" : undefined;

    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        ...(parentName && parentPath
          ? [
              { "@type": "ListItem", position: 2, name: parentName, item: `${SITE_URL}${parentPath}` },
              { "@type": "ListItem", position: 3, name: pageName, item: canonicalUrl },
            ]
          : [{ "@type": "ListItem", position: 2, name: pageName, item: canonicalUrl }]),
      ],
    });
  }

  if (structuredData) {
    graph.push(...(Array.isArray(structuredData) ? structuredData : [structuredData]));
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
      {GOOGLE_SITE_VERIFICATION && <meta name="google-site-verification" content={GOOGLE_SITE_VERIFICATION} />}
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Anantha Real Estate" />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content="Anantha Real Estate" />
      <meta property="og:locale" content="en_IN" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@AnanthaRealEstate" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>
    </Helmet>
  );
};

export default SEO;
