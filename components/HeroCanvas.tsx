"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

type Ptr = React.MutableRefObject<{ x: number; y: number }>;

const GLASS = {
  transmission: 0.92,
  thickness: 0.55,
  ior: 1.18,
  chromaticAberration: 0.008,
  anisotropy: 0.02,
  roughness: 0.08,
  distortion: 0.04,
  distortionScale: 0.12,
  temporalDistortion: 0.03,
  samples: 4,
  resolution: 320,
} as const;

function isCoarsePointer() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768
  );
}

/** Thin optical lens / disk — sole glass object */
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
    // Heavy damping — pointer barely moves the lens
    const lerp = 1 - Math.exp(-delta * 1.1);
    s.x += (pointer.current.x - s.x) * lerp;
    s.y += (pointer.current.y - s.y) * lerp;

    const t = state.clock.getElapsedTime();
    // Slow drift: ~16s period
    const drift = (t * Math.PI * 2) / 16;

    if (group.current) {
      group.current.rotation.x =
        Math.PI / 2.35 + Math.sin(drift) * 0.06 + s.y * 0.08;
      group.current.rotation.y = Math.cos(drift * 0.85) * 0.1 + s.x * 0.1;
      group.current.rotation.z = Math.sin(drift * 0.7) * 0.04;
      group.current.position.x = 1.15 + Math.sin(drift * 0.5) * 0.08 + s.x * 0.12;
      group.current.position.y = 0.05 + Math.cos(drift * 0.55) * 0.06 + s.y * 0.08;
      group.current.position.z = -0.35;
    }
  });

  const samples = mobile ? 3 : GLASS.samples;
  const resolution = mobile ? 224 : GLASS.resolution;

  return (
    <group ref={group} scale={mobile ? 0.78 : 1}>
      {/* Thin cylinder = optical disk / lens */}
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
          color="#eef4fb"
          attenuationColor="#9eb6d0"
          attenuationDistance={1.6}
        />
      </mesh>
    </group>
  );
}

function SoftLights() {
  return (
    <>
      <ambientLight intensity={0.28} />
      <directionalLight position={[3, 5, 2]} intensity={0.4} color="#c8d8ef" />
      <pointLight position={[-2.5, 0.5, 1.5]} intensity={0.22} color="#5eead4" />
    </>
  );
}

function Scene({ pointer, mobile }: { pointer: Ptr; mobile: boolean }) {
  return (
    <>
      <SoftLights />
      <Environment preset="city" environmentIntensity={0.55} />
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
        <div className="absolute right-[8%] top-1/2 h-[38vmin] w-[38vmin] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(200,220,240,0.22),rgba(94,234,212,0.06)_45%,transparent_70%)] blur-2xl" />
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
        <color attach="background" args={["#0A0C10"]} />
        <fog attach="fog" args={["#0A0C10", 7, 18]} />
        <Scene pointer={pointer} mobile={mobile} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,transparent_0%,rgba(10,12,16,0.35)_55%,rgba(10,12,16,0.92)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/50 via-transparent to-ink-950" />
    </div>
  );
}
