"use client";
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function HeroCameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const startZ = 66;
  const targetZ = 62;
  const elapsed = useRef(0);

  useEffect(() => {
    camera.position.z = startZ;
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [camera]);

  useFrame((_, delta) => {
    elapsed.current += delta;
    // Push-in on load
    const pushIn = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.018);
    // Breathing zoom
    const breath = Math.sin(elapsed.current * 0.4) * 0.15;
    camera.position.z = pushIn + breath;
    // Mouse parallax capped at 3%
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.current.x * 1.8, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -mouse.current.y * 1.0, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
