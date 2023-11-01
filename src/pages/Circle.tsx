/* eslint-disable @typescript-eslint/no-explicit-any */
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import Particle from "../js/circle/Particle";
import circleIcon from "../assets/circle/circle.png";
export default function Circle() {
  const canvasRef = useRef<any>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio > 1 ? 2 : 1;
    let canvasWidth = innerWidth;
    let canvasHeight = innerWidth;
    const fps = 60;
    const interval = 1000 / fps;

    let particles: any = [];

    function init() {
      canvasWidth = innerWidth;
      canvasHeight = innerHeight;
      canvas.style.width = canvasWidth + "px";
      canvas.style.height = canvasHeight + "px";
      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;
      ctx.scale(dpr, dpr);
    }

    function createRing() {
      const PARTICLE_NUM = 800;
      for (let i = 0; i < PARTICLE_NUM; i++) {
        particles.push(new Particle(canvasWidth, canvasHeight));
      }
    }

    function render() {
      let now, delta;
      let then = Date.now();

      const frame = () => {
        requestAnimationFrame(frame);
        now = Date.now();
        delta = now - then;
        if (delta < interval) return;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        for (let i = particles.length - 1; i >= 0; i--) {
          particles[i].update();
          particles[i].draw(ctx);
          if (particles[i].opacity <= 0) particles.splice(i, 1);
        }

        // then = now - (delta % interval);
      };

      requestAnimationFrame(frame);
    }

    let animation = "off";

    window.addEventListener("click", () => {
      const click = document.getElementById("click");
      if (animation !== "ing") {
        animation = "ing";
        const ringImg = document.querySelector("#ring");
        gsap.fromTo(
          ringImg,
          { opacity: 1 },
          {
            opacity: 0,
            duration: 1,
            delay: 1,
            onStart: () => {
              createRing();
            },
            onended: () => {
              gsap.fromTo(click, { opacity: 0 }, { opacity: 1, delay: 2 });
              gsap.fromTo(ringImg, { opacity: 0 }, { opacity: 1, delay: 2 });
              setTimeout(() => {
                animation = "off";
              }, 4000);
            },
          }
        );
      }
    });
    init();
    render();
  }, []);

  return (
    <main
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <canvas ref={canvasRef}></canvas>
      <script type="module" src="./index.js"></script>
      <img
        src={circleIcon}
        id="ring"
        style={{
          position: "absolute",
          width: "50vh",
          height: "50vh",
          zIndex: 5,
        }}
      />
    </main>
  );
}
