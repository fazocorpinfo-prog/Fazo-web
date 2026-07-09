import { SECTION_REGISTRY } from "./registry";
import { getRawContent } from "./store";

// Homepage sections in default order (footer is rendered in the layout, not the page).
const DEFAULT_SECTION_ORDER = SECTION_REGISTRY.filter(
  (s) => s.type === "section" && s.key !== "footer" && s.enabled
)
  .sort((a, b) => a.order - b.order)
  .map((s) => s.key);

/** Enabled homepage section keys in order, from Mongo — falls back to the registry default. */
export async function getEnabledSectionKeys(): Promise<string[]> {
  try {
    const { docs } = await getRawContent();
    const keys = docs
      .filter((d) => d.type === "section" && d.enabled && d.key !== "footer")
      .sort((a, b) => a.order - b.order)
      .map((d) => d.key);
    return keys.length ? keys : DEFAULT_SECTION_ORDER;
  } catch {
    return DEFAULT_SECTION_ORDER;
  }
}
