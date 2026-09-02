"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

type Ptr = React.MutableRefObject<{ x: number; y: number }>;

/** Soft frosted glass for light Apple-like scene */
const GLASS = {
  transmission: 0.97,
  thickness: 0.38,
  ior: 1.12,
  chromaticAberration: 0.003,
  anisotropy: 0.01,
  roughness: 0.16,
  distortion: 0.015,
  distortionScale: 0.06,
  temporalDistortion: 0.015,
  samples: 4,
  resolution: 320,
} as const;

function isCoarsePointer() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768
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
      group.current.position.z = -0.55;
    }
  });

  const samples = mobile ? 3 : GLASS.samples;
  const resolution = mobile ? 224 : GLASS.resolution;

  return (
    <group ref={group} scale={mobile ? 0.7 : 0.88}>
      <mesh>
        <cylinderGeometry args={[1.05, 1.05, 0.12, 96]} />
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
          distortion={GLASS.distortion}
          distortionScale={GLASS.distortionScale}
          temporalDistortion={GLASS.temporalDistortion}
          color="#ffffff"
          attenuationColor="#e4eef8"
          attenuationDistance={2.4}
        />
      </mesh>
    </group>
  );
}

function SoftLights() {
  return (
    <>
      <ambientLight intensity={1.05} />
      <directionalLight position={[4, 6, 3]} intensity={0.9} color="#ffffff" />
      <directionalLight position={[-3, 3, 2]} intensity={0.4} color="#f0f5fb" />
      <pointLight position={[2.5, 1.2, 2]} intensity={0.25} color="#c8daf0" />
    </>
  );
}

function Scene({ pointer, mobile }: { pointer: Ptr; mobile: boolean }) {
  return (
    <>
      <SoftLights />
      <Environment preset="apartment" environmentIntensity={1.05} />
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
        {/* CSS frosted circle on light bg — side placement */}
        <div className="absolute right-[6%] top-1/2 h-[32vmin] w-[32vmin] max-w-[35%] -translate-y-1/2 rounded-full border border-black/[0.08] bg-white/55 shadow-soft backdrop-blur-xl" />
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
        dpr={[1, 1.35]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0.1, 5.4], fov: 40, near: 0.1, far: 40 }}
      >
        <color attach="background" args={["#F5F5F7"]} />
        <fog attach="fog" args={["#F5F5F7", 10, 24]} />
        <Scene pointer={pointer} mobile={mobile} />
      </Canvas>
      {/* Soft light fade only — no dark wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-apple-bg via-apple-bg/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-apple-bg" />
    </div>
  );
}
