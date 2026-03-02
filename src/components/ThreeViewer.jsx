import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Box, Typography } from '@mui/material';

const Scene = ({ url }) => {
  const texture = useTexture(url);
  return (
    <Sphere args={[500, 60, 40]} scale={[-1, 1, 1]}>
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
    </Sphere>
  );
};

const ThreeViewer = ({ panoramaUrl }) => {
  if (!panoramaUrl) {
    return (
      <Box sx={{ height: 560, display: 'grid', placeItems: 'center', bgcolor: 'grey.900', color: 'white' }}>
        <Typography>Upload a panorama to view in Three.js</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 560, width: '100%', borderRadius: 3, overflow: 'hidden', bgcolor: 'black' }}>
      <Canvas camera={{ position: [0, 0, 0.1] }}>
        <Suspense fallback={null}>
          <Scene url={panoramaUrl} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={-0.5}
          />
        </Suspense>
      </Canvas>
    </Box>
  );
};

export default ThreeViewer;
