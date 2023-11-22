/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
const Boiler3 = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <PerspectiveCamera far={100} near={0.1} fov={75} />
      <OrbitControls enableDamping dampingFactor={0.1}></OrbitControls>
    </Canvas>
  );
};

export default Boiler3;
