/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from "react";
import * as THREE from "three";
//@ts-ignore
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GUI } from "lil-gui";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
export default function ScrollWave() {
  const gui = new GUI();
  gsap.registerPlugin(ScrollTrigger);
  async function init() {
    const params = {
      waveColor: "#00ffff",
      backgroundColor: "#ffffff",
      fogColor: "#f0f0f0",
    };
    const canvas = document.querySelector("#canvas")! as HTMLCanvasElement;
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
    });
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const clock = new THREE.Clock();

    // 카메라 생성
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    camera.position.set(0, 25, 150);

    scene.fog = new THREE.Fog(0xf0f0f0, 0.1, 500);

    const waveGeometry = new THREE.PlaneGeometry(1500, 1500, 150, 150);
    const waveMaterial = new THREE.MeshStandardMaterial({
      color: params.waveColor,
    });

    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    wave.receiveShadow = true;
    wave.rotation.x = -Math.PI / 2;

    const waveHeight = 2.5;
    const initailZPosition: any = [];

    for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
      const z =
        waveGeometry.attributes.position.getZ(i) +
        (Math.random() - 0.5) * waveHeight;
      waveGeometry.attributes.position.setZ(i, z);
      initailZPosition.push(z);
    }

    function WaveUpdate() {
      const elapsedTime = clock.getElapsedTime();
      for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
        const z =
          initailZPosition[i] + Math.sin(elapsedTime * 3 + i ** 2) * waveHeight;
        waveGeometry.attributes.position.setZ(i, z);
      }
      waveGeometry.attributes.position.needsUpdate = true;
    }

    scene.add(wave);

    const gltfLoader = new GLTFLoader();
    const gltf = await gltfLoader.loadAsync("./src/assets/ship/scene.gltf");
    const ship = gltf.scene;
    ship.scale.set(40, 40, 40);
    ship.castShadow = true;
    ship.traverse((object: any) => {
      if (object.isMesh) {
        object.castShadow = true;
      }
    });

    ship.update = function () {
      const elapsedTime = clock.getElapsedTime();
      ship.position.y = 18 + Math.sin(elapsedTime * 3);
    };
    ship.rotation.y = Math.PI / 2;

    scene.add(ship);

    const pointLight = new THREE.PointLight(0xffffff, 500);
    pointLight.position.set(15, 15, 15);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    pointLight.shadow.radius = 10;
    scene.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(-15, 15, 15);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.radius = 10;
    scene.add(directionalLight);

    gui.add(scene.fog, "near").min(0).max(100).step(0.1);
    gui.add(scene.fog, "far").min(100).max(500).step(0.1);

    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    }

    function render() {
      renderer.render(scene, camera);
      WaveUpdate();
      ship.update();
      camera.lookAt(ship.position);
      requestAnimationFrame(render);
    }
    render();

    window.addEventListener("resize", handleResize);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".wrapper",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    tl.to(params, {
      waveColor: "#4268ff",
      onUpdate: () => {
        waveMaterial.color = new THREE.Color(params.waveColor);
      },
      duration: 1.5,
    })
      .to(
        params,
        {
          backgroundColor: "#2a2a2a",
          onUpdate: () => {
            scene.background = new THREE.Color(params.backgroundColor);
          },
          duration: 1.5,
        },
        "<"
      )
      .to(
        params,
        {
          fogColor: "#2f2f2f",
          onUpdate: () => {
            //@ts-ignore
            scene.fog.color = new THREE.Color(params.fogColor);
          },
          duration: 1.5,
        },
        "<"
      )
      .to(camera.position, {
        x: 100,
        z: -50,
        duration: 2.5,
      })
      .to(ship.position, {
        z: 150,
        duration: 2,
      })
      .to(camera.position, {
        x: -50,
        y: 25,
        z: 100,
        duration: 2,
      })
      .to(camera.position, {
        x: 0,
        y: 50,
        z: 300,
        duration: 2,
      });

    gsap.to(".title", {
      opacity: 0,
      scrollTrigger: {
        trigger: ".wrapper",
        scrub: true,
        pin: true,
        end: "+=1000",
      },
    });

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
      <canvas
        style={{ position: "fixed", top: 0, left: 0 }}
        id="canvas"
      ></canvas>
      <div
        className="wrapper"
        style={{ position: "relative", minHeight: "1000vh" }}
      >
        <h3
          className="title"
          style={{
            fontFamily: "monospace",
            padding: "120px 0px",
            margin: 0,
            fontSize: "64px",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Kogong Scroll
        </h3>
      </div>
    </>
  );
}
