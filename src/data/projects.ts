export type ProjectStatus = "Active" | "Upcoming" | "Sold Out" | "Paused";

export type Project = {
  slug: string;
  name: string;
  partnerSlug: string;
  companyName: string;
  companyRole: string;
  status: ProjectStatus;
  projectType: string;
  categories: ("Plots" | "Townships" | "Commercial")[];
  location: string;
  city: string;
  description: string;
  highlights: string[];
  marketingPath: string;
  seoTitle: string;
  seoDescription: string;
  phone?: string;
};

/**
 * Project inventory is intentionally separate from individual property inventory.
 * One project can contain many plots, apartments, villas or commercial units.
 * Private owner information, live inventory and internal price sheets must never
 * be stored in this public dataset.
 */
export const projects: Project[] = [
  {
    slug: "central-world-nellore",
    name: "Central World",
    partnerSlug: "green-home-developers",
    companyName: "Green Home Developers",
    companyRole: "Developer",
    status: "Active",
    projectType: "Premium Township",
    categories: ["Plots", "Townships"],
    location: "Kanaparthi Padu, Nellore",
    city: "Nellore",
    description:
      "A 125-acre premium township in Nellore with a large clubhouse and planned residential development, marketed by Anantha Real Estate.",
    highlights: [
      "125-acre township",
      "31,000 sq ft clubhouse",
      "Kanaparthi Padu, Nellore",
      "NUDA & RERA approved as stated in project marketing materials",
      "Within NMC limits as stated in project marketing materials",
    ],
    marketingPath: "/centralworld",
    seoTitle: "Central World Nellore | Premium Township | Anantha Real Estate",
    seoDescription:
      "Explore Central World, a premium township project in Kanaparthi Padu, Nellore, marketed by Anantha Real Estate.",
    phone: "+91 63029 66604",
  },
  {
    slug: "motherland-green-meadows",
    name: "Motherland Green Meadows",
    partnerSlug: "motherland-developers",
    companyName: "Motherland Developers",
    companyRole: "Channel Partner Project",
    status: "Active",
    projectType: "Premium Residential Plots",
    categories: ["Plots"],
    location: "Brahmadevam, Muthukur Mandal, Nellore District",
    city: "Nellore",
    description:
      "A NUDA-approved residential plotted development at Brahmadevam, positioned for buyers looking toward the Muthukur and Krishnapatnam growth corridor. Anantha Real Estate supports project enquiries and site-visit coordination as a channel partner.",
    highlights: [
      "NUDA-approved plotted layout",
      "Approximately 10.10-acre sanctioned layout",
      "Brahmadevam, Muthukur Mandal",
      "Residential plotted development",
      "Krishnapatnam-side location",
      "Internal road network and planned open spaces",
      "Project documents available for customer verification",
      "Contact Anantha Real Estate for current project information",
    ],
    marketingPath: "/project/motherland-green-meadows",
    seoTitle: "Motherland Green Meadows Brahmadevam | Residential Plots | Anantha Real Estate",
    seoDescription:
      "Explore Motherland Green Meadows, a NUDA-approved residential plotted development at Brahmadevam, Muthukur Mandal, Nellore. Enquire with Anantha Real Estate for project details and site visits.",
    phone: "+91 63029 66604",
  },
  {
    slug: "motherland-crkr-sunrise-city",
    name: "Motherland CRKR Sunrise City",
    partnerSlug: "motherland-developers",
    companyName: "Motherland Developers",
    companyRole: "Channel Partner Project",
    status: "Active",
    projectType: "Premium Residential Plots",
    categories: ["Plots"],
    location: "Atmakur, Nellore District",
    city: "Nellore",
    description:
      "A large premium plotted development at Atmakur with highway connectivity and a broad range of planned lifestyle amenities. Anantha Real Estate supports customer enquiries, project explanation and site-visit coordination as a channel partner.",
    highlights: [
      "Approximately 28.54-acre sanctioned layout",
      "Atmakur, Nellore District",
      "Residential plotted development",
      "Bombay–Nellore Highway / NH-67 corridor connectivity",
      "40-ft and 50-ft CC roads stated in project brochure",
      "Clubhouse, swimming pool and function hall listed in project brochure",
      "Landscaped park, kids play area and avenue plantation",
      "Indoor games, gym, amphitheatre and skating area listed in brochure",
      "Project documents available for customer verification",
      "Contact Anantha Real Estate for current project information",
    ],
    marketingPath: "/project/motherland-crkr-sunrise-city",
    seoTitle: "Motherland CRKR Sunrise City Atmakur | Residential Plots | Anantha Real Estate",
    seoDescription:
      "Explore Motherland CRKR Sunrise City at Atmakur, Nellore District, with highway connectivity and planned lifestyle amenities. Enquire with Anantha Real Estate for project details and site visits.",
    phone: "+91 63029 66604",
  },
];

export const getProjectBySlug = (slug: string) =>
  projects.find((project) => project.slug === slug);
