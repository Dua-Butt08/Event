"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ContactThreeBackgroundProps {
  scrollY: number;
}

export function ContactThreeBackground({ scrollY }: ContactThreeBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const networkRef = useRef<THREE.Group | null>(null);
  const dataStreamsRef = useRef<THREE.Group | null>(null);
  const frameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Capture the current mount ref at the start of the effect
    const currentMountRef = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    let renderer: THREE.WebGLRenderer;
    
    try {
      renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false
      });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      currentMountRef.appendChild(renderer.domElement);

      // Handle WebGL context loss
      const handleContextLost = (event: Event) => {
        event.preventDefault();
        console.warn('WebGL context lost in ContactThreeBackground');
        setHasError(true);
      };

      const handleContextRestored = () => {
        console.log('WebGL context restored in ContactThreeBackground');
        setHasError(false);
      };

      renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);
    } catch (error) {
      console.error('Failed to create WebGL renderer:', error);
      setHasError(true);
      return;
    }

    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Brand colors
    const brandColor1 = new THREE.Color(0xff6b35); // Orange
    const brandColor2 = new THREE.Color(0xff8c42); // Orange variant
    const brandColor3 = new THREE.Color(0xffffff); // White
    const brandColor4 = new THREE.Color(0x4ade80); // Success green

    // Create marketing information network nodes
    const createInformationNetwork = () => {
      const networkGroup = new THREE.Group();
      const nodes = [];
      const connections = [];
      const nodeCount = 25;

      // Create network nodes representing marketing touchpoints
      for (let i = 0; i < nodeCount; i++) {
        const nodeGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const nodeMaterial = new THREE.MeshBasicMaterial({
          color: i % 3 === 0 ? brandColor1 : i % 3 === 1 ? brandColor2 : brandColor3,
          transparent: true,
          opacity: 0.6
        });
        
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        
        // Position nodes in a 3D space representing marketing ecosystem
        const radius = 30 + Math.random() * 40;
        const theta = (i / nodeCount) * Math.PI * 2 + Math.random() * 0.5;
        const phi = Math.random() * Math.PI;
        
        node.position.x = radius * Math.sin(phi) * Math.cos(theta);
        node.position.y = radius * Math.sin(phi) * Math.sin(theta);
        node.position.z = radius * Math.cos(phi);
        
        // Store animation data
        node.userData = {
          originalPosition: node.position.clone(),
          pulseOffset: Math.random() * Math.PI * 2,
          floatSpeed: 0.0003 + Math.random() * 0.0002
        };
        
        nodes.push(node);
        networkGroup.add(node);
      }

      // Create connections between nodes (information flow)
      const connectionMaterial = new THREE.LineBasicMaterial({
        color: brandColor1,
        transparent: true,
        opacity: 0.08
      });

      for (let i = 0; i < nodes.length; i++) {
        // Connect each node to 2-4 nearby nodes
        const connectionsPerNode = 2 + Math.floor(Math.random() * 3);
        const distances = [];
        
        // Calculate distances to other nodes
        for (let j = 0; j < nodes.length; j++) {
          if (i !== j) {
            const distance = nodes[i].position.distanceTo(nodes[j].position);
            distances.push({ index: j, distance });
          }
        }
        
        // Sort by distance and connect to closest nodes
        distances.sort((a, b) => a.distance - b.distance);
        
        for (let k = 0; k < Math.min(connectionsPerNode, distances.length); k++) {
          const targetIndex = distances[k].index;
          const geometry = new THREE.BufferGeometry();
          const positions = new Float32Array(6);
          
          positions[0] = nodes[i].position.x;
          positions[1] = nodes[i].position.y;
          positions[2] = nodes[i].position.z;
          positions[3] = nodes[targetIndex].position.x;
          positions[4] = nodes[targetIndex].position.y;
          positions[5] = nodes[targetIndex].position.z;
          
          geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          const line = new THREE.Line(geometry, connectionMaterial);
          connections.push(line);
          networkGroup.add(line);
        }
      }

      networkGroup.userData = { nodes, connections };
      return networkGroup;
    };

    // Create flowing data streams
    const createDataStreams = () => {
      const streamsGroup = new THREE.Group();
      const streamCount = 15;

      for (let i = 0; i < streamCount; i++) {
        const streamGeometry = new THREE.BufferGeometry();
        const streamPoints = 50;
        const positions = new Float32Array(streamPoints * 3);
        const colors = new Float32Array(streamPoints * 3);
        
        // Create curved path for data stream
        const startX = (Math.random() - 0.5) * 120;
        const startY = (Math.random() - 0.5) * 80;
        const startZ = (Math.random() - 0.5) * 60;
        
        const endX = (Math.random() - 0.5) * 120;
        const endY = (Math.random() - 0.5) * 80;
        const endZ = (Math.random() - 0.5) * 60;
        
        // Control points for bezier curve
        const ctrlX = (startX + endX) / 2 + (Math.random() - 0.5) * 30;
        const ctrlY = (startY + endY) / 2 + (Math.random() - 0.5) * 30;
        const ctrlZ = (startZ + endZ) / 2 + (Math.random() - 0.5) * 20;
        
        for (let j = 0; j < streamPoints; j++) {
          const t = j / (streamPoints - 1);
          const j3 = j * 3;
          
          // Quadratic bezier curve
          positions[j3] = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * ctrlX + t * t * endX;
          positions[j3 + 1] = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * ctrlY + t * t * endY;
          positions[j3 + 2] = (1 - t) * (1 - t) * startZ + 2 * (1 - t) * t * ctrlZ + t * t * endZ;
          
          // Color gradient along stream
          const color = t < 0.5 ? brandColor4 : brandColor2;
          colors[j3] = color.r;
          colors[j3 + 1] = color.g;
          colors[j3 + 2] = color.b;
        }
        
        streamGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        streamGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const streamMaterial = new THREE.PointsMaterial({
          size: 0.4,
          vertexColors: true,
          transparent: true,
          opacity: 0.15,
          blending: THREE.AdditiveBlending
        });
        
        const stream = new THREE.Points(streamGeometry, streamMaterial);
        stream.userData = {
          flowSpeed: 0.0001 + Math.random() * 0.0002,
          originalPositions: positions.slice()
        };
        
        streamsGroup.add(stream);
      }
      
      return streamsGroup;
    };

    // Create floating marketing icons/symbols
    const createMarketingSymbols = () => {
      const symbolsGroup = new THREE.Group();
      const symbolCount = 12;
      
      for (let i = 0; i < symbolCount; i++) {
        // Create simple geometric shapes representing marketing concepts
        const geometries = [
          new THREE.RingGeometry(0.3, 0.5, 6), // Target/Focus
          new THREE.ConeGeometry(0.4, 0.8, 6), // Growth/Funnel
          new THREE.TorusGeometry(0.4, 0.1, 6, 12), // Connection/Network
          new THREE.OctahedronGeometry(0.4) // Data/Analytics
        ];
        
        const geometry = geometries[i % geometries.length];
        const material = new THREE.MeshBasicMaterial({
          color: i % 4 === 0 ? brandColor1 : 
                 i % 4 === 1 ? brandColor2 : 
                 i % 4 === 2 ? brandColor4 : brandColor3,
          transparent: true,
          opacity: 0.08,
          wireframe: true
        });
        
        const symbol = new THREE.Mesh(geometry, material);
        
        symbol.position.set(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 80,
          (Math.random() - 0.5) * 50
        );
        
        symbol.userData = {
          rotationSpeed: {
            x: (Math.random() - 0.5) * 0.0008,
            y: (Math.random() - 0.5) * 0.0008,
            z: (Math.random() - 0.5) * 0.0008
          },
          floatSpeed: Math.random() * 0.0003 + 0.0001,
          originalPosition: symbol.position.clone()
        };
        
        symbolsGroup.add(symbol);
      }
      
      return symbolsGroup;
    };

    // Create all elements
    const networkGroup = createInformationNetwork();
    const dataStreamsGroup = createDataStreams();
    const symbolsGroup = createMarketingSymbols();
    
    scene.add(networkGroup);
    scene.add(dataStreamsGroup);
    scene.add(symbolsGroup);
    
    networkRef.current = networkGroup;
    dataStreamsRef.current = dataStreamsGroup;

    // Camera positioning
    camera.position.z = 80;
    camera.position.y = 10;

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      timeRef.current += 0.005; // Very slow time progression

      // Camera remains static - no mouse parallax

      // Animate network nodes (pulsing and gentle floating)
      if (networkRef.current) {
        const { nodes } = networkRef.current.userData;
        nodes.forEach((node: THREE.Mesh, index: number) => {
          // Gentle pulsing effect
          const pulseScale = 1 + Math.sin(timeRef.current * 2 + node.userData.pulseOffset) * 0.1;
          node.scale.setScalar(pulseScale);
          
          // Subtle floating motion
          const floatOffset = Math.sin(timeRef.current + index) * 0.5;
          node.position.y = node.userData.originalPosition.y + floatOffset;
          
          // Gentle material opacity variation
          if (Array.isArray(node.material)) {
            node.material.forEach((mat) => {
              if (mat.transparent) {
                mat.opacity = 0.4 + Math.sin(timeRef.current + node.userData.pulseOffset) * 0.2;
              }
            });
          } else if (node.material.transparent) {
            (node.material as THREE.MeshBasicMaterial).opacity = 0.4 + Math.sin(timeRef.current + node.userData.pulseOffset) * 0.2;
          }
        });
      }

      // Animate data streams (flowing effect)
      if (dataStreamsRef.current) {
        dataStreamsRef.current.children.forEach((stream) => {
          if (stream instanceof THREE.Points) {
            const positions = stream.geometry.attributes.position.array as Float32Array;
            const originalPositions = stream.userData.originalPositions;
            const flowSpeed = stream.userData.flowSpeed;
            
            // Create flowing wave effect along the stream
            for (let i = 0; i < positions.length; i += 3) {
              const waveOffset = Math.sin(timeRef.current * 3 + (i / 3) * 0.3) * 0.3;
              positions[i + 1] = originalPositions[i + 1] + waveOffset;
            }
            
            stream.geometry.attributes.position.needsUpdate = true;
            
            // Rotate entire stream slowly
            stream.rotation.z += flowSpeed;
          }
        });
      }

      // Animate marketing symbols
      symbolsGroup.children.forEach((symbol, index) => {
        if (symbol instanceof THREE.Mesh) {
          // Slow rotation
          symbol.rotation.x += symbol.userData.rotationSpeed.x;
          symbol.rotation.y += symbol.userData.rotationSpeed.y;
          symbol.rotation.z += symbol.userData.rotationSpeed.z;
          
          // Gentle floating
          const floatOffset = Math.sin(timeRef.current * symbol.userData.floatSpeed + index) * 1.5;
          symbol.position.y = symbol.userData.originalPosition.y + floatOffset;
        }
      });

      // Subtle scroll effect (very gentle scene rotation)
      if (sceneRef.current) {
        sceneRef.current.rotation.y = scrollY * 0.00005; // Extremely subtle
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      
      // Use the captured ref values in cleanup
      const currentRenderer = rendererRef.current;
      if (currentMountRef && currentRenderer?.domElement) {
        currentMountRef.removeChild(currentRenderer.domElement);
      }
      
      // Cleanup Three.js objects
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(mat => mat.dispose());
          } else {
            object.material.dispose();
          }
        } else if (object instanceof THREE.Points) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(mat => mat.dispose());
          } else {
            object.material.dispose();
          }
        } else if (object instanceof THREE.Line) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(mat => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      rendererRef.current?.dispose();
    };
  }, [scrollY]);

  // Show fallback gradient if WebGL fails
  if (hasError) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" style={{ opacity: 0.4 }} />
    );
  }

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }} // Reduced opacity for faint effect
    />
  );
}