import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { HeroSection }       from "@/components/sections/HeroSection";
import { ManifestoSection }  from "@/components/sections/ManifestoSection";
import { ServicesSection }   from "@/components/sections/ServicesSection";
import { PositioningBlock }  from "@/components/sections/PositioningBlock";
import { WhyFazoSection }    from "@/components/sections/WhyFazoSection";
import { ApproachSection }   from "@/components/sections/ApproachSection";
import { TeamSection }       from "@/components/sections/TeamSection";
import { ContactSection }    from "@/components/sections/ContactSection";
import { getEnabledSectionKeys } from "@/lib/content/server";

const TechStackSection = dynamic(
  () => import("@/components/sections/TechStackSection").then((m) => ({ default: m.TechStackSection })),
  { loading: () => <section className="py-14" /> }
);
const ProcessSection = dynamic(
  () => import("@/components/sections/ProcessSection").then((m) => ({ default: m.ProcessSection })),
  { loading: () => <section className="py-20" /> }
);
const PortfolioSection = dynamic(
  () => import("@/components/sections/PortfolioSection").then((m) => ({ default: m.PortfolioSection })),
  { loading: () => <section className="py-20" /> }
);
const FloatingContentSection = dynamic(
  () => import("@/components/sections/FloatingContentSection").then((m) => ({ default: m.FloatingContentSection })),
  { loading: () => <section className="py-20" /> }
);
const ParallaxGallerySection = dynamic(
  () => import("@/components/sections/ParallaxGallerySection").then((m) => ({ default: m.ParallaxGallerySection })),
  { loading: () => <section className="py-20" /> }
);

// section key → component. Sections toggled/reordered from the admin panel take
// effect here because the render list comes from Mongo (getEnabledSectionKeys).
const COMPONENTS: Record<string, ComponentType> = {
  hero: HeroSection,
  manifesto: ManifestoSection,
  services: ServicesSection,
  floating: FloatingContentSection,
  positioning: PositioningBlock,
  why: WhyFazoSection,
  portfolio: PortfolioSection,
  techstack: TechStackSection,
  process: ProcessSection,
  approach: ApproachSection,
  team: TeamSection,
  contact: ContactSection,
  gallery: ParallaxGallerySection,
};

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const keys = await getEnabledSectionKeys();

  return (
    <>
      {keys.map((key) => {
        const Section = COMPONENTS[key];
        return Section ? <Section key={key} /> : null;
      })}
    </>
  );
}
