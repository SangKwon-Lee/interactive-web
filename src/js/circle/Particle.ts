/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
//@ts-nocheck
import { randomNumBetween } from "../../utils/utils";

export default class Particle {
  constructor(innerWidth, innerHeight) {
    // 어떤 값을 0에 수렴할 때 많이 씀 혹은 가속도를 줄 때.
    this.rFriction = randomNumBetween(0.95, 1.01);
    this.rAlpha = randomNumBetween(0, 5);
    this.r = innerHeight / 4;

    this.angleFriction = randomNumBetween(0.97, 0.99);
    this.angleAlpha = randomNumBetween(1, 2);
    this.angle = randomNumBetween(0, 360);

    this.opacity = randomNumBetween(0.2, 1);
  }

  update() {
    // 각도와 반지름을 계속 + 시키면 대각선으로 이동함.
    this.rAlpha *= this.rFriction;
    this.r += this.rAlpha;

    this.angleAlpha *= this.angleFriction;
    this.angle += this.angleAlpha;

    this.x = innerWidth / 2 + this.r * Math.cos((Math.PI / 180) * this.angle);
    this.y = innerHeight / 2 + this.r * Math.sin((Math.PI / 180) * this.angle);
    this.opacity -= 0.003;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255, ${this.opacity})`;
    ctx.fill();
    ctx.closePath();
  }
}
