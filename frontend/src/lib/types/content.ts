import type { ObjectId } from "mongodb";

export const LOCALES = ["uz", "ru", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "uz";

export type Project = "fazo" | "mudarris";

/** Field-major localized string. `uz` is required; ru/en fall back to uz. */
export type L10n = { uz: string; ru?: string; en?: string };
export type L10nList = L10n[];

export type ImageRef = {
  mediaId: string | null;
  legacySrc?: string | null;
  alt?: L10n;
};

export type ContentItem = {
  id: string;
  order: number;
  enabled: boolean;
  image?: ImageRef;
  meta?: Record<string, unknown>;
  fields: Record<string, L10n | L10nList>;
};

export type ContentStat = {
  id: string;
  value: L10n;
  label: L10n;
};

export type ContentDoc = {
  _id?: ObjectId;
  key: string;
  type: "section" | "singleton";
  enabled: boolean;
  order: number;
  fields: Record<string, L10n | L10nList>;
  items: ContentItem[];
  stats: ContentStat[];
  extra: Record<string, unknown>;
  updatedAt: Date;
  updatedBy: string;
};

export type LeadStatus = "new" | "in_review" | "contacted" | "closed" | "spam";

export type Lead = {
  _id?: ObjectId;
  project: Project;
  name: string;
  phone: string;
  service: string;
  message: string | null;
  source: string;
  status: LeadStatus;
  notes: string | null;
  locale: string;
  ip: string | null;
  userAgent: string | null;
  telegramDelivered: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type DeviceKind = "desktop" | "mobile" | "tablet" | "unknown";

export type AnalyticsEvent = {
  _id?: ObjectId;
  type: "pageview" | "event";
  project: Project;
  path: string;
  referrer: string | null;
  locale: string | null;
  sessionId: string | null;
  device: DeviceKind;
  country: string | null;
  name: string | null;
  props: Record<string, unknown> | null;
  ip: string | null;
  userAgent: string | null;
  createdAt: Date;
};

export type AdminRole = "superadmin" | "editor" | "viewer";

export type Admin = {
  _id?: ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt: Date | null;
};

export type SiteSettings = {
  _id: "global";
  brand: { name: string; logo: ImageRef };
  defaultLocale: Locale;
  locales: Locale[];
  contact: { phone1: string; phone2: string; email: string };
  socials: { telegram: string; instagram: string; youtube: string };
  seo: { title: L10n; description: L10n; ogImage: ImageRef };
  nav: { order: string[] };
  updatedAt: Date;
  updatedBy: string;
};
