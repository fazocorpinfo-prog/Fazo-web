import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { CosmicFooter } from "@/components/layout/CosmicFooter";
import { ScrollAmbientProvider } from "@/components/providers/ScrollAmbientProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { ContactModalProvider } from "@/contexts/ContactModalContext";
import { ContactModalHost } from "@/components/providers/ContactModalHost";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ContactModalProvider>
        <SmoothScrollProvider />
        <CustomCursor />
        <ScrollAmbientProvider />
        <ScrollIndicator />
        <ContactModalHost />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <CosmicFooter />
        </div>
      </ContactModalProvider>
    </NextIntlClientProvider>
  );
}
