"use client";

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Animated particle field with enhanced effects
function ParticleField({ count = 5000 }) {
  const mesh = useRef<THREE.Points>(null);
  const [sphere] = useState(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const distance = Math.random() * 25 + 5;
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);
      
      positions[i * 3] = distance * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = distance * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = distance * Math.cos(theta);
      
      // Dynamic colors
      const hue = Math.random();
      colors[i * 3] = hue;
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
    }
    return { positions, colors };
  });

  useFrame((state) => {
    if (mesh.current) {
      const time = state.clock.elapsedTime;
      mesh.current.rotation.x = time * 0.005;
      mesh.current.rotation.y = time * 0.003;
      
      // Enhanced mouse response
      const mouse = state.mouse;
      mesh.current.rotation.x += mouse.y * 0.02;
      mesh.current.rotation.y += mouse.x * 0.02;
      
      // Pulsing effect
      const scale = 1 + Math.sin(time * 0.3) * 0.05;
      mesh.current.scale.setScalar(scale);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={mesh} positions={sphere.positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ff6b35"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.05}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

// Enhanced floating geometry with more shapes
function FloatingGeometry() {
  return (
    <group>
      <Float speed={0.3} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh position={[-8, 2, -5]}>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshStandardMaterial
            color="#a8a8a8"
            transparent
            opacity={0.03}
            wireframe
            emissive="#a8a8a8"
            emissiveIntensity={0.005}
          />
        </mesh>
      </Float>
      
      <Float speed={0.4} rotationIntensity={0.08} floatIntensity={0.18}>
        <mesh position={[8, -1, -3]}>
          <octahedronGeometry args={[1.4]} />
          <meshStandardMaterial
            color="#ff6b35"
            transparent
            opacity={0.04}
            wireframe
            emissive="#ff6b35"
            emissiveIntensity={0.008}
          />
        </mesh>
      </Float>
      
      <Float speed={0.35} rotationIntensity={0.12} floatIntensity={0.15}>
        <mesh position={[0, 4, -8]}>
          <tetrahedronGeometry args={[1]} />
          <meshStandardMaterial
            color="#4ade80"
            transparent
            opacity={0.035}
            wireframe
            emissive="#4ade80"
            emissiveIntensity={0.006}
          />
        </mesh>
      </Float>
      
      <Float speed={0.25} rotationIntensity={0.09} floatIntensity={0.16}>
        <mesh position={[-4, -3, -6]}>
          <dodecahedronGeometry args={[0.8]} />
          <meshStandardMaterial
            color="#ff6b35"
            transparent
            opacity={0.025}
            wireframe
            emissive="#ff6b35"
            emissiveIntensity={0.004}
          />
        </mesh>
      </Float>
      
      <Float speed={0.45} rotationIntensity={0.08} floatIntensity={0.1}>
        <mesh position={[6, 3, -4]}>
          <torusGeometry args={[0.6, 0.3, 8, 16]} />
          <meshStandardMaterial
            color="#fbbf24"
            transparent
            opacity={0.03}
            wireframe
            emissive="#fbbf24"
            emissiveIntensity={0.004}
          />
        </mesh>
      </Float>
    </group>
  );
}

// Animated grid plane
function GridPlane() {
  const mesh = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>(null);
  
  useFrame((state) => {
    if (mesh.current && mesh.current.material) {
      mesh.current.position.z = (state.clock.elapsedTime * 0.1) % 2;
      (mesh.current.material as THREE.MeshBasicMaterial).opacity = 0.008 + Math.sin(state.clock.elapsedTime * 0.2) * 0.003;
    }
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <planeGeometry args={[50, 50, 50, 50]} />
        <meshBasicMaterial
          color="#ff6b35"
          transparent
          opacity={0.008}
          wireframe
        />
    </mesh>
  );
}

// Scroll-responsive camera
function ScrollCamera({ scrollY }: { scrollY: number }) {
  const { camera } = useThree();
  
  useFrame(() => {
    const normalizedScroll = scrollY / window.innerHeight;
    camera.position.z = 10 + normalizedScroll * 2;
    camera.position.y = normalizedScroll * -1;
    camera.rotation.x = normalizedScroll * 0.05;
  });
  
  return null;
}

// Mouse parallax effect
function MouseParallax() {
  const { camera } = useThree();
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      camera.position.x += (x * 1 - camera.position.x) * 0.005;
      camera.position.y += (y * 0.5 - camera.position.y) * 0.005;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [camera]);
  
  return null;
}

export function FuturisticBackground({ scrollY }: { scrollY: number }) {
  const [hasError, setHasError] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle WebGL context lost and restored events
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn('WebGL context lost, will attempt to restore');
      setHasError(true);
    };

    const handleContextRestored = () => {
      console.log('WebGL context restored');
      setHasError(false);
    };

    const canvas = canvasRef.current?.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost);
      canvas.addEventListener('webglcontextrestored', handleContextRestored);
      
      return () => {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      };
    }
    
    // Return undefined when canvas not found (to satisfy TypeScript)
    return undefined;
  }, []);

  // If there's an error, show a fallback gradient background
  if (hasError) {
    return (
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
    );
  }

  return (
    <div ref={canvasRef} className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: 'transparent' }}
        gl={{ 
          preserveDrawingBuffer: true,
          failIfMajorPerformanceCaveat: false,
          powerPreference: 'high-performance'
        }}
        onCreated={({ gl }) => {
          // Handle context loss gracefully
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            setHasError(true);
          });
        }}
      >
        <ambientLight intensity={0.03} />
        <pointLight position={[10, 10, 10]} intensity={0.05} />
        <pointLight position={[-10, -10, -10]} intensity={0.025} color="#a8a8a8" />
        
        <ParticleField />
        <FloatingGeometry />
        <GridPlane />
        <ScrollCamera scrollY={scrollY} />
        <MouseParallax />
        
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
