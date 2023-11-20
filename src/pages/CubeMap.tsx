/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect } from "react";
import * as THREE from "three";
//@ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "lil-gui";
export default function CubeMap() {
  const gui = new GUI();

  function init() {
    const renderer = new THREE.WebGLRenderer({
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
      10000
    );

    camera.position.z = 100;

    // 큐브맵 3차원 공간
    // const controls = new OrbitControls(camera, renderer.domElement);

    // controls.minDistance = 5;
    // controls.maxDistance = 100;

    // const textuerLoader = new THREE.TextureLoader().setPath(
    //   "./src/assets/yokohama/"
    // );

    // const images = [
    //   "posx.jpg",
    //   "negx.jpg",
    //   "posy.jpg",
    //   "negy.jpg",
    //   "posz.jpg",
    //   "negz.jpg",
    // ];

    // const geometry = new THREE.BoxGeometry(5000, 5000, 5000);
    // const materials = images.map(
    //   (image) =>
    //     new THREE.MeshBasicMaterial({
    //       map: textuerLoader.load(image),
    //       side: THREE.BackSide,
    //     })
    // );

    // const skybox = new THREE.Mesh(geometry, materials);
    // scene.add(skybox);

    // new OrbitControls(camera, renderer.domElement);

    // const cubeTextureLoader = new THREE.CubeTextureLoader().setPath(
    //   "./src/assets/yokohama/"
    // );

    // const images = [
    //   "posx.jpg",
    //   "negx.jpg",
    //   "posy.jpg",
    //   "negy.jpg",
    //   "posz.jpg",
    //   "negz.jpg",
    // ];

    // const cubeTexture = cubeTextureLoader.load(images);

    // scene.background = cubeTexture;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.reversed = true;

    const textureLoader = new THREE.TextureLoader().setPath(
      "./src/assets/yokohama/"
    );
    const texture = textureLoader.load("village.png");

    texture.mapping = THREE.EquirectangularRefractionMapping;

    scene.background = texture;

    const sphereGeometry = new THREE.SphereGeometry(30, 50, 50);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      envMap: texture,
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    gui.add(sphereMaterial, "reflectivity").min(0).max(1).step(0.01);
    gui
      .add(texture, "mapping", {
        Reflection: THREE.EquirectangularReflectionMapping,
        Refraction: THREE.EquirectangularRefractionMapping,
      })
      .onChange(() => {
        sphereMaterial.needsUpdate = true;
      });

    gui.add(sphereMaterial, "refractionRatio").min(0).max(1).step(0.01);

    render();

    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    }

    function render() {
      renderer.render(scene, camera);
      controls.update();
      requestAnimationFrame(render);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      renderer.forceContextLoss();
      renderer.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
}
