/**
 * SECTION REGISTRY — single source of truth for the CMS.
 * Drives the seed script (scripts/seed.ts) and the admin content editor.
 * Kept import-free so the seed can load it standalone via tsx.
 *
 * Presentation metadata (accent colors, lucide icon names, tags, gradients) stays
 * in the section components keyed by item id — only TEXT + IMAGES are DB-editable.
 * Field/item paths below mirror frontend/messages/{uz,ru,en}.json exactly.
 */

export type RegistryImage = { legacySrc?: string | null };

export type RegistryItem = {
  id: string;
  /** dotted path under the section namespace; defaults to id */
  path?: string;
  fields: string[];
  image?: RegistryImage;
};

export type RegistryEntry = {
  key: string;
  type: "section" | "singleton";
  component?: string;
  order: number;
  enabled: boolean;
  toggleable: boolean;
  /** L10n scalar field names under the namespace */
  fields: string[];
  /** array fields (L10n[]) e.g. typewriterPhrases */
  listFields?: string[];
  items?: RegistryItem[];
  /** stat ids at <key>.<statId>.{value,label} */
  stats?: string[];
  extra?: Record<string, unknown>;
  image?: RegistryImage;
};

const P = (legacySrc: string): RegistryImage => ({ legacySrc });
const AVATAR: RegistryImage = { legacySrc: null }; // uploadable slot, empty today

export const SECTION_REGISTRY: RegistryEntry[] = [
  // ── Sections (rendered on the homepage, toggleable/ordered) ──────────────
  {
    key: "hero", type: "section", component: "HeroSection", order: 10,
    enabled: true, toggleable: false,
    fields: ["headline", "subheadline", "ctaStart", "ctaContact"],
  },
  {
    key: "manifesto", type: "section", component: "ManifestoSection", order: 20,
    enabled: true, toggleable: true,
    fields: ["statement", "paragraph1", "paragraph2", "paragraph3"],
  },
  {
    key: "services", type: "section", component: "ServicesSection", order: 30,
    enabled: true, toggleable: true,
    fields: ["title"],
    listFields: ["typewriterPhrases"],
    items: [
      { id: "web", fields: ["title", "intro", "bullet1", "bullet2", "bullet3"] },
      { id: "backend", fields: ["title", "intro", "bullet1", "bullet2", "bullet3"] },
      { id: "android", fields: ["title", "intro", "bullet1", "bullet2", "bullet3"] },
      { id: "ios", fields: ["title", "intro", "bullet1", "bullet2", "bullet3"] },
      { id: "smm", fields: ["title", "intro", "bullet1", "bullet2", "bullet3"] },
    ],
  },
  {
    key: "floating", type: "section", component: "FloatingContentSection", order: 40,
    enabled: true, toggleable: true,
    fields: ["label", "title"],
    items: [
      { id: "block1", fields: ["title", "text"] },
      { id: "block2", fields: ["title", "text"] },
      { id: "block3", fields: ["title", "text"] },
      { id: "block4", fields: ["title", "text"] },
    ],
    stats: ["stat1", "stat2", "stat3", "stat4"],
  },
  {
    key: "positioning", type: "section", component: "PositioningBlock", order: 50,
    enabled: true, toggleable: true,
    fields: ["line1", "line2"],
  },
  {
    key: "why", type: "section", component: "WhyFazoSection", order: 60,
    enabled: true, toggleable: true,
    fields: ["title"],
    items: [
      { id: "item0", path: "items.0", fields: ["label", "body"] },
      { id: "item1", path: "items.1", fields: ["label", "body"] },
      { id: "item2", path: "items.2", fields: ["label", "body"] },
      { id: "item3", path: "items.3", fields: ["label", "body"] },
      { id: "item4", path: "items.4", fields: ["label", "body"] },
    ],
  },
  {
    key: "portfolio", type: "section", component: "PortfolioSection", order: 70,
    enabled: true, toggleable: true,
    fields: ["label", "title", "subtitle"],
    items: [
      { id: "uzavtosavdo", fields: ["title", "description", "result"], image: P("/uzautosavdo.png") },
      { id: "crm_savdo", fields: ["title", "description", "result"], image: AVATAR },
      { id: "shashlik_house", fields: ["title", "description", "result"], image: P("/shshlik_house.jpg") },
      { id: "medhome", fields: ["title", "description", "result"], image: AVATAR },
      { id: "bug_bounty", fields: ["title", "description", "result"], image: AVATAR },
      { id: "coffee_fresh", fields: ["title", "description", "result"], image: P("/coffe_fresh.jpg") },
    ],
    stats: ["stat1", "stat2", "stat3", "stat4"],
  },
  {
    key: "techstack", type: "section", component: "TechStackSection", order: 80,
    enabled: true, toggleable: true,
    fields: [],
    extra: {
      stack: [
        "React", "Next.js", "Node.js", "TypeScript", "Android", "iOS", "Three.js",
        "WebGL", "PostgreSQL", "Docker", "REST API", "UI/UX", "Tailwind CSS",
        "Framer Motion", "Firebase",
      ],
    },
  },
  {
    key: "process", type: "section", component: "ProcessSection", order: 90,
    enabled: true, toggleable: true,
    fields: ["title"],
    items: [
      { id: "idea", fields: ["title", "desc"] },
      { id: "design", fields: ["title", "desc"] },
      { id: "development", fields: ["title", "desc"] },
      { id: "launch", fields: ["title", "desc"] },
    ],
  },
  {
    key: "approach", type: "section", component: "ApproachSection", order: 100,
    enabled: true, toggleable: true,
    fields: ["title"],
    items: [
      { id: "innovation", fields: ["title", "body"] },
      { id: "precision", fields: ["title", "body"] },
      { id: "partnership", fields: ["title", "body"] },
    ],
  },
  {
    key: "team", type: "section", component: "TeamSection", order: 110,
    enabled: true, toggleable: true,
    fields: ["title", "subtitle"],
    items: [
      { id: "diyorbek", fields: ["name", "role", "specialty", "workplace", "experience", "quote", "about"], image: AVATAR },
      { id: "oybek", fields: ["name", "role", "specialty", "workplace", "experience", "quote", "about"], image: AVATAR },
      { id: "tursunjon", fields: ["name", "role", "specialty", "workplace", "experience", "quote", "about"], image: AVATAR },
      { id: "muhammadali", fields: ["name", "role", "specialty", "workplace", "experience", "quote", "about"], image: AVATAR },
    ],
  },
  {
    key: "contact", type: "section", component: "ContactSection", order: 120,
    enabled: true, toggleable: false,
    fields: ["title", "name", "phone", "service", "message", "submit", "success", "error", "trustLine"],
  },
  {
    key: "gallery", type: "section", component: "ParallaxGallerySection", order: 130,
    enabled: false, toggleable: true,
    fields: ["label", "title", "subtitle"],
    items: [
      { id: "item1", fields: ["title", "category"], image: AVATAR },
      { id: "item2", fields: ["title", "category"], image: AVATAR },
      { id: "item3", fields: ["title", "category"], image: AVATAR },
      { id: "item4", fields: ["title", "category"], image: AVATAR },
      { id: "item5", fields: ["title", "category"], image: AVATAR },
      { id: "item6", fields: ["title", "category"], image: AVATAR },
    ],
  },
  {
    key: "footer", type: "section", component: "CosmicFooter", order: 140,
    enabled: true, toggleable: false,
    fields: ["tagline", "rights", "ctaText", "ctaButton", "mudarris", "crmDemo", "ecosystem"],
  },

  // ── Singletons (global microcopy, editable, not toggleable/ordered) ──────
  {
    key: "nav", type: "singleton", order: 0, enabled: true, toggleable: false,
    fields: ["services", "process", "team", "contact", "portfolio", "gallery"],
  },
  {
    key: "trust", type: "singleton", order: 0, enabled: true, toggleable: false,
    fields: ["transparent", "milestones", "clarity", "support"],
  },
  {
    key: "modal", type: "singleton", order: 0, enabled: true, toggleable: false,
    fields: ["successTitle", "successMessage", "close"],
  },
  {
    key: "notFound", type: "singleton", order: 0, enabled: true, toggleable: false,
    fields: ["code", "title", "text", "home"],
  },
  {
    key: "cta", type: "singleton", order: 0, enabled: true, toggleable: false,
    fields: ["headline", "subtext", "button"],
  },
];

export const SECTION_KEYS = SECTION_REGISTRY.filter((s) => s.type === "section").map((s) => s.key);
export const SINGLETON_KEYS = SECTION_REGISTRY.filter((s) => s.type === "singleton").map((s) => s.key);
