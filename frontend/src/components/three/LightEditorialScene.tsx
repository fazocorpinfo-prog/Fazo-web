"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SCENE } from "./config/heroScenePresets";
import { HeroCameraRig } from "./camera/HeroCameraRig";

function SoftRadialDepth() {
  return (
    <mesh position={[0, 0, -4]}>
      <planeGeometry args={[40, 40]} />
      <meshBasicMaterial color="#C8DEFF" transparent opacity={0.05} depthWrite={false} />
    </mesh>
  );
}

function GlassOrbitRing() {
  const ref  = useRef<THREE.Mesh>(null);
  const tilt = (SCENE.orbit.tiltDeg * Math.PI) / 180;
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * SCENE.orbit.speed;
  });
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0.18]}>
      <torusGeometry args={[SCENE.orbit.radius, SCENE.orbit.tube * 1.4, 48, 180]} />
      <meshStandardMaterial
        color="#0066AA"
        transparent opacity={0.28}
        roughness={0.1} metalness={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function LightEditorialScene() {
  return (
    <>
      <SoftRadialDepth />
      <GlassOrbitRing />
      <HeroCameraRig />
    </>
  );
}
