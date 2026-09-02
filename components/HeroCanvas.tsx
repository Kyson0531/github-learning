"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Ptr = React.MutableRefObject<{ x: number; y: number }>;

const FIBER_COLORS = ["#5eead4", "#60a5fa", "#a78bfa", "#5eead4", "#60a5fa"];

function makeCableCurve(seed: number, index: number): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  const n = 8;
  const baseAngle = (index / 5) * Math.PI * 2;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const y = -2.4 + t * 4.8;
    const swirl = baseAngle + t * Math.PI * 1.4 + seed * 0.4;
    const r = 1.1 + Math.sin(t * Math.PI) * 1.6 + (seed % 3) * 0.25;
    pts.push(
      new THREE.Vector3(
        Math.cos(swirl) * r + Math.sin(seed + t * 3) * 0.35,
        y,
        Math.sin(swirl) * r + Math.cos(seed + t * 2) * 0.35
      )
    );
  }
  return new THREE.CatmullRomCurve3(pts);
}

function FiberCable({
  curve,
  color,
  speed,
}: {
  curve: THREE.CatmullRomCurve3;
  color: string;
  speed: number;
}) {
  const glowRef = useRef<THREE.Mesh>(null);
  const glow2Ref = useRef<THREE.Mesh>(null);
  const tubeGeo = useMemo(
    () => new THREE.TubeGeometry(curve, 64, 0.012, 6, false),
    [curve]
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const u = (t * speed) % 1;
    const u2 = (t * speed * 0.7 + 0.45) % 1;
    const p = curve.getPointAt(u);
    const p2 = curve.getPointAt(u2);
    if (glowRef.current) glowRef.current.position.copy(p);
    if (glow2Ref.current) glow2Ref.current.position.copy(p2);
  });

  return (
    <group>
      <mesh geometry={tubeGeo}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.22}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={glow2Ref}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 280;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#5eead4"),
      new THREE.Color("#60a5fa"),
      new THREE.Color("#a78bfa"),
      new THREE.Color("#fbbf24"),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const u = Math.random();
      const v = Math.random();
      const w = Math.random();
      const r = Math.pow(u, 0.55) * 3.6;
      const theta = v * Math.PI * 2;
      const y = (w - 0.5) * 5.2;
      positions[i3] = Math.cos(theta) * r * (0.7 + Math.random() * 0.5);
      positions[i3 + 1] = y;
      positions[i3 + 2] = Math.sin(theta) * r * (0.7 + Math.random() * 0.5);

      const c = palette[i % palette.length];
      const dim = 0.45 + Math.random() * 0.55;
      colors[i3] = c.r * dim;
      colors[i3 + 1] = c.g * dim;
      colors[i3 + 2] = c.b * dim;
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.04;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Scene({ pointer }: { pointer: Ptr }) {
  const root = useRef<THREE.Group>(null);
  const smoothed = useRef({ x: 0, y: 0 });

  const cables = useMemo(
    () =>
      FIBER_COLORS.map((color, i) => ({
        curve: makeCableCurve(i * 1.7 + 0.3, i),
        color,
        speed: 0.12 + i * 0.035,
      })),
    []
  );

  useFrame((_, delta) => {
    const s = smoothed.current;
    const lerp = 1 - Math.exp(-delta * 4.5);
    s.x += (pointer.current.x - s.x) * lerp;
    s.y += (pointer.current.y - s.y) * lerp;

    if (root.current) {
      root.current.rotation.y = s.x * 0.28;
      root.current.rotation.x = s.y * 0.16;
      root.current.position.x = s.x * 0.35;
      root.current.position.y = s.y * 0.2;
    }
  });

  return (
    <group ref={root}>
      <ParticleField />
      {cables.map((c, i) => (
        <FiberCable key={i} curve={c.curve} color={c.color} speed={c.speed} />
      ))}
      <ambientLight intensity={0.15} />
    </group>
  );
}

function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0.15, 5.4);
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
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  if (reduced) {
    return (
      <div
        ref={containerRef}
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_rgba(94,234,212,0.14),_transparent_55%),radial-gradient(ellipse_at_80%_20%,_rgba(96,165,250,0.12),_transparent_42%),radial-gradient(ellipse_at_20%_80%,_rgba(167,139,250,0.08),_transparent_40%)]"
        aria-hidden
      />
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10" aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={visible ? "always" : "never"}
        camera={{ fov: 45, near: 0.1, far: 50 }}
      >
        <color attach="background" args={["#07080b"]} />
        <fog attach="fog" args={["#07080b", 4.5, 14]} />
        <CameraRig />
        <Scene pointer={pointer} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,8,11,0.35)_70%,rgba(7,8,11,0.85)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/30 via-transparent to-ink-950" />
    </div>
  );
}
