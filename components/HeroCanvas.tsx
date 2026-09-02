"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function FiberField({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const count = 420;

  const { positions, colors, linePositions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const linePositions = new Float32Array(count * 6);
    const palette = [
      new THREE.Color("#5eead4"),
      new THREE.Color("#60a5fa"),
      new THREE.Color("#a78bfa"),
      new THREE.Color("#fbbf24"),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = 1.2 + Math.random() * 3.8;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 4.2;
      positions[i3] = Math.cos(theta) * r;
      positions[i3 + 1] = y;
      positions[i3 + 2] = Math.sin(theta) * r;

      const c = palette[i % palette.length];
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;

      const l = i * 6;
      linePositions[l] = positions[i3];
      linePositions[l + 1] = positions[i3 + 1];
      linePositions[l + 2] = positions[i3 + 2];
      linePositions[l + 3] = positions[i3] * 0.35;
      linePositions[l + 4] = positions[i3 + 1] * 0.2;
      linePositions[l + 5] = positions[i3 + 2] * 0.35;
    }
    return { positions, colors, linePositions };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const px = pointer.current.x;
    const py = pointer.current.y;

    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.08 + px * 0.35;
      pointsRef.current.rotation.x = py * 0.2;
      pointsRef.current.position.x = px * 0.4;
      pointsRef.current.position.y = py * 0.25;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = t * 0.05 + px * 0.25;
      linesRef.current.rotation.x = py * 0.15;
      linesRef.current.position.x = px * 0.3;
      linesRef.current.position.y = py * 0.18;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#5eead4"
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      <ambientLight intensity={0.2} />
    </>
  );
}

function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0, 5.2);
  }, [camera]);
  return null;
}

export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointer.current = { x, y };
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  if (reduced) {
    return (
      <div
        ref={containerRef}
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_rgba(94,234,212,0.12),_transparent_55%),radial-gradient(ellipse_at_80%_20%,_rgba(96,165,250,0.1),_transparent_40%)]"
        aria-hidden
      />
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={visible ? "always" : "never"}
        camera={{ fov: 45, near: 0.1, far: 50 }}
      >
        <color attach="background" args={["#07080b"]} />
        <CameraRig />
        <FiberField pointer={pointer} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/20 via-transparent to-ink-950" />
    </div>
  );
}
