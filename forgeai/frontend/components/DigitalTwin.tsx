'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { Activity, Thermometer, Zap, Gauge, Eye, Camera, Box, Layers } from 'lucide-react';

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

// Sub-Component: Industrial Motor & Bearing CAD Assembly
function IndustrialAssembly({
  status,
  colorCode,
  displayMode,
}: {
  status: string;
  colorCode: string;
  displayMode: 'shaded' | 'wireframe' | 'heatmap';
}) {
  const meshGroup = useRef<THREE.Group>(null);
  const shaftRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (shaftRef.current) {
      shaftRef.current.rotation.y += delta * (status === 'Critical' ? 5 : status === 'Warning' ? 3 : 1.8);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.4;
    }
  });

  const isCritical = status === 'Critical';
  const isWarning = status === 'Warning';
  const isWireframe = displayMode === 'wireframe';
  const isHeatmap = displayMode === 'heatmap';

  const emissiveIntensity = isCritical ? 2.0 : isWarning ? 1.0 : 0.4;

  // Heatmap dynamic color mapping
  const heatmapColor = isHeatmap
    ? isCritical
      ? '#ef4444'
      : isWarning
      ? '#f59e0b'
      : '#06b6d4'
    : '#18181b';

  return (
    <group ref={meshGroup} position={[0, -0.4, 0]}>
      {/* Heavy Base Support Plate */}
      <mesh position={[0, -1.25, 0]}>
        <boxGeometry args={[4.4, 0.25, 3.8]} />
        <meshStandardMaterial
          color="#16181d"
          roughness={0.5}
          metalness={0.8}
          wireframe={isWireframe}
        />
      </mesh>

      {/* Vibration Isolation Mounting Feet */}
      {[
        [-1.8, -1.05, -1.5],
        [1.8, -1.05, -1.5],
        [-1.8, -1.05, 1.5],
        [1.8, -1.05, 1.5],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.22, 0.25, 0.2, 12]} />
          <meshStandardMaterial color="#272a33" metalness={0.9} roughness={0.3} wireframe={isWireframe} />
        </mesh>
      ))}

      {/* Main Stator Housing Body */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.35, 1.35, 2.5, 32]} />
        <meshStandardMaterial
          color={isHeatmap ? heatmapColor : '#1a1c23'}
          roughness={0.35}
          metalness={0.85}
          emissive={colorCode}
          emissiveIntensity={emissiveIntensity}
          wireframe={isWireframe}
        />
      </mesh>

      {/* Cooling Fins (Structural Longitudinal Ribs) */}
      {Array.from({ length: 12 }).map((_, idx) => {
        const angle = (idx / 12) * Math.PI * 2;
        const x = Math.cos(angle) * 1.4;
        const z = Math.sin(angle) * 1.4;
        return (
          <mesh key={idx} position={[x, 0.2, z]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[0.08, 2.3, 0.25]} />
            <meshStandardMaterial color="#262933" metalness={0.7} roughness={0.4} wireframe={isWireframe} />
          </mesh>
        );
      })}

      {/* Terminal Junction Box (Top Right Side) */}
      <mesh position={[1.1, 0.9, 0]}>
        <boxGeometry args={[0.6, 0.5, 0.7]} />
        <meshStandardMaterial color="#222630" metalness={0.8} roughness={0.3} wireframe={isWireframe} />
      </mesh>

      {/* Top Bearing Endbell Housing */}
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[1.0, 1.2, 0.45, 32]} />
        <meshStandardMaterial
          color="#222630"
          metalness={0.9}
          roughness={0.2}
          emissive={colorCode}
          emissiveIntensity={emissiveIntensity * 0.7}
          wireframe={isWireframe}
        />
      </mesh>

      {/* Drive Shaft (Rotates) */}
      <mesh ref={shaftRef} position={[0, 2.15, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 1.1, 24]} />
        <meshStandardMaterial color="#d4d4d8" metalness={0.95} roughness={0.1} wireframe={isWireframe} />
      </mesh>

      {/* Shaft Keyway & Coupling Ring */}
      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.2, 24]} />
        <meshStandardMaterial color="#3f3f46" metalness={0.9} roughness={0.2} wireframe={isWireframe} />
      </mesh>

      {/* ISO Bearing Warning Halo Ring */}
      <mesh ref={ringRef} position={[0, 1.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.06, 16, 32]} />
        <meshStandardMaterial
          color={colorCode}
          emissive={colorCode}
          emissiveIntensity={isCritical ? 2.5 : 1.2}
          wireframe={isWireframe}
        />
      </mesh>

      {/* Thermal Fault Glow Sphere (Critical Only) */}
      {isCritical && (
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[2.0, 16, 16]} />
          <meshStandardMaterial color="#ef4444" transparent opacity={0.15} wireframe />
        </mesh>
      )}
    </group>
  );
}

// Camera Control Helper Component
function CameraController({ preset }: { preset: 'iso' | 'front' | 'top' | 'shaft' }) {
  const { camera } = useThree();

  useEffect(() => {
    if (preset === 'iso') {
      camera.position.set(4.5, 3.5, 5.5);
    } else if (preset === 'front') {
      camera.position.set(0, 0.5, 7.0);
    } else if (preset === 'top') {
      camera.position.set(0, 7.5, 0.1);
    } else if (preset === 'shaft') {
      camera.position.set(1.8, 2.5, 2.5);
    }
    camera.lookAt(0, 0.2, 0);
  }, [preset, camera]);

  return null;
}

export default function DigitalTwin({ status, colorCode, telemetry }: DigitalTwinProps) {
  const [mounted, setMounted] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<'iso' | 'front' | 'top' | 'shaft'>('iso');
  const [displayMode, setDisplayMode] = useState<'shaded' | 'wireframe' | 'heatmap'>('shaded');

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-full h-[460px] lg:h-[500px] rounded-xl overflow-hidden industrial-card border border-neutral-800 bg-[#0c0d10] cad-grid-pattern flex flex-col justify-between">
      {/* Top Header Toolbar */}
      <div className="p-3 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2 font-mono text-xs text-neutral-300">
          <span className="text-cyan-400 font-bold">ASSET:</span>
          <span>FL-MOTOR-084</span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-400 font-sans text-[11px]">3D CAD Telemetry Twin</span>
        </div>

        {/* View Controls & Display Mode Toggles */}
        <div className="flex items-center gap-2">
          {/* Display Mode Switcher */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded p-0.5 text-[11px] font-mono">
            <button
              onClick={() => setDisplayMode('shaded')}
              className={`px-2 py-0.5 rounded transition-colors ${
                displayMode === 'shaded' ? 'bg-cyan-600 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Shaded
            </button>
            <button
              onClick={() => setDisplayMode('wireframe')}
              className={`px-2 py-0.5 rounded transition-colors ${
                displayMode === 'wireframe' ? 'bg-cyan-600 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Wireframe
            </button>
            <button
              onClick={() => setDisplayMode('heatmap')}
              className={`px-2 py-0.5 rounded transition-colors ${
                displayMode === 'heatmap' ? 'bg-cyan-600 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Thermal Map
            </button>
          </div>

          {/* Camera View Selector */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded p-0.5 text-[11px] font-mono text-neutral-400">
            <span className="px-1.5 text-neutral-500 flex items-center gap-1">
              <Camera className="w-3 h-3 text-neutral-400" />
            </span>
            <button
              onClick={() => setCameraPreset('iso')}
              className={`px-2 py-0.5 rounded ${cameraPreset === 'iso' ? 'bg-neutral-800 text-neutral-100 font-bold' : 'hover:text-neutral-200'}`}
            >
              ISO
            </button>
            <button
              onClick={() => setCameraPreset('front')}
              className={`px-2 py-0.5 rounded ${cameraPreset === 'front' ? 'bg-neutral-800 text-neutral-100 font-bold' : 'hover:text-neutral-200'}`}
            >
              Front
            </button>
            <button
              onClick={() => setCameraPreset('top')}
              className={`px-2 py-0.5 rounded ${cameraPreset === 'top' ? 'bg-neutral-800 text-neutral-100 font-bold' : 'hover:text-neutral-200'}`}
            >
              Top
            </button>
            <button
              onClick={() => setCameraPreset('shaft')}
              className={`px-2 py-0.5 rounded ${cameraPreset === 'shaft' ? 'bg-neutral-800 text-neutral-100 font-bold' : 'hover:text-neutral-200'}`}
            >
              Bearing
            </button>
          </div>
        </div>
      </div>

      {/* Floating 3D Telemetry HUD Overlay (Top-Left) */}
      <div className="absolute top-14 left-4 z-10 space-y-1.5 pointer-events-none">
        <div className="bg-neutral-950/85 backdrop-blur-md border border-neutral-800 p-2.5 rounded-lg shadow-xl w-48 space-y-1.5 font-mono">
          <div className="text-[9px] tracking-wider text-neutral-400 border-b border-neutral-800 pb-1 flex justify-between items-center uppercase">
            <span>TELEMETRY OVERLAY</span>
            <span className="font-bold" style={{ color: colorCode }}>{status}</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <div className="flex items-center gap-1 text-neutral-300">
              <Thermometer className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{telemetry.temperature}°C</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-300">
              <Activity className="w-3 h-3 text-cyan-400 shrink-0" />
              <span>{telemetry.vibration} mm/s</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-300">
              <Zap className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{telemetry.current} A</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-300">
              <Gauge className="w-3 h-3 text-purple-400 shrink-0" />
              <span>{telemetry.rpm} RPM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Three.js Canvas */}
      <div className="w-full h-full relative">
        {mounted ? (
          <Canvas
            camera={{ position: [4.5, 3.5, 5.5], fov: 42 }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[6, 10, 6]} intensity={1.1} />
            <pointLight position={[-4, 4, -4]} intensity={0.8} color={colorCode} />

            <CameraController preset={cameraPreset} />

            {/* Industrial Ground Grid */}
            <Grid
              renderOrder={-1}
              position={[0, -1.38, 0]}
              infiniteGrid
              cellSize={0.5}
              cellThickness={0.6}
              cellColor="#262933"
              sectionSize={2.5}
              sectionThickness={1.2}
              sectionColor="#3f4454"
              fadeDistance={25}
            />

            <IndustrialAssembly status={status} colorCode={colorCode} displayMode={displayMode} />

            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={2.5}
              maxDistance={12}
              maxPolarAngle={Math.PI / 2 + 0.05}
            />
          </Canvas>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-500 font-mono text-xs">
            Loading CAD Telemetry Canvas...
          </div>
        )}
      </div>

      {/* Canvas Footer Bar */}
      <div className="p-2 bg-neutral-950/80 backdrop-blur-md border-t border-neutral-800/80 flex items-center justify-between text-[10px] font-mono text-neutral-500 z-10">
        <span>FACILITY: PLANT #04 • BAY 12</span>
        <span>Orbit: Left-Click • Pan: Right-Click • Zoom: Scroll</span>
      </div>
    </div>
  );
}
