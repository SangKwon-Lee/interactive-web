import { useEffect } from "react";
import * as THREE from "three";
export default function Card() {
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
      500
    );
    camera.position.z = 5;

    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    }
    render();

    function render() {
      renderer.render(scene, camera);
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
  }, []);
  return <></>;
}
