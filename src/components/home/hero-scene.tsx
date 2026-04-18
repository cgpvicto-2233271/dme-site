"use client";
// src/components/home/hero-scene.tsx — DA rouge/noir, élégant

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

/* Particules — rouges, peu denses, très subtiles */
function ParticleField() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 1200;
    const arr   = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r     = 5 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi) - 2;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.025;
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.01) * 0.05;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#dc2626"
        size={0.014}
        sizeAttenuation
        depthWrite={false}
        opacity={0.32}
      />
    </Points>
  );
}

/* Anneau unique — lent, élégant */
function Ring() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.07;
    ref.current.rotation.z = t * 0.04;
    ref.current.position.y = Math.sin(t * 0.25) * 0.12;
  });

  return (
    <mesh ref={ref} position={[0, 0, -1]}>
      <torusGeometry args={[2.6, 0.006, 8, 140]} />
      <meshBasicMaterial color="#dc2626" transparent opacity={0.18} />
    </mesh>
  );
}

/* Deuxième anneau — encore plus discret */
function Ring2() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = -t * 0.055;
    ref.current.rotation.y = t * 0.03;
    ref.current.position.y = Math.sin(t * 0.2 + 1) * 0.08;
  });

  return (
    <mesh ref={ref} position={[0, 0, -1]}>
      <torusGeometry args={[3.8, 0.004, 8, 140]} />
      <meshBasicMaterial color="#7f1d1d" transparent opacity={0.10} />
    </mesh>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[-2, 1, 2]} color="#dc2626" intensity={1.8} distance={14} />
      <ParticleField />
      <Ring />
      <Ring2 />
    </Canvas>
  );
}
