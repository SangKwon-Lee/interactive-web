/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Engine,
  MouseConstraint,
  Render,
  Runner,
  Mouse,
  Composite,
  Bodies,
  Events,
} from "matter-js";
import "../../style/rotateCanvas.css";
import { useEffect, useRef, useState } from "react";
import IconAFRAME from "../../assets/matter/icon_AFRAME.png";
import IconCSS from "../../assets/matter/icon_CSS.png";
import IconHTML from "../../assets/matter/icon_HTML.png";
import IconJS from "../../assets/matter/icon_JS.png";
import IconREACT from "../../assets/matter/icon_REACT.png";
import IconTHREE from "../../assets/matter/icon_THREE.png";

const data: any = {
  JS: { title: "Javascript" },
  REACT: { title: "React" },
  CSS: { title: "Css" },
  AFRAME: { title: "Aframe.js" },
  THREE: { title: "Three.js" },
  HTML: { title: "Html" },
};

export default function RotateCanvas() {
  const canvasRef = useRef<any>(null);
  const [selected, setSelected] = useState(data.JS);

  useEffect(() => {
    const canvas = canvasRef.current;
    const cw = 1000;
    const ch = 1000;

    const gravityPower = 1.5;
    let gravityDeg = 0;

    let engine: any, render: any, runner: any, mouse: any, mouseConstraint: any;
    let observer: any;

    initScene();
    initMouse();
    initIntersectionObserver();
    initGround();
    initImageBoxes();

    Events.on(mouseConstraint, "mousedown", () => {
      const newSelected =
        mouseConstraint.body && data[mouseConstraint.body.label];
      console.log(newSelected);
      setSelected(newSelected);
    });

    Events.on(runner, "tick", () => {
      gravityDeg += 1;
      engine.world.gravity.x =
        gravityPower * Math.cos((Math.PI / 180) * gravityDeg);
      engine.world.gravity.y =
        gravityPower * Math.sin((Math.PI / 180) * gravityDeg);
    });

    canvas.addEventListener("mousewheel", () => {
      addRect(mouse.position.x, mouse.position.y, 50, 50);
    });

    function initScene() {
      engine = Engine.create();
      render = Render.create({
        canvas: canvas,
        engine: engine,
        options: {
          width: cw,
          height: ch,
          wireframes: false,
          background: "#1b1b19",
        },
      });
      runner = Runner.create();

      Render.run(render);
      Runner.run(runner, engine);
    }

    function initMouse() {
      mouse = Mouse.create(canvas);
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
      });
      Composite.add(engine.world, mouseConstraint);

      canvas.removeEventListener("mousewheel", mouse.mousewheel);
      canvas.removeEventListener("DOMMouseScroll", mouse.mousewheel);
    }

    function initIntersectionObserver() {
      const options = {
        threshold: 0.1,
      };
      observer = new IntersectionObserver((entires) => {
        const canvasEntry = entires[0];
        if (canvasEntry.isIntersecting) {
          runner.enabled = true;
          Render.run(render);
        } else {
          runner.enabled = false;
          Runner.stop(render);
        }
      }, options);
      observer.observe(canvas);
    }

    function initGround() {
      const segments = 32;
      const deg = (Math.PI * 2) / segments;
      const width = 50;
      const radius = cw / 2 + width / 2;
      const height = radius * Math.tan(deg / 2) * 2;

      for (let i = 0; i < segments; i++) {
        const theta = deg * i;
        const x = radius * Math.cos(theta) + cw / 2;
        const y = radius * Math.sin(theta) + ch / 2;
        addRect(x, y, width, height, { isStatic: true, angle: theta });
      }
    }

    function initImageBoxes() {
      const scale = 0.7;
      const t1 = { w: 250 * scale, h: 250 * scale };
      const t2 = { w: 732 * scale, h: 144 * scale };

      addRect(cw / 2, ch / 2, t1.w, t1.h, {
        label: "JS",
        chamfer: { radius: 20 },
        render: { sprite: { texture: IconJS, xScale: scale, yScale: scale } },
      });
      addRect(cw / 2 - t1.w, ch / 2, t1.w, t1.h, {
        label: "CSS",
        chamfer: { radius: 20 },
        render: { sprite: { texture: IconCSS, xScale: scale, yScale: scale } },
      });
      addRect(cw / 2 + t1.w, ch / 2, t1.w, t1.h, {
        label: "HTML",
        chamfer: { radius: 20 },
        render: { sprite: { texture: IconHTML, xScale: scale, yScale: scale } },
      });
      addRect(cw / 2, ch / 2 + t1.h, t1.w, t1.h, {
        label: "THREE",
        chamfer: { radius: 20 },
        render: {
          sprite: { texture: IconTHREE, xScale: scale, yScale: scale },
        },
      });
      addRect(cw / 2 - t1.w, ch / 2 + t1.h, t1.w, t1.h, {
        label: "REACT",
        chamfer: { radius: 75 },
        render: {
          sprite: { texture: IconREACT, xScale: scale, yScale: scale },
        },
      });
      addRect(cw / 2, ch / 2 - t2.h + t2.h, t2.w, t2.h, {
        label: "AFRAME",
        chamfer: { radius: 20 },
        render: {
          sprite: { texture: IconAFRAME, xScale: scale, yScale: scale },
        },
      });
    }

    function addRect(x: number, y: number, w: number, h: number, options = {}) {
      const rect = Bodies.rectangle(x, y, w, h, options);
      Composite.add(engine.world, rect);
    }

    return () => {
      observer.unobserve(canvas);
      Composite.clear(engine.world, false);
      Mouse.clearSourceEvents(mouse);
      Runner.stop(runner);
      Render.stop(render);
      Engine.clear(engine);
    };
  }, []);

  return (
    <div className="rotate-canvas-wrapper">
      <canvas ref={canvasRef}></canvas>
      <aside>
        <h2>Drag & Wheel </h2>
        <h1>{selected?.title}</h1>
      </aside>
    </div>
  );
}
