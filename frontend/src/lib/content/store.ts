import { unstable_cache } from "next/cache";
import { contentCol, settingsCol } from "@/lib/db/collections";
import type { ContentDoc, SiteSettings } from "@/lib/types/content";

export const CONTENT_TAG = "content";

export type RawContent = { docs: ContentDoc[]; settings: SiteSettings | null };

/**
 * Cached raw content fetch. Revalidated on a 60s window OR on demand via
 * revalidateTag(CONTENT_TAG) when an admin saves. Throws if Mongo is unreachable
 * — callers must catch and fall back to the bundled i18n JSON.
 */
export const getRawContent = unstable_cache(
  async (): Promise<RawContent> => {
    const [content, settings] = await Promise.all([contentCol(), settingsCol()]);
    const [docs, site] = await Promise.all([
      content.find({}, { projection: { _id: 0 } }).sort({ order: 1 }).toArray(),
      settings.findOne({ _id: "global" }, { projection: { _id: 0 } }),
    ]);
    return { docs: docs as ContentDoc[], settings: (site as SiteSettings | null) ?? null };
  },
  ["fazo-raw-content"],
  { tags: [CONTENT_TAG], revalidate: 60 }
);
