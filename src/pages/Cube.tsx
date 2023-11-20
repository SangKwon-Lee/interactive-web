/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect } from "react";
import * as THREE from "three";
//@ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

export default function Cube() {
  function init() {
    const renderer = new THREE.WebGL1Renderer({
      // alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
    const scene = new THREE.Scene();

    // 카메라 생성
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      500
    );

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    // controls.autoRotateSpeed = 30;
    controls.enableDamping = true;
    // controls.dampingFactor = 0.01;
    // controls.enalbeZoom = true;
    // controls.enalbePan = true;
    // controls.maxDistance = 50;
    // controls.minDistance = 10;
    // controls.maxPolarAngle = Math.PI / 2;
    // controls.minPolarAngle = Math.PI / 2;
    // controls.maxAzimuthAngle = Math.PI / 2;
    // controls.minAzimuthAngle = Math.PI / 2;

    // 큐브 생성
    const cubeGeometry = new THREE.IcosahedronGeometry(1); // 크기
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0x00ffff,
      emissive: 0x111111,
      // transparent: true,
      // opacity: 0.5,
      // wireframe: true,
      // side: THREE.DoubleSide,
    });

    // 스켈레톤 큐브 생성
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    const skeletonGeometry = new THREE.IcosahedronGeometry(2);
    const skeletonMaterial = new THREE.MeshBasicMaterial({
      wireframe: true,
      transparent: true,
      opacity: 0.2,
      color: 0xaaaaaa,
    });
    const skeleton = new THREE.Mesh(skeletonGeometry, skeletonMaterial);

    scene.add(cube, skeleton);

    // 카메라 위치 설정
    camera.position.z = 5;

    // 빛 생성
    // 조명을 추가해도 영향이 안 가는 이유는 MeshBasicMaterial이기 떄문
    // MeshBasicMaterial은 조명의 영향을 받지 않음
    // MeshBasicMaterial ->MeshStandardMaterial로 교체하면 영향을 받음
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(directionalLight);

    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
      controls.update();
    }

    const clock = new THREE.Clock();

    function render() {
      const elapesdTime = clock.getElapsedTime();
      // 각도 조절을 라디안으로 해야 하는데, 그걸 바꿔주는 메소드
      // cube.rotation.x = THREE.MathUtils.degToRad(45);
      cube.rotation.x = elapesdTime;
      cube.rotation.y = elapesdTime;
      // skeleton.rotation.x = elapesdTime * 1.5;
      // skeleton.rotation.y = elapesdTime * 1.5;
      renderer.render(scene, camera);
      controls.update();
      requestAnimationFrame(render);
    }
    render();

    window.addEventListener("resize", handleResize);

    const gui = new GUI();
    gui.add(cube.position, "y").min(-3).max(3).step(0.1);
    gui.addColor({ color: 0xffffff }, "color").onChange((value: string) => {
      cube.material.color.set(value);
    });
    return () => {
      renderer.forceContextLoss();
      renderer.dispose();
      cube.geometry.dispose();
      cube.material.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }

  useEffect(() => {
    init();
  }, []);

  return <></>;
}
