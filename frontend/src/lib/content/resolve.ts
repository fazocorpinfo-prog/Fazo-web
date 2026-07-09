import type { L10n, L10nList, Locale, ImageRef } from "@/lib/types/content";
import { DEFAULT_LOCALE } from "@/lib/types/content";

/** Resolve a localized string for the active locale, falling back to uz. */
export function pick(field: L10n | undefined | null, locale: Locale): string {
  if (!field) return "";
  return field[locale] || field[DEFAULT_LOCALE] || field.uz || "";
}

/** Resolve a localized list (e.g. typewriterPhrases) for the active locale. */
export function pickList(field: L10nList | undefined | null, locale: Locale): string[] {
  if (!field) return [];
  return field.map((f) => pick(f, locale));
}

/** Resolve an image URL: uploaded media wins, else the legacy /public path. */
export function mediaUrl(image: ImageRef | undefined | null): string | null {
  if (!image) return null;
  if (image.mediaId) return `/api/media/${image.mediaId}`;
  return image.legacySrc || null;
}
