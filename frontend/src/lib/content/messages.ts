import type { AbstractIntlMessages } from "next-intl";
import type { ContentDoc, L10n, Locale, SiteSettings } from "@/lib/types/content";
import { pick } from "./resolve";
import { SECTION_REGISTRY } from "./registry";
import { getRawContent } from "./store";

const REGISTRY_BY_KEY = Object.fromEntries(SECTION_REGISTRY.map((s) => [s.key, s]));

function setPath(root: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split(".");
  let cur: Record<string, unknown> | unknown[] = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    const nextIsIndex = /^\d+$/.test(parts[i + 1]);
    const container = cur as Record<string, unknown>;
    const key = /^\d+$/.test(k) ? Number(k) : k;
    if ((container as Record<string | number, unknown>)[key] == null) {
      (container as Record<string | number, unknown>)[key] = nextIsIndex ? [] : {};
    }
    cur = (container as Record<string | number, unknown>)[key] as Record<string, unknown> | unknown[];
  }
  const last = parts[parts.length - 1];
  (cur as Record<string | number, unknown>)[/^\d+$/.test(last) ? Number(last) : last] = value;
}

/** Reconstruct the next-intl message tree for a locale from Mongo content docs. */
function reconstruct(docs: ContentDoc[], settings: SiteSettings | null, locale: Locale): AbstractIntlMessages {
  const messages: Record<string, Record<string, unknown>> = {};

  for (const doc of docs) {
    const ns: Record<string, unknown> = {};

    for (const [field, value] of Object.entries(doc.fields || {})) {
      ns[field] = Array.isArray(value)
        ? value.map((v) => pick(v as L10n, locale))
        : pick(value as L10n, locale);
    }

    for (const item of doc.items || []) {
      const reg = REGISTRY_BY_KEY[doc.key]?.items?.find((r) => r.id === item.id);
      const path = reg?.path ?? item.id;
      const obj: Record<string, string> = {};
      for (const [f, v] of Object.entries(item.fields || {})) obj[f] = pick(v as L10n, locale);
      setPath(ns, path, obj);
    }

    for (const stat of doc.stats || []) {
      ns[stat.id] = { value: pick(stat.value, locale), label: pick(stat.label, locale) };
    }

    messages[doc.key] = ns;
  }

  // Footer phones/socials are canonical in site_settings, but components read them
  // via useTranslations("footer") — inject them back into the footer namespace.
  if (settings && messages.footer) {
    messages.footer.phone1 = settings.contact?.phone1 ?? "";
    messages.footer.phone2 = settings.contact?.phone2 ?? "";
    messages.footer.telegram = settings.socials?.telegram ?? "";
    messages.footer.instagram = settings.socials?.instagram ?? "";
    messages.footer.youtube = settings.socials?.youtube ?? "";
  }

  return messages as AbstractIntlMessages;
}

/** Build messages from Mongo. Returns null if unavailable (caller falls back to JSON). */
export async function buildMessagesFromDb(locale: Locale): Promise<AbstractIntlMessages | null> {
  try {
    const { docs, settings } = await getRawContent();
    if (!docs || docs.length === 0) return null;
    const messages = reconstruct(docs, settings, locale);
    // sanity: hero must exist, else treat as unusable and fall back
    if (!(messages as Record<string, unknown>).hero) return null;
    return messages;
  } catch {
    return null;
  }
}
