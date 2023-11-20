/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import * as THREE from "three";
//@ts-ignore
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Firework from "../js/particle3d/particle3dItem";
export default function Particle3d() {
  function init() {
    const renderer = new THREE.WebGLRenderer({
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
      5000
    );
    camera.position.z = 5000;
    const fireworks: any = [];

    fireworks.update = function () {
      for (let i = 0; i < this.length; i++) {
        const firework = fireworks[i];

        firework.update();
      }
    };

    const firework = new Firework({ x: 0, y: 0 });

    scene.add(firework.points);

    fireworks.push(firework);

    render();

    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    }

    function render() {
      fireworks.update();

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }

    window.addEventListener("resize", handleResize);

    function handleMouseDown() {
      const firework = new Firework({
        x: THREE.MathUtils.randFloatSpread(500),
        y: THREE.MathUtils.randFloatSpread(500),
      });

      scene.add(firework.points);

      fireworks.push(firework);
    }

    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      renderer.forceContextLoss();
      renderer.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }

  useEffect(() => {
    init();
  }, []);
  return <></>;
}
