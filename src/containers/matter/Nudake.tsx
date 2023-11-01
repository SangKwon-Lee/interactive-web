/* eslint-disable @typescript-eslint/no-explicit-any */
import "../../style/nudake.css";
import image1 from "../../assets/matter/nudake-1.jpg";
import image2 from "../../assets/matter/nudake-2.jpg";
import image3 from "../../assets/matter/nudake-3.jpg";
import throttle from "lodash/throttle";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  drawImageCenter,
  getAngle,
  getDistance,
  getScrupedPercent,
} from "../../utils/utils";

const Nudake = () => {
  const canvasRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasParent = canvas.parentNode;
    const ctx = canvas.getContext("2d");
    const loadedImages: any = [];
    const imageSrc = [image1, image2, image3];
    let currentIndex = 0;
    let prevPos = { x: 0, y: 0 };
    let isChanging = false;

    let cavasWidth: number, canvasHeight: number;

    function resize() {
      cavasWidth = canvasParent.clientWidth;
      canvasHeight = canvasParent.clientHeight;
      canvas.style.width = cavasWidth + "px";
      canvas.style.height = canvasHeight + "px";
      canvas.width = cavasWidth;
      canvas.height = canvasHeight;

      preloadImages().then(() => drawImage());
    }

    function preloadImages() {
      return new Promise<void>((res) => {
        let loaded = 0;
        imageSrc.forEach((src) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            loaded += 1;
            loadedImages.push(img);
            if (loaded === imageSrc.length) return res();
          };
        });
      });
    }

    function drawImage() {
      isChanging = true;
      const image = loadedImages[currentIndex];
      const firstDrawing = ctx.globalCompositeOperation === "source-over";
      gsap.to(canvas, {
        opacity: 0,
        duration: firstDrawing ? 0 : 1,
        onComplete: () => {
          canvas.style.opacity = 1;
          ctx.globalCompositeOperation = "source-over";
          drawImageCenter(canvas, ctx, image);

          const nextImage = imageSrc[(currentIndex + 1) % imageSrc.length];
          canvasParent.style.backgroundImage = `url(${nextImage})`;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          prevPos = null;

          isChanging = false;
        },
      });
    }

    function onMousedown(e: any) {
      if (isChanging) return;
      canvas.addEventListener("mouseup", onMouseUp);
      canvas.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseleave", onMouseUp);
      prevPos = { x: e.offsetX, y: e.offsetY };
    }

    function onMouseUp() {
      console.log("up");
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseUp);
      canvas.removeEventListener("mousemove", onMouseMove);
    }

    function onMouseMove(e: any) {
      if (isChanging) return;
      drawCircles(e);
      checkPercent();
    }

    function drawCircles(e: any) {
      const nextPos = { x: e.offsetX, y: e.offsetY };
      if (!prevPos) prevPos = nextPos;
      const dist = getDistance(prevPos, nextPos);
      const angle = getAngle(prevPos, nextPos);

      for (let i = 0; i < dist; i++) {
        const x = prevPos.x + Math.cos(angle) * i;
        const y = prevPos.y + Math.sin(angle) * i;

        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();

        ctx.arc(x, y, cavasWidth / 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }
      prevPos = nextPos;
    }

    const checkPercent = throttle(() => {
      const percent = getScrupedPercent(ctx, cavasWidth, canvasHeight);
      // 50% 이상 그리면 이미지 넘기기
      if (percent > 50) {
        currentIndex = (currentIndex + 1) % imageSrc.length;
        drawImage();
      }
    }, 500);

    canvas.addEventListener("mousedown", onMousedown);
    window.addEventListener("resize", resize);
    resize();

    // 이거 안 하면 계속 실행됨
    return () => {
      canvas.removeEventListener("mousedown", onMousedown);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="nudake">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default Nudake;
