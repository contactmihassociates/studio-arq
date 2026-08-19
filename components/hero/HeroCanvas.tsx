"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useMouse } from "@/lib/mouse";

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uAspect;
  varying vec2 vUv;

  // Simplex 2D noise (Ashima Arts)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                   + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                             dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x2 = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x2) - 0.5;
    vec3 ox = floor(x2 + 0.5);
    vec3 a0 = x2 - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x   + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;

    // Multi-octave fluid noise
    float t = uTime;
    float n1 = snoise(uv * 1.8 + vec2(t * 0.07,  t * 0.05));
    float n2 = snoise(uv * 3.5 + vec2(-t * 0.05, t * 0.08) + 100.0);
    float n3 = snoise(uv * 7.0 + vec2(t * 0.04, -t * 0.06) - 50.0);
    float noise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

    // Mouse glow — aspect-corrected distance
    vec2 uvA = vec2(uv.x * uAspect, uv.y);
    vec2 mA  = vec2(uMouse.x * uAspect, 1.0 - uMouse.y);
    float md = length(uvA - mA);
    float glow = smoothstep(0.45, 0.0, md) * 0.45;
    noise += glow;

    // Map to three-tone gradient
    vec3 navy  = vec3(0.051, 0.106, 0.165); // #0D1B2A
    vec3 mid   = vec3(0.094, 0.231, 0.373); // #183B5F
    vec3 cream = vec3(0.957, 0.945, 0.925); // #F4F1EC

    float t1 = smoothstep(-0.4, 0.2, noise);
    float t2 = smoothstep(0.2,  0.9, noise);
    vec3 color = mix(navy, mid, t1);
    color = mix(color, cream, t2);

    // Soft vignette
    float vd = length((uv - 0.5) * vec2(uAspect, 1.0)) * 1.1;
    float vign = 1.0 - smoothstep(0.5, 1.3, vd);
    color = mix(navy * 0.7, color, clamp(vign * 0.9 + 0.1, 0.0, 1.0));

    gl_FragColor = vec4(color, 1.0);
  }
`;

function LiquidMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uAspect: { value: 1 },
    }),
    []
  );

  useFrame(({ clock }) => {
    const mat = meshRef.current?.material as THREE.ShaderMaterial | undefined;
    if (!mat) return;
    mat.uniforms.uTime.value = clock.elapsedTime;
    const { x, y } = useMouse.getState();
    mat.uniforms.uMouse.value.set(x, y);
    mat.uniforms.uAspect.value = viewport.width / viewport.height;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      className="absolute inset-0 w-full h-full"
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <LiquidMesh />
    </Canvas>
  );
}
