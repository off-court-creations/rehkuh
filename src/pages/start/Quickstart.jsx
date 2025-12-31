import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Surface, Stack, Panel, Box, Typography, Icon } from "@archway/valet";

function SpinningCube() {
  const ref = React.useRef(null);
  useFrame((_, dt) => {
    const m = ref.current;
    if (!m) return;
    // @ts-expect-error dynamic ref typing for demo simplicity
    m.rotation.x += dt * 0.6;
    // @ts-expect-error dynamic ref typing for demo simplicity
    m.rotation.y += dt * 0.9;
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#4bd0d2" roughness={0.4} metalness={0.2} />
    </mesh>
  );
}

export default function QuickstartPage() {
  return (
    <Surface>
      {/* Fullscreen 3D background */}
      <Canvas
        shadows
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background: "#1a2230",
        }}
        camera={{ position: [2.5, 2, 3.5], fov: 55 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 6, 5]} intensity={1} castShadow />
        <group position={[0, 0, 0]}>
          <SpinningCube />
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.51, 0]}
            receiveShadow
          >
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#263445" roughness={1} metalness={0} />
          </mesh>
        </group>
      </Canvas>

      {/* Simple Valet UI overlay */}
      <Box sx={{ position: "relative", pointerEvents: "none" }}>
        <Box sx={{ position: "fixed", top: "1rem", left: "1rem" }}>
          <Panel preset="frostedGlass">
            <Stack direction="row" gap={2}>
              <Stack direction="row" gap={1}>
                <Icon icon="mdi:cube-outline" size="md" />
                <Typography variant="subtitle">Spinning cube</Typography>
              </Stack>
              <Stack direction="row" gap={1}>
                <Icon icon="mdi:vector-triangle" size="md" />
                <Typography variant="subtitle">R3F + Valet overlay</Typography>
              </Stack>
            </Stack>
          </Panel>
        </Box>
      </Box>
    </Surface>
  );
}
