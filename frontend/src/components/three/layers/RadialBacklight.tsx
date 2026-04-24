"use client";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

const RadialMat = shaderMaterial(
  { uColor: new THREE.Color("#00C2FF"), uOpacity: 0.18 },
  `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  `uniform vec3 uColor; uniform float uOpacity; varying vec2 vUv;
   void main(){
     float d=length(vUv-.5)*2.;
     float a=uOpacity*smoothstep(1.,0.,d);
     gl_FragColor=vec4(uColor,a);
   }`
);
extend({ RadialMat });

// eslint-disable-next-line @typescript-eslint/no-namespace
declare global { namespace JSX { interface IntrinsicElements { radialMat: Record<string, unknown> } } }

export function RadialBacklight() {
  return (
    <mesh position={[0, 0, -2]}>
      <planeGeometry args={[22, 22]} />
      <radialMat uOpacity={0.18} transparent depthWrite={false} />
    </mesh>
  );
}
