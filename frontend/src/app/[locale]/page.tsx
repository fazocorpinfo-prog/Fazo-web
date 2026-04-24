import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { HeroSection }       from "@/components/sections/HeroSection";
import { ManifestoSection }  from "@/components/sections/ManifestoSection";
import { ServicesSection }   from "@/components/sections/ServicesSection";
import { PositioningBlock }  from "@/components/sections/PositioningBlock";
import { WhyFazoSection }   from "@/components/sections/WhyFazoSection";
import { ApproachSection }   from "@/components/sections/ApproachSection";
import { TeamSection }       from "@/components/sections/TeamSection";
import { ContactSection }    from "@/components/sections/ContactSection";

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

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      {/* 1. HERO — pinned scale-down */}
      <HeroSection />

      {/* 2. MANIFESTO — pinned word reveal */}
      <ManifestoSection />

      {/* 3. XIZMATLAR — horizontal scroll */}
      <ServicesSection />

      {/* 4. FLOATING CONTENT */}
      <FloatingContentSection />

      {/* 5. POZITSIYA va NIMA UCHUN FAZO */}
      <PositioningBlock />
      <WhyFazoSection />

      {/* 6. PORTFOLIO — horizontal scroll */}
      <PortfolioSection />

      {/* 7. PARALLAX GALEREYA */}
      <ParallaxGallerySection />

      {/* 8. TEXNOLOGIYALAR */}
      <TechStackSection />

      {/* 9. JARAYON */}
      <ProcessSection />

      {/* 10. YONDASHUV */}
      <ApproachSection />

      {/* 11. JAMOA */}
      <TeamSection />

      {/* 12. ALOQA */}
      <ContactSection />
    </>
  );
}
