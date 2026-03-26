"use client";
import { useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { useTheme } from "next-themes";
import { DarkCinematicScene } from "./DarkCinematicScene";
import { LightEditorialScene } from "./LightEditorialScene";
import { SCENE } from "./config/heroScenePresets";

export function HeroScene() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Stop rendering when hero is not visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const isLight = resolvedTheme === "light";
  const bgColor = isLight ? "#F8FAFF" : "#0B0324";

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, SCENE.camera.z], fov: SCENE.camera.fov }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        frameloop={visible ? "always" : "never"}
      >
        <color attach="background" args={[bgColor]} />
        {mounted && (isLight ? <LightEditorialScene /> : <DarkCinematicScene />)}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Canvas>
    </div>
  );
}
