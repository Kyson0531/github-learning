"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  MeshTransmissionMaterial,
  Text,
} from "@react-three/drei";
import * as THREE from "three";

type ProgressRef = React.MutableRefObject<number>;
type Ptr = React.MutableRefObject<{ x: number; y: number }>;

const GLASS = {
  transmission: 1,
  thickness: 0.35,
  ior: 1.2,
  chromaticAberration: 0.02,
  anisotropy: 0.05,
  roughness: 0,
  distortion: 0.12,
  distortionScale: 0.25,
  temporalDistortion: 0.08,
  samples: 4,
  resolution: 384,
} as const;

function isCoarsePointer() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768
  );
}

function GlassTorus({
  pointer,
  progressRef,
  mobile,
}: {
  pointer: Ptr;
  progressRef: ProgressRef;
  mobile: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const smoothed = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const s = smoothed.current;
    const lerp = 1 - Math.exp(-delta * 3.2);
    s.x += (pointer.current.x - s.x) * lerp;
    s.y += (pointer.current.y - s.y) * lerp;

    const p = progressRef.current;
    const t = state.clock.getElapsedTime();

    if (group.current) {
      group.current.rotation.x =
        s.y * 0.35 + Math.sin(t * 0.18) * 0.08 + p * 0.15;
      group.current.rotation.y = t * 0.22 + s.x * 0.45 + p * 0.35;
      group.current.rotation.z = Math.sin(t * 0.12) * 0.06;
      group.current.position.x = s.x * 0.45;
      group.current.position.y = s.y * 0.28 + Math.sin(t * 0.35) * 0.05;
      group.current.scale.setScalar(1 + p * 0.12);
    }
  });

  const samples = mobile ? 3 : GLASS.samples;
  const resolution = mobile ? 256 : GLASS.resolution;

  return (
    <group ref={group} position={[0.55, 0.05, 0]}>
      <mesh>
        <torusGeometry args={[1.15, 0.42, 48, 96]} />
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
          color="#e8f4ff"
          attenuationColor="#a8c8e8"
          attenuationDistance={1.2}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[0.72, 0.72, 0.72]}>
        <torusGeometry args={[1.05, 0.08, 24, 64]} />
        <MeshTransmissionMaterial
          backside={false}
          samples={Math.max(2, samples - 1)}
          resolution={Math.min(resolution, 256)}
          transmission={1}
          thickness={0.2}
          ior={1.15}
          chromaticAberration={0.015}
          roughness={0}
          color="#f0f7ff"
        />
      </mesh>
    </group>
  );
}

function BackdropText() {
  // Latin WebGL text behind glass (warps via transmission).
  // CJK name stays in DOM Hero for accessibility / fonts.
  return (
    <group position={[-0.35, 0.15, -1.35]}>
      <Text
        fontSize={1.15}
        letterSpacing={-0.04}
        color="#e8eaef"
        anchorX="center"
        anchorY="middle"
        maxWidth={6}
        fillOpacity={0.92}
      >
        KYSON
      </Text>
      <Text
        position={[0, -0.78, 0.05]}
        fontSize={0.28}
        letterSpacing={0.28}
        color="#5eead4"
        anchorX="center"
        anchorY="middle"
        fillOpacity={0.7}
      >
        GLASS / HERO
      </Text>
    </group>
  );
}

function SoftLights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 3]} intensity={0.55} color="#c8e0ff" />
      <pointLight position={[-3, -1, 2]} intensity={0.4} color="#5eead4" />
      <pointLight position={[2, 2, -2]} intensity={0.35} color="#a78bfa" />
    </>
  );
}

function Scene({
  pointer,
  progressRef,
  mobile,
}: {
  pointer: Ptr;
  progressRef: ProgressRef;
  mobile: boolean;
}) {
  return (
    <>
      <SoftLights />
      <Environment preset="city" environmentIntensity={0.85} />
      <BackdropText />
      <GlassTorus pointer={pointer} progressRef={progressRef} mobile={mobile} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.4, -1.65, 0]}>
        <circleGeometry args={[2.4, 48]} />
        <meshBasicMaterial
          color="#5eead4"
          transparent
          opacity={0.04}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

export function HeroCanvas({ progressRef }: { progressRef: ProgressRef }) {
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
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_60%_40%,_rgba(94,234,212,0.16),_transparent_50%),radial-gradient(ellipse_at_20%_70%,_rgba(96,165,250,0.12),_transparent_45%),radial-gradient(ellipse_at_80%_20%,_rgba(167,139,250,0.1),_transparent_40%),linear-gradient(180deg,#05060a_0%,#0a0c12_100%)]"
        aria-hidden
      />
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0.15, 5.2], fov: 42, near: 0.1, far: 40 }}
      >
        <color attach="background" args={["#05060a"]} />
        <fog attach="fog" args={["#05060a", 6, 16]} />
        <Scene pointer={pointer} progressRef={progressRef} mobile={mobile} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,6,10,0.25)_55%,rgba(5,6,10,0.88)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/40 via-transparent to-ink-950" />
    </div>
  );
}
