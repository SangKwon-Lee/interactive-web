/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import city from "../assets/firework/night_city.png";
import { useEffect, useRef } from "react";
import Particle from "../js/firework/Particle";
import Spark from "../js/firework/Spark";
import Tail from "../js/firework/Tail";
import { randomNumBetween } from "../utils/utils";
export default function Firework() {
  const canvasRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio > 1 ? 2 : 1;
    let canvasWidth = innerWidth;
    let canvasHeight = innerHeight;
    const interval = 1000 / 60;
    const particles: any = [];
    const tails: any = [];
    const sparks: any = [];

    function init() {
      canvasWidth = innerWidth;
      canvasHeight = innerHeight;
      canvas.style.width = canvasWidth + "px";
      canvas.style.height = canvasHeight + "px";
      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;
      ctx.scale(dpr, dpr);
    }

    function createTail() {
      const x = randomNumBetween(canvasWidth * 0.2, canvasWidth * 0.8);
      // 화면 높이를 가변으로 설정
      const vy = canvasHeight * randomNumBetween(0.01, 0.015) * -1;
      const colorDeg = randomNumBetween(0, 360);
      tails.push(new Tail(x, vy, colorDeg));
    }

    function createParticles(x, y, colorDeg) {
      const PARTICLE_NUM = 400;
      for (let i = 0; i < PARTICLE_NUM; i++) {
        const opacity = randomNumBetween(0.6, 0.9);
        const _colorDeg = randomNumBetween(-20, 20) + colorDeg;
        particles.push(new Particle(x, y, opacity, _colorDeg));
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

        // 알파값을 추가
        ctx.fillStyle = "#00000010"; // #00000010
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.fillStyle = `rgba(255,255,255, ${particles.length / 50000})`;

        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        if (Math.random() < 0.01) createTail();

        tails.forEach((tail, index) => {
          tail.update();
          tail.draw();

          for (let i = 0; i < Math.round(-tail.vy * 0.5); i++) {
            const vx = randomNumBetween(-5, 5) * 0.01;
            const vy = randomNumBetween(-30, 30) * 0.01;
            const opacity = Math.min(-tail.vy, 0.5);
            sparks.push(
              new Spark(tail.x, tail.y, vx, vy, opacity, tail.colorDeg)
            );
          }

          if (tail.opacity <= 0.05) {
            tails.splice(index, 1);
            createParticles(tail.x, tail.y, tail.colorDeg);
          }
        });

        sparks.forEach((spark, index) => {
          spark.update();
          spark.draw();

          if (spark.opacity <= 0.05) {
            sparks.splice(index, 1);
          }
        });

        particles.forEach((particle, index) => {
          particle.update();
          particle.draw();
          if (Math.random() < 0.1) {
            sparks.push(new Spark(particle.x, particle.y, 0, 0, 0.3, 45));
          }

          // 화면에서 안 보이는 파티클은 배열에서 지워야 랜더를 더 이상 안 함
          // 개발자도쿠 성능 모니터에서 CPU 사용량을 보면 20% 정도 감소 됨.
          if (particle.opacity <= 0) {
            particles.splice(index, 1);
          }
        });

        then = now - (delta % interval);
      };

      requestAnimationFrame(frame);
    }

    init();
    render();

    // window.addEventListener("resize", () => {
    //   canvas.init();
    // });
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
        alignItems: "center",
      }}
    >
      <img
        style={{
          position: "fixed",
          bottom: 0,
          objectPosition: "bottom",
          objectFit: "cover",
          width: "100%",
          height: "30%",
          filter: "brightness(1.5)",
        }}
        src={city}
        alt="img"
      />
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
