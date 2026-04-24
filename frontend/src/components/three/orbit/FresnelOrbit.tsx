"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";
import { SCENE } from "../config/heroScenePresets";

const FresnelMat = shaderMaterial(
  { uTime: 0, uPulse: 1.0 },
  `varying vec3 vNormal; varying vec3 vViewDir;
   void main(){
     vec4 mv=modelViewMatrix*vec4(position,1.);
     vNormal=normalize(normalMatrix*normal);
     vViewDir=normalize(-mv.xyz);
     gl_Position=projectionMatrix*mv;
   }`,
  `uniform float uTime; uniform float uPulse;
   varying vec3 vNormal; varying vec3 vViewDir;
   void main(){
     float fresnel=pow(1.-abs(dot(vNormal,vViewDir)),3.2);
     vec3 cyan=vec3(0.,0.76,1.)*uPulse;
     vec3 blue=vec3(0.,0.31,1.);
     gl_FragColor=vec4(mix(blue,cyan,fresnel)*fresnel,fresnel*0.92);
   }`
);
extend({ FresnelMat });

// eslint-disable-next-line @typescript-eslint/no-namespace
declare global { namespace JSX { interface IntrinsicElements { fresnelMat: Record<string, unknown> } } }

export function FresnelOrbit() {
  const matRef  = useRef<THREE.ShaderMaterial & { uTime: number; uPulse: number }>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const tilt    = (SCENE.orbit.tiltDeg * Math.PI) / 180;

  useFrame((_, delta) => {
    if (!matRef.current || !meshRef.current) return;
    matRef.current.uTime += delta;
    const t = matRef.current.uTime;
    // Pulse every 6s: sine with 6s period, mapped 1.0 → 1.15
    matRef.current.uPulse = 1 + SCENE.orbit.pulse.amplitude * 0.5 *
      (1 + Math.sin((t * 2 * Math.PI) / SCENE.orbit.pulse.period - Math.PI / 2));
    meshRef.current.rotation.y += delta * SCENE.orbit.speed;
  });

  return (
    <mesh ref={meshRef} rotation={[tilt, 0, 0.18]}>
      <torusGeometry args={[SCENE.orbit.radius, SCENE.orbit.tube, 48, 180]} />
      <fresnelMat ref={matRef} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}
