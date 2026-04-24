"use client";
import { motion } from "framer-motion";
import { CosmicCarousel } from "@/components/ui/CosmicCarousel";

const STACK = [
  "React", "Next.js", "Node.js", "TypeScript", "Android", "iOS",
  "Three.js", "WebGL", "PostgreSQL", "Docker", "REST API", "UI/UX",
  "Tailwind CSS", "Framer Motion", "Firebase",
];

const DOUBLED = [...STACK, ...STACK];

export function TechStackSection() {
  return (
    <section
      id="tech-stack"
      className="relative overflow-hidden py-14"
      style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}
    >
      <CosmicCarousel>
        <div className="marquee-track marquee-animate">
          {DOUBLED.map((item, i) => (
            <div key={i} className="mx-8 flex items-center gap-3 whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-cyan)] opacity-50" />
              <motion.span
                className="font-orbitron text-sm font-semibold tracking-widest text-[var(--text-secondary)]"
                whileHover={{ color: "var(--accent-cyan)" }}
              >
                {item}
              </motion.span>
            </div>
          ))}
        </div>
      </CosmicCarousel>
    </section>
  );
}
