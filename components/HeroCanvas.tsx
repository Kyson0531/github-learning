"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

type Ptr = React.MutableRefObject<{ x: number; y: number }>;

/** Clear refractive glass — high transmission, soft specular, subtle thickness */
const GLASS = {
  transmission: 1,
  thickness: 0.62,
  ior: 1.42,
  chromaticAberration: 0.018,
  anisotropy: 0.02,
  roughness: 0.045,
  metalness: 0.02,
  clearcoat: 1,
  clearcoatRoughness: 0.08,
  distortion: 0.12,
  distortionScale: 0.22,
  temporalDistortion: 0.02,
  samples: 8,
  resolution: 512,
} as const;

function isCoarsePointer() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768
  );
}

/** Soft pastel blobs for the lens to refract — not a second hero object */
function PastelBackdrop() {
  const texture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    const g = ctx.createLinearGradient(0, 0, size, size);
    g.addColorStop(0, "#F5F5F7");
    g.addColorStop(0.35, "#E8F0FA");
    g.addColorStop(0.65, "#F5EAF2");
    g.addColorStop(1, "#F5F5F7");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    const blobs: Array<{
      x: number;
      y: number;
      r: number;
      color: string;
    }> = [
      { x: 0.28, y: 0.32, r: 0.38, color: "rgba(170, 205, 255, 0.55)" },
      { x: 0.72, y: 0.28, r: 0.34, color: "rgba(255, 200, 220, 0.42)" },
      { x: 0.55, y: 0.68, r: 0.4, color: "rgba(190, 230, 220, 0.45)" },
      { x: 0.18, y: 0.7, r: 0.28, color: "rgba(220, 210, 255, 0.35)" },
      { x: 0.82, y: 0.62, r: 0.3, color: "rgba(255, 230, 190, 0.38)" },
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
    <mesh position={[1.2, 0.05, -2.2]} scale={[6.2, 4.2, 1]}>
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
    const lerp = 1 - Math.exp(-delta * 1.1);
    s.x += (pointer.current.x - s.x) * lerp;
    s.y += (pointer.current.y - s.y) * lerp;

    const t = state.clock.getElapsedTime();
    const drift = (t * Math.PI * 2) / 16;

    if (group.current) {
      group.current.rotation.x =
        Math.PI / 2.35 + Math.sin(drift) * 0.06 + s.y * 0.08;
      group.current.rotation.y = Math.cos(drift * 0.85) * 0.1 + s.x * 0.1;
      group.current.rotation.z = Math.sin(drift * 0.7) * 0.04;
      // Keep lens on side / back — ≤ ~35% of frame weight
      group.current.position.x = 1.35 + Math.sin(drift * 0.5) * 0.06 + s.x * 0.1;
      group.current.position.y = 0.08 + Math.cos(drift * 0.55) * 0.05 + s.y * 0.06;
      group.current.position.z = -0.35;
    }
  });

  const samples = mobile ? 4 : GLASS.samples;
  const resolution = mobile ? 256 : GLASS.resolution;

  return (
    <group ref={group} scale={mobile ? 0.72 : 0.92}>
      <mesh>
        {/* Slightly thicker cylinder for readable glass edge / thickness */}
        <cylinderGeometry args={[1.05, 1.05, 0.18, 96]} />
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
          attenuationDistance={3.2}
        />
      </mesh>
    </group>
  );
}

function SoftLights() {
  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 6, 4]} intensity={1.15} color="#ffffff" />
      <directionalLight position={[-3, 4, 2]} intensity={0.45} color="#f5f8fc" />
      {/* Soft specular kiss on the glass rim */}
      <pointLight position={[2.2, 1.6, 2.4]} intensity={0.55} color="#ffffff" />
      <pointLight position={[-1.5, 0.8, 1.8]} intensity={0.28} color="#d4e4f8" />
    </>
  );
}

function Scene({ pointer, mobile }: { pointer: Ptr; mobile: boolean }) {
  return (
    <>
      <SoftLights />
      <Environment preset="apartment" environmentIntensity={0.85} />
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
        {/* Soft pastel orbs so frosted circle has depth */}
        <div className="absolute right-[8%] top-[42%] h-[48vmin] w-[48vmin] max-w-[42%] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_40%_35%,rgba(170,205,255,0.45),transparent_70%)] blur-2xl" />
        <div className="absolute right-[2%] top-[58%] h-[36vmin] w-[36vmin] max-w-[32%] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,200,220,0.35),transparent_70%)] blur-2xl" />
        {/* CSS frosted circle on light bg — side placement */}
        <div className="absolute right-[6%] top-1/2 h-[32vmin] w-[32vmin] max-w-[35%] -translate-y-1/2 rounded-full border border-white/60 bg-white/55 shadow-soft backdrop-blur-xl backdrop-saturate-150" />
        <div className="absolute right-[4%] top-[48%] h-[40vmin] w-[40vmin] max-w-[35%] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.9),rgba(210,225,240,0.35)_45%,transparent_70%)] blur-xl" />
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
        camera={{ position: [0, 0.1, 5.4], fov: 40, near: 0.1, far: 40 }}
      >
        <color attach="background" args={["#F5F5F7"]} />
        <fog attach="fog" args={["#F5F5F7", 12, 28]} />
        <Scene pointer={pointer} mobile={mobile} />
      </Canvas>
      {/* Soft light fade only — no dark wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-apple-bg via-apple-bg/35 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-apple-bg" />
    </div>
  );
}
