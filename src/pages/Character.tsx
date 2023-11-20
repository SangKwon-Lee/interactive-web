/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect } from "react";
import * as THREE from "three";
//@ts-ignore
import { OrbitControls } from "three/addons/controls/OrbitControls";
//@ts-ignore
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Character = () => {
  async function init() {
    const renderer = new THREE.WebGLRenderer({
      // alpha: true,
      antialias: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
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
    camera.position.set(0, 5, 30);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 15;
    controls.maxDistance = 50;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 2;

    const progressBar = document.querySelector("#progress-bar");
    const progressBarContainer = document.querySelector(
      "#progress-bar-container"
    );
    const loadingManager = new THREE.LoadingManager();

    const gltfLoader = new GLTFLoader(loadingManager);
    loadingManager.onProgress = (_, loaded, total) => {
      //@ts-ignore
      progressBar.value = (loaded / total) * 100;
    };
    loadingManager.onLoad = () => {
      //@ts-ignore
      progressBarContainer.style.display = "none";
    };
    const gltf = await gltfLoader.loadAsync("./src/js/models/character.gltf");
    const model = gltf.scene;
    model.scale.set(0.1, 0.1, 0.1);
    model.traverse((object: any) => {
      if (object.isMesh) {
        object.castShadow = true;
      }
    });
    scene.add(model);

    camera.lookAt(model.position);

    const planeGeometry = new THREE.PlaneGeometry(10000, 10000, 10000);
    const planeMaterial = new THREE.MeshPhongMaterial({
      color: 0x000000,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -7.5;
    plane.receiveShadow = true;
    scene.add(plane);

    // 빛
    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    ambientLight.position.set(-5, -5, -5);
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333);
    hemisphereLight.position.set(0, 20, 10);
    scene.add(hemisphereLight);

    const spotLight = new THREE.SpotLight(
      0xffffff,
      50,
      1000,
      Math.PI / 2,
      0.5,
      0.5
    );
    spotLight.position.set(0, 20, 0);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.radius = 8;
    scene.add(spotLight);

    // 애니메이션 버튼 생성 및 클릭시 애니메이션 실행
    const mixer = new THREE.AnimationMixer(model);
    const buttons = document.querySelector(".actions");
    const combatAnimation = gltf.animations.slice(0, 5);
    const randomAnimation = gltf.animations.slice(5);
    let currentAction: any;
    combatAnimation.forEach((animation: any) => {
      //@ts-ignore
      if (buttons?.childNodes.length < 5) {
        const button = document.createElement("button");
        button.innerHTML = animation.name;
        button.style.width = "100px";
        button.style.height = "100px";
        button.style.borderRadius = "50%";
        button.style.color = "white";
        button.style.backgroundColor = "rgba(11,217,206,0.8)";
        button.style.cursor = "pointer";
        button.style.border = "none";
        button.style.outline = "none";
        button.addEventListener("click", () => {
          const previouseAction = currentAction;
          currentAction = mixer.clipAction(animation);

          if (previouseAction !== currentAction) {
            previouseAction.fadeOut(0.5);
            currentAction.reset().fadeIn(0.5).play();
          }
        });
        buttons?.appendChild(button);
      }
    });

    // 애니메이션 첫 실행
    const hasAnimation = gltf.animations.length !== 0;
    if (hasAnimation) {
      currentAction = mixer.clipAction(gltf.animations[0]);
      currentAction.play();
    }

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const clock = new THREE.Clock();

    function handlePointDown(event: any) {
      //이렇게 하면 x,y가 0~1사이의 값 + 화면에 따른 상대 값으로 나옴
      //y에 -를 하는 이유는 THREE에서는 위아래가 반전
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = -(event.clientY / window.innerHeight - 0.5) * 2;
      // 공간에서 직선을 표현하기 위해 2점이 필요한데, 하나의 점은 내가 찍고, 하나의 점은 카메라로부터 시작하는 함수
      raycaster.setFromCamera(pointer, camera);

      const intersects = raycaster.intersectObjects(scene.children);

      const object = intersects[0]?.object;

      if (object?.name === "Ch46") {
        const previouseAction = currentAction;
        const index = Math.round(Math.random() * (randomAnimation.length - 1));
        currentAction = mixer.clipAction(randomAnimation[index]);

        // 애니메이션 연속 재생 멈추기
        currentAction.loop = THREE.LoopOnce;
        // 애니메이션 마지막 모션에 멈추기
        currentAction.clampWhenFinished = true;

        if (previouseAction !== currentAction) {
          previouseAction.fadeOut(0.5);
          currentAction.reset().fadeIn(0.5).play();
        }

        mixer.addEventListener("finished", handleFinished);
      }
    }

    function handleFinished() {
      const previouseAction = currentAction;
      currentAction = mixer.clipAction(combatAnimation[0]);
      previouseAction.fadeOut(0.5);
      currentAction.reset().fadeIn(0.5).play();
    }

    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    }
    render();

    function render() {
      // 애니메이션 업데이트
      const delta = clock.getDelta();
      mixer.update(delta);

      controls.update();

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointerdown", handlePointDown);

    return () => {
      renderer.forceContextLoss();
      renderer.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }

  useEffect(() => {
    init();
  }, []);
  return (
    <>
      <div
        className="actions"
        style={{
          position: "absolute",
          left: "50%",
          bottom: "120px",
          transform: "translateX(-50%)",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          zIndex: 1,
          gap: "16px",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0, 0.8)",
        }}
        id="progress-bar-container"
      >
        <label form="progress-bar">Loading...</label>
        <progress
          style={{
            width: "30%",
            height: "2%",
            marginTop: "4px",
          }}
          id="progress-bar"
          value={0}
          max="100"
        ></progress>
      </div>
    </>
  );
};

export default Character;
