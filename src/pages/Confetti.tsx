/* eslint-disable @typescript-eslint/no-explicit-any */
import Particle from "../js/confetti/Particle";
import { useEffect, useRef } from "react";
export default function Confetti() {
  const canvasRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio > 1 ? 2 : 1;
    let canvasWidth = innerWidth;
    let canvasHeight = innerHeight;
    const interval = 1000 / 60;
    const particles: any = [];

    function init() {
      canvasWidth = innerWidth;
      canvasHeight = innerHeight;
      canvas.style.width = canvasWidth + "px";
      canvas.style.height = canvasHeight + "px";
      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;
      ctx.scale(dpr, dpr);
    }

    function confetti({ x, y, count, deg, colors, shapes, spread }: any) {
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, deg, colors, shapes, spread));
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

          if (particles[i].globalAlpha <= 0) {
            particles.splice(i, 1);
          }

          if (particles[i].y >= canvasHeight) {
            particles.splice(i, 1);
          }
        }

        // ctx.rotate는 캔버스의 0,0을 기준으로 하기 때문에 translate로 중심점을 변경해야한다.
        // -x.,-y를 주는 이유는 translate의 위치가 계속 중첩이 되기 때문에, 다시 원위치 시키는 것
      };

      requestAnimationFrame(frame);
    }

    window.addEventListener("click", () => {
      confetti({
        x: 0,
        y: 0.5,
        count: 30,
        deg: -35,
        // colors: ["],
        spread: 30,
      });
    });

    init();
    render();
  }, []);

  return (
    <main
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      <canvas ref={canvasRef}></canvas>
    </main>
  );
}
