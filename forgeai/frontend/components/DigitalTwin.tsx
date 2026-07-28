'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Activity, Thermometer, Zap, Gauge } from 'lucide-react';

interface DigitalTwinProps {
  status: string;
  colorCode: string;
  telemetry: {
    temperature: number;
    vibration: number;
    current: number;
    rpm: number;
  };
}

// Industrial Assembly Sub-Component
function IndustrialAssembly({ status, colorCode }: { status: string; colorCode: string }) {
  const meshRef = useRef<THREE.Group>(null);
  const rotorRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Slow continuous rotation for the motor rotor shaft
  useFrame((state, delta) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.y += delta * (status === 'Critical' ? 4 : status === 'Warning' ? 2.5 : 1.5);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.5;
    }
  });

  const isCritical = status === 'Critical';
  const isWarning = status === 'Warning';

  // Emissive intensity computation based on health status
  const emissiveIntensity = isCritical ? 1.8 : isWarning ? 0.9 : 0.4;

  return (
    <group ref={meshRef} position={[0, -0.5, 0]}>
      {/* Heavy Industrial Base Plate */}
      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[4.2, 0.3, 4.2]} />
        <meshStandardMaterial color="#1c1c21" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Base Mounting Bolts */}
      {[
        [-1.7, -1.0, -1.7],
        [1.7, -1.0, -1.7],
        [-1.7, -1.0, 1.7],
        [1.7, -1.0, 1.7],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.15, 0.15, 0.2, 8]} />
          <meshStandardMaterial color="#3f3f46" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* Main Motor Cylinder Housing */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 2.4, 32]} />
        <meshStandardMaterial
          color="#18181b"
          roughness={0.3}
          metalness={0.85}
          emissive={colorCode}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Cooling Fins around central motor */}
      {Array.from({ length: 8 }).map((_, idx) => {
        const angle = (idx / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 1.45;
        const z = Math.sin(angle) * 1.45;
        return (
          <mesh key={idx} position={[x, 0.2, z]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[0.1, 2.2, 0.3]} />
            <meshStandardMaterial color="#27272a" metalness={0.7} roughness={0.4} />
          </mesh>
        );
      })}

      {/* Top Bearing Housing Assembly */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[1.0, 1.2, 0.5, 32]} />
        <meshStandardMaterial
          color="#27272a"
          metalness={0.9}
          roughness={0.2}
          emissive={colorCode}
          emissiveIntensity={emissiveIntensity * 0.8}
        />
      </mesh>

      {/* Rotating Drive Shaft */}
      <mesh ref={rotorRef} position={[0, 2.1, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 1.0, 16]} />
        <meshStandardMaterial color="#e4e4e7" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Top Bearing Lock Ring (Accent Color) */}
      <mesh ref={ringRef} position={[0, 1.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.8, 0.08, 16, 32]} />
        <meshStandardMaterial
          color={colorCode}
          emissive={colorCode}
          emissiveIntensity={isCritical ? 2.5 : 1.2}
        />
      </mesh>

      {/* Status Warning Glow Aura */}
      {isCritical && (
        <Float speed={5} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[2.2, 16, 16]} />
            <meshStandardMaterial
              color="#ef4444"
              transparent
              opacity={0.15}
              wireframe
            />
          </mesh>
        </Float>
      )}
    </group>
  );
}

export default function DigitalTwin({ status, colorCode, telemetry }: DigitalTwinProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-full h-[450px] lg:h-[500px] rounded-2xl overflow-hidden glass-panel border border-neutral-800 bg-neutral-950/80 shadow-2xl">
      {/* Top Canvas Header Bar */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-3 bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-800">
        <span
          className="w-2.5 h-2.5 rounded-full animate-ping"
          style={{ backgroundColor: colorCode }}
        />
        <span className="text-xs font-semibold tracking-wider uppercase text-neutral-300">
          3D Twin Sync • {status}
        </span>
      </div>

      {/* Floating 3D HUD Telemetry Overlay (Top-Left) */}
      <div className="absolute top-4 left-4 z-10 space-y-2 pointer-events-none">
        <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800/80 p-3 rounded-xl shadow-lg w-52 space-y-2">
          <div className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase border-b border-neutral-800 pb-1 flex justify-between items-center">
            <span>LIVE SENSOR HUD</span>
            <span className="text-cyan-400 font-bold">RT-SYNC</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Thermometer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div>
                <div className="text-[9px] text-neutral-500">TEMP</div>
                <div className="font-semibold text-neutral-200">{telemetry.temperature}°C</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-neutral-300">
              <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <div>
                <div className="text-[9px] text-neutral-500">VIB</div>
                <div className="font-semibold text-neutral-200">{telemetry.vibration} mm/s</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-neutral-300">
              <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[9px] text-neutral-500">CURR</div>
                <div className="font-semibold text-neutral-200">{telemetry.current} A</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-neutral-300">
              <Gauge className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <div>
                <div className="text-[9px] text-neutral-500">SPEED</div>
                <div className="font-semibold text-neutral-200">{telemetry.rpm} RPM</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* R3F 3D Canvas */}
      {mounted ? (
        <Canvas
          camera={{ position: [4, 3, 5], fov: 45 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} />
          <pointLight position={[-4, 3, -4]} intensity={0.8} color={colorCode} />

          <IndustrialAssembly status={status} colorCode={colorCode} />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={10}
            maxPolarAngle={Math.PI / 2 + 0.1}
          />
        </Canvas>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-neutral-500 font-mono text-sm">
          Loading 3D Twin Canvas...
        </div>
      )}

      {/* Canvas Footer Hint */}
      <div className="absolute bottom-3 right-4 text-[10px] font-mono text-neutral-500 pointer-events-none">
        Drag to rotate • Scroll to zoom • Right-click to pan
      </div>
    </div>
  );
}
