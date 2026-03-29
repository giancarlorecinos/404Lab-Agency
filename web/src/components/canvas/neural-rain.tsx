"use client";

import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

const PARTICLE_COUNT = 800;
const MOUSE_RADIUS = 4.0;
const BOUNDS = 20;

const vertexShader = `
  uniform float uTime;
  attribute vec3 instColor;
  attribute float instSpeed;
  attribute float instHoverState;
  
  varying vec3 vColor;
  varying float vHover;

  void main() {
    vColor = instColor;
    vHover = instHoverState;
    
    vec4 mvPosition = viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Make snapped/hovered particles slightly larger
    gl_PointSize = (10.0 + (instHoverState * 15.0)) * (1.0 / -mvPosition.z);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vHover;
  
  void main() {
    // Generate an abstract diamond / dot geometry shape purely in shader
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r = dot(cxy, cxy);
    
    // Core glow logic
    float core = 1.0 - smoothstep(0.0, 0.2, r); // Sharp core
    float aura = 1.0 - smoothstep(0.1, 1.0, r); // Soft edge
    
    // When hovered/snapped, intensify the aura and switch totally to Phosphor Violet
    float alpha = max(core, aura * (0.3 + vHover * 0.7));
    
    // Drop opacity for outer edges
    if (r > 1.0) discard;
    
    gl_FragColor = vec4(vColor, alpha);
  }
`;

function ParticleEngine() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { viewport, mouse, camera } = useThree();

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Store persistent data per particle
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }).map(() => ({
      x: (Math.random() - 0.5) * BOUNDS,
      y: (Math.random() - 0.5) * BOUNDS,
      z: (Math.random() - 0.5) * 8 - 4, // Deep depth
      speed: Math.random() * 0.05 + 0.01,
      baseX: 0,
       // Colors: Mostly Static Silver, Randomly Phosphor Violet
      color: Math.random() > 0.8 ? new THREE.Color("#8A2BE2") : new THREE.Color("#E2E2E2"),
      snapped: false,
      targetX: 0,
      targetY: 0
    }));
  }, []);

  // Buffers for InstancedMesh attributes
  const colors = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const hoverStates = useMemo(() => new Float32Array(PARTICLE_COUNT), []);

  useEffect(() => {
    particles.forEach((p, i) => {
      p.color.toArray(colors, i * 3);
      p.baseX = p.x;
    });
  }, [particles, colors]);

  useFrame((state) => {
    if (!meshRef.current || !linesRef.current) return;

    // Project mouse to 3D space
    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distanceToZZero = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distanceToZZero));
    
    const mousePoint = new THREE.Vector2(pos.x, pos.y);
    const linePositions: number[] = [];

    particles.forEach((p, i) => {
      // 1. Natural Falling Logic
      p.y -= p.speed;
      if (p.y < -BOUNDS / 2) {
        p.y = BOUNDS / 2;
        p.x = p.baseX; // Reset X
        p.snapped = false;
        hoverStates[i] = 0.0;
      }

      // 2. Proximity Checking (Neural Snap)
      const dist = mousePoint.distanceTo(new THREE.Vector2(p.x, p.y));
      
      if (dist < MOUSE_RADIUS) {
        p.snapped = true;
        hoverStates[i] = THREE.MathUtils.lerp(hoverStates[i], 1.0, 0.1);
        
        // Artificial magnetic pull toward mouse
        const angle = Math.atan2(pos.y - p.y, pos.x - p.x);
        p.targetX = p.x + Math.cos(angle) * (MOUSE_RADIUS - dist) * 0.1;
        p.targetY = p.y + Math.sin(angle) * (MOUSE_RADIUS - dist) * 0.1;
        
        p.x = THREE.MathUtils.lerp(p.x, p.targetX, 0.05);
        p.y = THREE.MathUtils.lerp(p.y, p.targetY, 0.05);

        // Map interconnected lines for particles trapped in the field
        // We link it back to the mouse point to form a neural web
        if (Math.random() > 0.6) {
           linePositions.push(p.x, p.y, p.z);
           linePositions.push(pos.x, pos.y, 0); // connect to cursor
        }
      } else {
        if (p.snapped) {
           // Release from gravity well slowly
           p.snapped = false;
        }
        hoverStates[i] = THREE.MathUtils.lerp(hoverStates[i], 0.0, 0.05);
        // Slowly drift back to original X path
        p.x = THREE.MathUtils.lerp(p.x, p.baseX, 0.02);
      }

      // 3. Apply to Instance Matrix
      dummy.position.set(p.x, p.y, p.z);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    
    // Update shader attributes
    meshRef.current.geometry.attributes.instHoverState.needsUpdate = true;

    // Update lines geometry
    linesRef.current.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        {/* We use a tiny plane to render the raw Points via Shader */}
        <planeGeometry args={[0.05, 0.05]}>
          <instancedBufferAttribute attach="attributes-instColor" args={[colors, 3]} />
          <instancedBufferAttribute attach="attributes-instHoverState" args={[hoverStates, 1]} />
        </planeGeometry>
        
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </instancedMesh>

      {/* The glowing Phosphor Web lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#8A2BE2" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
}

export function NeuralRain() {
  return (
    <div className="absolute inset-0 z-0 bg-[#0A0A0B] pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} gl={{ antialias: false, alpha: false }}>
        <ParticleEngine />
      </Canvas>
    </div>
  );
}
