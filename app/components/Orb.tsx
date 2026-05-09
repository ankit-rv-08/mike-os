'use client';
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

function AnimatedOrb() {
  const orbRef = useRef<any>(null);

  useFrame((state) => {
    const { clock } = state;
    if (orbRef.current) {
      orbRef.current.distort = 0.3 + Math.sin(clock.getElapsedTime()) * 0.2;
      orbRef.current.speed = 2;
    }
  });

  return (
    <Sphere args={[1, 100, 200]} scale={2.5}>
      <MeshDistortMaterial
        ref={orbRef}
        color="#3b82f6"
        attach="material"
        distort={0.5}
        speed={2}
        roughness={0}
      />
    </Sphere>
  );
}

export default function Orb() {
  return (
    <div className="h-[400px] w-full relative">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <AnimatedOrb />
      </Canvas>
    </div>
  );
}