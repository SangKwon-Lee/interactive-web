/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import CardItem from "../js/card/CardItem";
//@ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "lil-gui";
import { gsap } from "gsap";

const colors = ["#ff6e6e", "#31e0c1", "#006fff", "#ffff00"];

export default function Card() {
  const cardColor = useRef("#ff6e6e");
  const gui = new GUI();

  function init() {
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
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
    camera.position.z = 25;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.5;
    controls.rotateSpeed = 0.75;

    // 회전 관성
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 2 - Math.PI / 3;
    controls.maxPolarAngle = ((Math.PI / 2) * Math.PI) / 3;

    //카드
    const card = new CardItem({
      width: 10,
      height: 15.8,
      raduis: 0.5,
      color: new THREE.Color(cardColor.current),
    });
    card.mesh.rotation.z = Math.PI * 0.1;
    scene.add(card.mesh);

    gsap.to(card.mesh.rotation, {
      y: -Math.PI * 4,
      duration: 2.5,
      ease: "back.out(2.5)",
    });

    // 빛
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    ambientLight.position.set(-5, -5, -5);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 5);
    const directionalLight2 = directionalLight1.clone();

    directionalLight1.position.set(1, 1, 3);
    directionalLight2.position.set(-1, 1, -3);
    scene.add(directionalLight1, directionalLight2);
    render();

    //컨트롤러
    const cardFolder = gui.addFolder("Card");

    cardFolder
      .add(card.mesh.material, "roughness")
      .min(0)
      .max(1)
      .step(0.01)
      .name("material.roughness");

    cardFolder
      .add(card.mesh.material, "metalness")
      .min(0)
      .max(1)
      .step(0.01)
      .name("material.metalness");

    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    }

    function render() {
      renderer.render(scene, camera);
      controls.update();
      card.mesh.material.color.set(cardColor.current);

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
  return (
    <>
      <div
        className="colors-container"
        style={{
          position: "absolute",
          bottom: "64px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          padding: "16px",
          gap: "16px",
          zIndex: 1,
        }}
      >
        {colors.map((data) => (
          <button
            onClick={() => {
              cardColor.current = data;
            }}
            className="color-btn"
            style={{
              backgroundColor: data,
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              outline: "none",
              border: "none",
              cursor: "pointer",
            }}
            key={data}
          ></button>
        ))}
      </div>
    </>
  );
}
