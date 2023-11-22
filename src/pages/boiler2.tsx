/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useRef } from "react";
import * as THREE from "three";
//@ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Boiler2 = () => {
  const container = useRef(null);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
  });

  console.log(container.current);
  //@ts-ignore
  // const container = document.querySelector("#container");

  const canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const scene = new THREE.Scene();
  // 카메라 시야각, 카메라 종횡비각(width/height로 해야 찌그러지지 않음),이 거리보다 가까우면 물체가 안 보임, 거리보다 멀어지면 안 보임
  const camera = new THREE.PerspectiveCamera(
    75,
    canvasSize.width / canvasSize.height,
    0.1,
    100
  );
  camera.position.set(0, 0, 3);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  const draw = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
    controls.update();
  };

  const init = () => {
    draw();
    resize();
  };

  const resize = () => {
    canvasSize.width = window.innerWidth;
    canvasSize.height = window.innerHeight;
    camera.aspect = canvasSize.width / canvasSize.height;
    camera.updateProjectionMatrix();

    renderer.setSize(canvasSize.width, canvasSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  window.addEventListener("resize", resize);

  init();

  return (
    <div
      id="container"
      ref={container}
      style={{ position: "fixed", top: "0px", left: "0px", outline: "none" }}
    ></div>
  );
};

export default Boiler2;
