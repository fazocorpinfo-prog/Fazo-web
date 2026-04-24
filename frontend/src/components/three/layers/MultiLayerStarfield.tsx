"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";
import { SCENE } from "../config/heroScenePresets";

const StarMat = shaderMaterial(
  { uTime: 0, uSize: 1.0, uOpacity: 1.0 },
  `attribute float aPhase;
   varying float vPhase;
   uniform float uTime; uniform float uSize;
   void main(){
     vPhase=aPhase;
     vec4 mv=modelViewMatrix*vec4(position,1.);
     gl_PointSize=uSize*(300./-mv.z);
     gl_Position=projectionMatrix*mv;
   }`,
  `uniform float uTime; uniform float uOpacity;
   varying float vPhase;
   void main(){
     float d=length(gl_PointCoord-.5)*2.;
     if(d>1.) discard;
     float tw=0.5+0.5*sin(uTime*1.2+vPhase*6.28);
     gl_FragColor=vec4(0.7,0.9,1.0,uOpacity*tw*(1.-d));
   }`
);

extend({ StarMat });

// eslint-disable-next-line @typescript-eslint/no-namespace
declare global { namespace JSX { interface IntrinsicElements { starMat: Record<string, unknown> } } }

type LayerCfg = { count: number; spread: number; size: number; opacity: number; speedMul: number };

function StarLayer({ count, spread, size, opacity, speedMul }: LayerCfg) {
  const matRef = useRef<THREE.ShaderMaterial & { uTime: number; uSize: number; uOpacity: number }>(null);
  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph  = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi   = 2 * Math.PI * Math.random();
      const r     = spread * (0.5 + Math.random() * 0.5);
      pos[i * 3]     = r * Math.sin(theta) * Math.cos(phi);
      pos[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = r * Math.cos(theta);
      ph[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, phases: ph };
  }, [count, spread]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aPhase",   new THREE.BufferAttribute(phases, 1));
    return g;
  }, [positions, phases]);

  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uTime += delta * speedMul;
  });

  return (
    <points geometry={geo} rotation={[0, 0, 0]}>
      <starMat ref={matRef} uSize={size} uOpacity={opacity} transparent depthWrite={false} />
    </points>
  );
}

export function MultiLayerStarfield() {
  const farCount  = SCENE.stars.far.count()  as number;
  const midCount  = SCENE.stars.mid.count()  as number;
  const nearCount = SCENE.stars.near.count() as number;
  return (
    <>
      <StarLayer count={farCount}  spread={80} size={SCENE.stars.far.size}  opacity={0.55} speedMul={0.6} />
      <StarLayer count={midCount}  spread={55} size={SCENE.stars.mid.size}  opacity={0.70} speedMul={0.9} />
      {nearCount > 0 && (
        <StarLayer count={nearCount} spread={32} size={SCENE.stars.near.size} opacity={0.85} speedMul={1.2} />
      )}
    </>
  );
}
