/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import CanvasOption from "./CanvasOption";
import { hypotenuse, randomNumBetween } from "../../utils/utils.ts";

export default class Particle extends CanvasOption {
  constructor(x, y, opacity, colorDeg) {
    super();
    // 브라우저 크기에 따라 항상 비슷한 크기의 반지름을 생성
    const 반지름 =
      randomNumBetween(2, 100) * hypotenuse(innerWidth, innerHeight) * 0.0001;
    const 각도 = (Math.PI / 180) * randomNumBetween(0, 360);
    const 원으로퍼질때X값 = 반지름 * Math.cos(각도);
    const 원으로퍼질때Y값 = 반지름 * Math.sin(각도);
    this.x = x;
    this.y = y;
    this.vx = 원으로퍼질때X값;
    this.vy = 원으로퍼질때Y값;
    this.opacity = opacity;
    this.gravity = 0.12;
    this.friction = 0.93;
    this.colorDeg = colorDeg;
  }

  update() {
    this.vy += this.gravity;

    // 점점 속도가 줄게됨
    this.vx *= this.friction;
    this.vy *= this.friction;

    // x,y는 계속 증가하면서 퍼지고, opacity는 0에 수렴함
    this.x += this.vx;
    this.y += this.vy;

    this.opacity -= 0.01;
  }

  draw() {
    this.ctx.fillStyle = `hsla(${this.colorDeg}, 100%, 65%, ${this.opacity})`;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();
  }
}
