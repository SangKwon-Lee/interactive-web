/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useEffect } from "react";
import "../style/waterdrop.css";

export default function DropWater() {
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio;
    // canvas는 기본으로 300 x 150 크기다.
    // 기본 넓이가 있어서, css로만 수정하면 안에 있는 요소들이 강제로 커지게 된다.
    // 그래서 canvas의 css와 canvas 자체 width, height를 동일하게 해주는 게 일반적이다.

    let canvasWidth;
    let canvasHeight;
    // 원 배열
    let particles;

    // 윈도우 크기가 변할 때 마다 init 실핸
    function init() {
      canvasWidth = innerWidth;
      canvasHeight = innerHeight;
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;
      // dpr이 높을 수록 선명한 그래픽
      // 1픽셀에서 dpr이 1이면 피셀이 1칸,
      // 1픽셀에서 dpr이 2면 픽셀이 4칸
      // 캔버스를 그릴 때 width, hegith, dpr을 설정한다.

      ctx.scale(dpr, dpr);
      particles = [];

      // * 원 개수
      const TOTAL = canvasWidth / 50;
      for (let i = 0; i < TOTAL; i++) {
        const x = randowNumBetween(0, canvasWidth);
        const y = randowNumBetween(0, canvasHeight);
        const radius = randowNumBetween(10, 100);
        const vy = randowNumBetween(1, 5);
        const particle = new Particle(x, y, radius, vy);
        //* 랜덤으로 생성된 원들을 밑에 forEach 안에서 draw 해준다.
        particles.push(particle);
      }
    }

    // const feGaussianBlur = document.querySelector("feGaussianBlur");
    // const feColorMatrix = document.querySelector("feColorMatrix");
    // const controls = new (function () {
    //   this.blurValue = 40;
    //   this.alphaChannel = 100;
    //   this.alphaOffset = -23;
    //   this.acc = 1.03;
    // })();

    // * 값을 변경해 볼 수 있는 컨트롤러 라이브러르
    // let gui = new dat.GUI();
    // const f1 = gui.addFolder("Gooey Effect");
    // f1.open();
    // const f2 = gui.addFolder("Particle Property");
    // f2.open();

    // f1.add(controls, "blurValue", 0, 100).onChange((value) => {
    //   feGaussianBlur.setAttribute("stdDeviation", value);
    // });
    // f1.add(controls, "alphaChannel", 1, 200).onChange((value) => {
    //   feColorMatrix.setAttribute(
    //     "values",
    //     `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${value} ${controls.alphaOffset}`
    //   );
    // });
    // f1.add(controls, "alphaOffset", -40, 40).onChange((value) => {
    //   feColorMatrix.setAttribute(
    //     "values",
    //     `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${controls.alphaChannel}} ${value}`
    //   );
    // });
    // f2.add(controls, "acc", 1, 1.5, 0.01).onChange((value) => {
    //   particles.forEach((particle) => (particle.acc = value));
    // });

    class Particle {
      // x,y 위치, 반지름, 떨어지는 속도
      constructor(x, y, radius, vy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vy = vy;
        // 가속도, 중력 효과
        this.acc = 1.03;
      }
      draw() {
        ctx.beginPath(); //Path 그리시 시작
        ctx.arc(this.x, this.y, this.radius, 0, (Math.PI / 180) * 360);
        ctx.fillStyle = "orange";
        ctx.fill();
        ctx.closePath; //Path 그리기 끝
      }
      update() {
        // 가속도, 중력 효과
        this.vy *= this.acc;
        this.y += this.vy;
      }
    }

    // * 랜덤 범위 숫자
    const randowNumBetween = (min, max) => {
      return Math.random() * (max - min + 1) + min;
    };

    let interval = 1000 / 60; // 60 fps
    let now, delta;
    let then = Date.now();

    function animate() {
      // 모니터 주사율에 따라 초당 애니메이션 함수 실행 속도가 다름
      // 144에서는 144번, 60에서는 60번 실행
      window.requestAnimationFrame(animate);
      now = Date.now();
      delta = now - then;

      if (delta < interval) return;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // * 원 그리기
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
        if (particle.y - particle.radius > canvasHeight) {
          particle.y = -particle.radius;
          particle.x = randowNumBetween(0, canvasWidth);
          particle.radius = randowNumBetween(10, 100);
          particle.vy = randowNumBetween(1, 5);
        }
      });

      // then = now - (delta % interval);
    }

    init();
    animate();

    window.addEventListener("resize", () => {
      init();
    });
  }, []);

  return (
    <main style={{ width: "100%", height: "100%", backgroundColor: "white" }}>
      <div className="main">
        <canvas></canvas>
        <svg>
          <defs>
            <filter id="gooey">
              <feGaussianBlur
                stdDeviation="40"
                in="SourceGraphic"
                result="blur"
              />
              <feColorMatrix
                in="bulr"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 100 -23"
              />
            </filter>
          </defs>
        </svg>
      </div>
    </main>
  );
}
