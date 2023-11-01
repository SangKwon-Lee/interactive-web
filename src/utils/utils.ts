/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = {
  x: number;
  y: number;
};

export function getDistance(p1: Props, p2: Props) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p2.y;

  return Math.sqrt(dx * dx + dy * dy);
}

export function getAngle(p1: Props, p2: Props) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p2.y;

  // 두 점사이의 각도
  return Math.atan2(dy, dx);
}

export function getScrupedPercent(ctx: any, width: number, height: number) {
  // 이미지 불러오가
  const pixels = ctx.getImageData(0, 0, width, height);
  // pixels은 rbga로 값이 저장되며 그 중 a값만 비교하기 위해 4의 배수로 설정
  const gap = 32;
  const total = pixels.data.length / gap;
  let count = 0;

  for (let i = 0; i < pixels.data.length - 3; i += gap) {
    if (pixels.data[i + 3] === 0) count++;
  }
  return Math.round((count / total) * 100);
}

export function drawImageCenter(canvas: any, ctx: any, image: any) {
  const cw = canvas.width;
  const ch = canvas.height;
  const iw = image.width;
  const ih = image.height;

  const ir = ih / iw;
  const cr = ch / cw;

  let sx, sy, sw, sh;

  if (ir >= cr) {
    sw = iw;
    sh = sw * (ch / cw);
  } else {
    sh = ih;
    sw = sh * (cw / ch);
  }
  sx = iw / 2 - sw / 2;
  sy = ih / 2 - sh / 2;

  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, cw, ch);
}

export function randomNumBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function hexToRgb(hex: any) {
  // #FF0000 or #ff0000
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16), // FF -> 255
        g: parseInt(result[2], 16), // 00 -> 0
        b: parseInt(result[3], 16), // 00 -> 0
      }
    : null;
}

export const hypotenuse = (x: any, y: any) => {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
};
