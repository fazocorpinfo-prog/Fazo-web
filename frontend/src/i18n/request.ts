import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { hasLocale } from "next-intl";
import { buildMessagesFromDb } from "@/lib/content/messages";
import type { Locale } from "@/lib/types/content";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  // Content comes from MongoDB (admin-editable). Falls back to the bundled
  // JSON if the database is unreachable, so the site never breaks.
  const dbMessages = await buildMessagesFromDb(locale as Locale);
  const messages = dbMessages ?? (await import(`../../messages/${locale}.json`)).default;

  return { locale, messages };
});
