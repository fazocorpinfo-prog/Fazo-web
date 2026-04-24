"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SCENE } from "../config/heroScenePresets";

export function DustField() {
  const ref = useRef<THREE.Points>(null);
  const count = SCENE.dust.count() as number;

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.006;
  });

  if (count < 1) return null;
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.06} color="#88CCFF" transparent opacity={0.28} depthWrite={false} sizeAttenuation />
    </points>
  );
}
