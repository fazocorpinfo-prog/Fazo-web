"use client";
import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function ShootingStar() {
  const ref  = useRef<THREE.Mesh>(null);
  const [active, setActive] = useState(false);
  const progress = useRef(0);

  const startPos = useRef(new THREE.Vector3());
  const endPos   = useRef(new THREE.Vector3());

  const scheduleNext = () => {
    const delay = 8000 + Math.random() * 14000;
    setTimeout(() => {
      startPos.current.set(-30 + Math.random() * 20, 12 + Math.random() * 8, -5);
      endPos.current.set(startPos.current.x + 20 + Math.random() * 12, startPos.current.y - 8 - Math.random() * 4, -5);
      progress.current = 0;
      setActive(true);
    }, delay);
  };

  useEffect(() => { scheduleNext(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((_, delta) => {
    if (!active || !ref.current) return;
    progress.current += delta * 2.2;
    if (progress.current >= 1) { setActive(false); scheduleNext(); return; }
    ref.current.position.lerpVectors(startPos.current, endPos.current, progress.current);
    const opacity = Math.sin(progress.current * Math.PI);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.85;
  });

  if (!active) return null;
  return (
    <mesh ref={ref} position={startPos.current}>
      <planeGeometry args={[4, 0.04]} />
      <meshBasicMaterial color="#AAEEFF" transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}
