/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";

interface Props {
  width: number;
  height: number;
  raduis: number;
  color: any;
}

class CardItem {
  mesh: THREE.Mesh<
    THREE.ExtrudeGeometry,
    THREE.MeshStandardMaterial,
    THREE.Object3DEventMap
  >;
  constructor({ width, height, raduis, color }: Props) {
    const x = width / 2 - raduis;
    const y = height / 2 - raduis;
    const shape = new THREE.Shape();
    shape
      .absarc(x, y, raduis, Math.PI / 2, 0, true)
      .lineTo(Number(x) + Number(raduis), -y)
      .absarc(x, -y, raduis, 0, -Math.PI / 2, true)
      .lineTo(Number(-x), -(y + raduis))
      .absarc(-x, -y, raduis, -Math.PI / 2, Math.PI, true)
      .lineTo(-(x + raduis), y)
      .absarc(-x, y, raduis, Math.PI, Math.PI / 2, true);

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.01,
      bevelThickness: 0.1,
    });
    const material = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
      roughness: 0.5,
      metalness: 0.5,
    });

    const mesh = new THREE.Mesh(geometry, material);
    this.mesh = mesh;
  }
}

export default CardItem;
