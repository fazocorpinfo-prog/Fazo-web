import type { Collection } from "mongodb";
import { getDb } from "./mongo";
import type {
  ContentDoc,
  Lead,
  AnalyticsEvent,
  Admin,
  SiteSettings,
} from "@/lib/types/content";

export const COLLECTIONS = {
  content: "content",
  siteSettings: "site_settings",
  leads: "leads",
  analytics: "analytics_events",
  admins: "admins",
  auditLogs: "audit_logs",
} as const;

export async function contentCol(): Promise<Collection<ContentDoc>> {
  return (await getDb()).collection<ContentDoc>(COLLECTIONS.content);
}

export async function settingsCol(): Promise<Collection<SiteSettings>> {
  return (await getDb()).collection<SiteSettings>(COLLECTIONS.siteSettings);
}

export async function leadsCol(): Promise<Collection<Lead>> {
  return (await getDb()).collection<Lead>(COLLECTIONS.leads);
}

export async function analyticsCol(): Promise<Collection<AnalyticsEvent>> {
  return (await getDb()).collection<AnalyticsEvent>(COLLECTIONS.analytics);
}

export async function adminsCol(): Promise<Collection<Admin>> {
  return (await getDb()).collection<Admin>(COLLECTIONS.admins);
}
