"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

const NebulaMat = shaderMaterial(
  { uTime: 0 },
  /* vertex */ `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.); }`,
  /* fragment */ `
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p){
    vec2 i=floor(p), f=fract(p);
    f=f*f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
               mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  float fbm(vec2 p){
    float v=0.; float a=.5;
    for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.1; a*=.5; }
    return v;
  }

  void main(){
    vec2 uv=vUv-0.5;
    float t=uTime*0.025;
    float n=fbm(uv*2.4+t);
    float n2=fbm(uv*1.6-t*0.7+n*0.4);

    vec3 c1=vec3(0.04,0.01,0.14); // deep navy
    vec3 c2=vec3(0.08,0.04,0.22); // mid purple
    vec3 c3=vec3(0.,0.12,0.18);   // subtle cyan tint
    vec3 col=mix(c1,c2,n2);
    col=mix(col,c3,fbm(uv*3.+n)*0.25);
    float vignette=1.-smoothstep(0.3,0.9,length(uv));
    col*=vignette;
    gl_FragColor=vec4(col,1.);
  }`
);

extend({ NebulaMat });

// eslint-disable-next-line @typescript-eslint/no-namespace
declare global { namespace JSX { interface IntrinsicElements { nebulaMat: Record<string, unknown> } } }

export function NebulaPlane() {
  const matRef = useRef<THREE.ShaderMaterial & { uTime: number }>(null);
  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uTime += delta;
  });
  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <nebulaMat ref={matRef} depthTest={false} depthWrite={false} />
    </mesh>
  );
}
