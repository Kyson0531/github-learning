"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

type Ptr = React.MutableRefObject<{ x: number; y: number }>;

/** Clear refractive glass — product photography clarity */
const GLASS = {
  transmission: 1,
  thickness: 0.72,
  ior: 1.4,
  chromaticAberration: 0.016,
  anisotropy: 0.015,
  roughness: 0.035,
  metalness: 0.015,
  clearcoat: 1,
  clearcoatRoughness: 0.06,
  distortion: 0.1,
  distortionScale: 0.2,
  temporalDistortion: 0.015,
  samples: 8,
  resolution: 640,
} as const;

function isCoarsePointer() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768
  );
}

/** Soft pastel mesh for refraction — product backdrop, not a second hero */
function PastelBackdrop() {
  const texture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    const g = ctx.createLinearGradient(0, 0, size, size);
    g.addColorStop(0, "#F5F5F7");
    g.addColorStop(0.3, "#E6EFFA");
    g.addColorStop(0.55, "#F4E8F1");
    g.addColorStop(0.8, "#E8F4F0");
    g.addColorStop(1, "#F5F5F7");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    const blobs: Array<{
      x: number;
      y: number;
      r: number;
      color: string;
    }> = [
      { x: 0.35, y: 0.28, r: 0.42, color: "rgba(170, 205, 255, 0.58)" },
      { x: 0.68, y: 0.32, r: 0.38, color: "rgba(255, 200, 220, 0.48)" },
      { x: 0.5, y: 0.62, r: 0.45, color: "rgba(190, 230, 220, 0.5)" },
      { x: 0.22, y: 0.68, r: 0.32, color: "rgba(220, 210, 255, 0.4)" },
      { x: 0.78, y: 0.7, r: 0.34, color: "rgba(255, 230, 190, 0.42)" },
    ];

    for (const b of blobs) {
      const cx = b.x * size;
      const cy = b.y * size;
      const radius = b.r * size;
      const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      rg.addColorStop(0, b.color);
      rg.addColorStop(1, "rgba(245, 245, 247, 0)");
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, []);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  return (
    <mesh position={[0, -0.55, -2.4]} scale={[7.2, 5.2, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function GlassLens({
  pointer,
  mobile,
}: {
  pointer: Ptr;
  mobile: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const smoothed = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const s = smoothed.current;
    const lerp = 1 - Math.exp(-delta * 0.95);
    s.x += (pointer.current.x - s.x) * lerp;
    s.y += (pointer.current.y - s.y) * lerp;

    const t = state.clock.getElapsedTime();
    const drift = (t * Math.PI * 2) / 22;

    if (group.current) {
      // Gentle product float — light motion only
      group.current.rotation.x =
        Math.PI / 2.4 + Math.sin(drift) * 0.045 + s.y * 0.05;
      group.current.rotation.y = Math.cos(drift * 0.8) * 0.07 + s.x * 0.06;
      group.current.rotation.z = Math.sin(drift * 0.65) * 0.03;
      // Lower/center-back — ~50–60% of hero as product slot
      group.current.position.x = Math.sin(drift * 0.4) * 0.04 + s.x * 0.06;
      group.current.position.y =
        -0.72 + Math.cos(drift * 0.5) * 0.035 + s.y * 0.04;
      group.current.position.z = -0.2;
    }
  });

  const samples = mobile ? 4 : GLASS.samples;
  const resolution = mobile ? 320 : GLASS.resolution;

  return (
    <group ref={group} scale={mobile ? 1.05 : 1.38}>
      <mesh>
        <cylinderGeometry args={[1.12, 1.12, 0.2, 96]} />
        <MeshTransmissionMaterial
          backside={!mobile}
          samples={samples}
          resolution={resolution}
          transmission={GLASS.transmission}
          thickness={GLASS.thickness}
          ior={GLASS.ior}
          chromaticAberration={GLASS.chromaticAberration}
          anisotropy={GLASS.anisotropy}
          roughness={GLASS.roughness}
          metalness={GLASS.metalness}
          clearcoat={GLASS.clearcoat}
          clearcoatRoughness={GLASS.clearcoatRoughness}
          distortion={GLASS.distortion}
          distortionScale={GLASS.distortionScale}
          temporalDistortion={GLASS.temporalDistortion}
          color="#ffffff"
          attenuationColor="#eef4fb"
          attenuationDistance={3.5}
        />
      </mesh>
    </group>
  );
}

function SoftLights() {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 5, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-3, 3, 3]} intensity={0.5} color="#f5f8fc" />
      <pointLight position={[1.5, 1.2, 2.6]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-1.2, 0.4, 2]} intensity={0.32} color="#d4e4f8" />
    </>
  );
}

function Scene({ pointer, mobile }: { pointer: Ptr; mobile: boolean }) {
  return (
    <>
      <SoftLights />
      <Environment preset="apartment" environmentIntensity={0.9} />
      <PastelBackdrop />
      <GlassLens pointer={pointer} mobile={mobile} />
    </>
  );
}

export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const update = () => setMobile(isCoarsePointer());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
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
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        {/* Pastel mesh behind product slot */}
        <div className="absolute bottom-[8%] left-1/2 h-[58vmin] w-[72vmin] max-w-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(170,205,255,0.5),transparent_68%)] blur-3xl" />
        <div className="absolute bottom-[4%] left-[42%] h-[42vmin] w-[48vmin] max-w-[55%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,200,220,0.4),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[10%] left-[58%] h-[36vmin] w-[40vmin] max-w-[45%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_45%_55%,rgba(190,230,220,0.42),transparent_68%)] blur-2xl" />
        {/* CSS frosted lens — lower/center product slot */}
        <div className="absolute bottom-[10%] left-1/2 h-[min(52vmin,420px)] w-[min(52vmin,420px)] -translate-x-1/2 rounded-full border border-white/65 bg-white/50 shadow-soft backdrop-blur-xl backdrop-saturate-150" />
        <div className="absolute bottom-[12%] left-1/2 h-[min(58vmin,460px)] w-[min(58vmin,460px)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.92),rgba(210,225,240,0.32)_48%,transparent_72%)] blur-xl" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 -z-10"
      aria-hidden
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, -0.15, 5.2], fov: 38, near: 0.1, far: 40 }}
      >
        <color attach="background" args={["#F5F5F7"]} />
        <fog attach="fog" args={["#F5F5F7", 14, 30]} />
        <Scene pointer={pointer} mobile={mobile} />
      </Canvas>
      {/* Soft fades — keep copy readable, product lens clear */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-apple-bg via-transparent to-transparent opacity-70" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-apple-bg to-transparent" />
    </div>
  );
}
