/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
//@ts-ignore
import { TextureLoader } from "three/src/loaders/TextureLoader";
const Earth3 = () => {
  const earthMap = useLoader(
    TextureLoader,
    "./src/assets/earth/earth_black.png"
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        style={{
          background: "#000000",
        }}
        gl={{
          alpha: true,
        }}
      >
        <PerspectiveCamera far={100} near={0.1} fov={75} position={[0, 0, 2]} />
        <OrbitControls enableDamping dampingFactor={0.1} />
        <mesh>
          <sphereGeometry args={[1, 30, 30]} />
          <shaderMaterial
            uniforms={{
              uTexture: {
                value: earthMap,
              },
            }}
            transparent
            fragmentShader="
            uniform sampler2D uTexture;
            varying vec2 vUv;
            void main()
            {
              vec4 map = texture2D(uTexture, vUv);
              vec3 col = 1.0 - map.rgb;
              float alpha = col.r;

              vec3 greenColor = vec3(0.0, 1.0, 0.0);
              col = greenColor;
              
              gl_FragColor = vec4(col, alpha);
              
              float x = fract(vUv.x * 100.0);
              float y = fract(vUv.y * 100.0);

              float dist = length(vec2(x, y) - 0.5);

              vec3 greenCol = vec3(0.0, 1.0, 0.0);

              vec3 finalCol = mix(greenColor, vec3(0.0), step(0.1, dist));
              finalCol.g += map.r * 2.0;

              gl_FragColor = vec4(finalCol, alpha * finalCol.g);
            }"
            vertexShader="
            varying vec2 vUv;
            void main()
            {
              gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
              vUv = uv;
            }
            "
            side={2}
          />
        </mesh>
        <mesh rotation-y={-Math.PI}>
          <shaderMaterial
            uniforms={{
              uTexture: {
                value: earthMap,
              },
            }}
            vertexShader="
            uniform sampler2D uTexture;
            varying vec2 vUv;
            void main()
            {
              vec4 map = texture2D(uTexture, vUv);
              vec3 col = 1.0 - map.rgb;
              float alpha = col.r;

              vec3 greenColor = vec3(0.0,1.0,0.0);
              col = greenColor;
              
              gl_FragColor = vec4(col, alpha);
              
              float x = fract(vUv.x * 100.0);
              float y = fract(vUv.y * 100.0);

              float dist = length(vec2(x, y) - 0.5);

              vec3 greenCol = vec3(0.0, 1.0, 0.0);

              vec3 finalCol = mix(greenColor, vec3(0.0), step(0.1, dist));
              finalCol.g += map.r * 2.0;

              gl_FragColor = vec4(finalCol, alpha * finalCol.g);
            }"
            fragmentShader="
            varying vec2 vUv;
            void main()
            {
              gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
              vUv = uv;
            }"
            side={2}
            transparent
          />
          <icosahedronGeometry args={[0.9, 40]} />
        </mesh>
      </Canvas>
    </div>
  );
};

export default Earth3;
