'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, SpotLight, PointLight, AmbientLight } from '@react-three/drei';

function AnimatedOrb() {
  const meshRef = useRef<any>(null);

  // This hook handles the real-time pulsing
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Logic: Pulse distortion and rotate slowly
      meshRef.current.distort = 0.4 + Math.sin(time) * 0.2;
      meshRef.current.rotation.x = time * 0.1;
      meshRef.current.rotation.y = time * 0.15;
    }
  });

  return (
    <Sphere args={[1, 100, 200]} scale={2.2}>
      <MeshDistortMaterial
        ref={meshRef}
        color="#00f3ff"
        attach="material"
        distort={0.5}
        speed={2}
        roughness={0}
        metalness={1}
        emissive="#0066ff"
        emissiveIntensity={1.5}
      />
    </Sphere>
  );
}

export default function OrbContainer() {
  return (
    <div className="h-[300px] w-full lg:h-[450px] flex items-center justify-center relative">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] rounded-full animate-pulse" />
      
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <AmbientLight intensity={0.5} />
        <PointLight position={[10, 10, 10]} intensity={1} />
        <SpotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
        <AnimatedOrb />
      </Canvas>
    </div>
  );
}