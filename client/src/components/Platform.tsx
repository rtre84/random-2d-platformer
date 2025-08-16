import * as THREE from 'three';

interface PlatformProps {
  position: { x: number; y: number; z: number };
  size: { width: number; height: number; depth: number };
  color?: string;
}

export function Platform({ position, size, color = "#4ECDC4" }: PlatformProps) {
  return (
    <mesh 
      position={[position.x, position.y, position.z]} 
      receiveShadow 
      castShadow
    >
      <boxGeometry args={[size.width, size.height, size.depth]} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
}
