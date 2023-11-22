/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
//@ts-ignore
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { Environment } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
const Earth = () => {
  const earthMap = useLoader(
    TextureLoader,
    "./src/assets/earth/earth_night.jpg"
  );
  const particleMap = useLoader(
    TextureLoader,
    "./src/assets/earth/particle.png"
  );

  //별 파티클
  const position = (count = 1000) => {
    const particles = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      particles[i] = (Math.random() - 0.5) * 5;
      particles[i + 1] = (Math.random() - 0.5) * 5;
      particles[i + 2] = (Math.random() - 0.5) * 5;
    }
    return particles;
  };

  const Earth = () => {
    const groupRef = useRef<any>();
    const starRef = useRef<any>();

    // 지구 돌리는 애니메이션
    useFrame(() => {
      if (groupRef.current) {
        groupRef.current.rotation.x += 0.0005;
        groupRef.current.rotation.y += 0.0005;
      }
      if (starRef.current) {
        starRef.current.rotation.x += +0.001;
        starRef.current.rotation.y += +0.001;
      }
    });

    return (
      <group ref={groupRef}>
        <mesh rotation={[0, -Math.PI / 2, 0]}>
          <meshStandardMaterial
            side={0}
            opacity={0.6}
            transparent
            map={earthMap}
          />
          <sphereGeometry args={[1.3, 30, 30]} />
        </mesh>
        <mesh rotation={[0, -Math.PI / 2, 0]}>
          <meshStandardMaterial
            side={1}
            map={earthMap}
            opacity={0.9}
            transparent
          />
          <sphereGeometry args={[1.5, 30, 30]} />
        </mesh>
        <points ref={starRef}>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              array={position()}
              count={position().length / 3}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.01}
            transparent
            depthWrite={false}
            map={particleMap}
            alphaMap={particleMap}
            color={0xbcc6c6}
          />
        </points>
        <mesh
          rotation={[0.9, 2.46, 1]}
          position={[positionKorea.x, positionKorea.y, positionKorea.z]}
        >
          <torusGeometry args={[0.02, 0.002, 20, 20]} />
          <meshBasicMaterial color={0x263d64} />
        </mesh>
        <mesh
          rotation={[2.3, 0.1, 0.9]}
          position={[positionAccra.x, positionAccra.y, positionAccra.z]}
        >
          <torusGeometry args={[0.02, 0.002, 20, 20]} />
          <meshBasicMaterial color={0x263d64} />
        </mesh>
        <mesh>
          <tubeGeometry args={[curve, 20, 0.003]} />
          <meshBasicMaterial map={texture} />
        </mesh>
      </group>
    );
  };

  // 한국, 가나 좌표
  const koreahPoint = {
    lat: 37.56668 * (Math.PI / 180),
    lng: 126.97841 * (Math.PI / 180),
  };
  const accraPoint = {
    lat: 50.55363 * (Math.PI / 180),
    lng: -0.196481 * (Math.PI / 180),
  };

  const covertLatLngToPos = (
    pos: { lat: number; lng: number },
    radius: number
  ) => {
    const x = Math.cos(pos.lat) * Math.sin(pos.lng) * radius;
    const y = Math.sin(pos.lat) * radius;
    const z = Math.cos(pos.lat) * Math.cos(pos.lng) * radius;
    return { x, y, z };
  };

  const positionKorea = covertLatLngToPos(koreahPoint, 1.3);
  const positionAccra = covertLatLngToPos(accraPoint, 1.3);
  const positionCurve = [];
  for (let i = 0; i <= 100; i++) {
    const pos = new THREE.Vector3().lerpVectors(
      new THREE.Vector3(positionKorea.x, positionKorea.y, positionKorea.z),
      new THREE.Vector3(positionAccra.x, positionAccra.y, positionAccra.z),
      i / 100
    );
    pos.normalize();
    const wave = Math.sin((Math.PI * i) / 100);
    pos.multiplyScalar(1.3 + 0.3 * wave);
    positionCurve.push(pos);
  }
  const curve = new THREE.CatmullRomCurve3(positionCurve);

  // 그라디언트 색 찾기
  const getGradientCanvas = (startColor: any, endColor: any) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 256;
    canvas.height = 1;

    const gradient = context!.createLinearGradient(0, 0, 256, 0);
    gradient!.addColorStop(0, startColor);
    gradient!.addColorStop(1, endColor);

    context!.fillStyle = gradient;
    context?.fillRect(0, 0, 256, 1);
    return canvas;
  };

  const gradientCanvas = getGradientCanvas("#ff0000", "#33ff00");
  const texture = new THREE.CanvasTexture(gradientCanvas);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <Environment
          background
          files={"./src/assets/earth/qwantani_puresky_4k.hdr"}
        />
        <PerspectiveCamera far={100} near={0.1} fov={75} />
        <OrbitControls enableDamping dampingFactor={0.1} />
        <directionalLight
          intensity={5}
          position={[2.65, 2.13, 1.02]}
          color={0xffffff}
        />
        <Earth />
      </Canvas>
    </div>
  );
};

export default Earth;
