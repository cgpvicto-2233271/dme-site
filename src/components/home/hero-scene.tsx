"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Points, PointMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useScroll } from "framer-motion";
import * as THREE from "three";

function TacticalConstellation() {
  const group = useRef<THREE.Group>(null);
  const points = useRef<THREE.Points>(null);
  const { scrollYProgress } = useScroll();

  const positions = useMemo(() => {
    const count = 96;
    const arr = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const lane = index % 6;
      const row = Math.floor(index / 6);
      arr[index * 3] = (lane - 2.5) * 0.82 + Math.sin(row * 1.4) * 0.22;
      arr[index * 3 + 1] = (row - 8) * 0.34;
      arr[index * 3 + 2] = -1.4 - Math.cos(index * 0.7) * 1.8;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const scroll = scrollYProgress.get();
    if (group.current) {
      group.current.rotation.y = -0.36 + Math.sin(elapsed * 0.18) * 0.045 + scroll * 0.22;
      group.current.rotation.x = -0.08 + Math.cos(elapsed * 0.12) * 0.025;
      group.current.position.x = 1.15 - scroll * 0.35;
    }
    if (points.current?.material instanceof THREE.PointsMaterial) {
      points.current.material.opacity = Math.max(0.08, 0.42 - scroll * 0.32);
    }
  });

  return (
    <group ref={group}>
      <Points ref={points} positions={positions} stride={3}>
        <PointMaterial
          transparent
          color="#ef4444"
          size={0.045}
          sizeAttenuation
          depthWrite={false}
          opacity={0.42}
        />
      </Points>
      {[-1.65, -0.82, 0, 0.82, 1.65].map((x) => (
        <Line
          key={x}
          points={[
            [x, -3.1, -1.4],
            [x + 0.28, 3.0, -2.2],
          ]}
          color="rgba(255,255,255,0.16)"
          lineWidth={0.75}
          transparent
          opacity={0.32}
        />
      ))}
      {[0.95, 1.65, 2.35].map((radius, index) => (
        <mesh key={radius} position={[0, -0.15, -1.9]} rotation={[1.2 + index * 0.16, 0.12, 0.12]}>
          <torusGeometry args={[radius, 0.004, 6, 180]} />
          <meshBasicMaterial color={index === 0 ? "#ef4444" : "#ffffff"} transparent opacity={index === 0 ? 0.32 : 0.1} />
        </mesh>
      ))}
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.2], fov: 45 }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 1.35]}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[2.2, 0.2, 2.4]} color="#ef4444" intensity={1.5} distance={8} />
      <TacticalConstellation />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.18} luminanceThreshold={0.55} luminanceSmoothing={0.8} mipmapBlur />
        <Vignette eskil={false} offset={0.22} darkness={0.7} />
      </EffectComposer>
    </Canvas>
  );
}
