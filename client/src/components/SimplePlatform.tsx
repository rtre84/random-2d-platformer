import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface SimplePlatformProps {
  position: { x: number; y: number; z: number };
  size: { width: number; height: number; depth: number };
  color?: string;
  texture?: string;
}

export function SimplePlatform({
  position,
  size,
  color = "#4ECDC4",
  texture
}: SimplePlatformProps) {
  // Load texture if provided
  const textureMap = texture ? useTexture(texture) : null;

  return (
    <mesh
      position={[position.x, position.y, position.z]}
      receiveShadow
      castShadow
    >
      <boxGeometry args={[size.width, size.height, size.depth]} />
      <meshLambertMaterial color={color} map={textureMap} />
    </mesh>
  );
}