/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import * as THREE from "three";

interface Props {
  x: number;
  y: number;
}

export default class Firework {
  points: THREE.Points<
    THREE.BufferGeometry<THREE.NormalBufferAttributes>,
    THREE.PointsMaterial
  >;
  constructor({ x, y }: Props) {
    const count = 1000 + Math.round(Math.random() * 5000);
    const velocity = 10 + Math.random() * 10;
    const particlesGeometry = new THREE.BufferGeometry();

    this.particles = [];

    for (let i = 0; i < count; i++) {
      const particle = new THREE.Vector3(x, y, 0);

      particle.theta = Math.random() * Math.PI * 2;
      particle.phi = Math.random() * Math.PI * 2;

      particle.deltaX =
        velocity * Math.sin(particle.theta) * Math.cos(particle.phi);
      particle.deltaY =
        velocity * Math.sin(particle.theta) * Math.sin(particle.phi);
      particle.deltaZ = velocity * Math.cos(particle.theta);

      this.particles.push(particle);
    }

    particlesGeometry.setFromPoints(this.particles);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("./src/assets/particle3d/particle.png");

    const particleMaterial = new THREE.PointsMaterial({
      size: 1,
      alphaMap: texture,
      transparent: true,
      depthWrite: false,
      color: new THREE.Color(Math.random(), Math.random(), Math.random()),
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(particlesGeometry, particleMaterial);

    this.points = points;
  }

  update() {
    const position = this.points.geometry.attributes.position;

    for (let i = 0; i < this.particles.length; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);

      position.setX(i, x + this.particles[i].deltaX);
      position.setY(i, y + this.particles[i].deltaY);
      position.setZ(i, z + this.particles[i].deltaZ);
    }

    position.needsUpdate = true;
  }
}
