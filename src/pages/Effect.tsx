/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
//@ts-ignore
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
//@ts-ignore
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
//@ts-ignore
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass";
//@ts-ignore
import { HalftonePass } from "three/examples/jsm/postprocessing/HalftonePass";
//@ts-ignore
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
//@ts-ignore
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";

export default function Effects() {
  const { gl, scene, camera } = useThree();
  const composer = useMemo(() => {
    const composer = new EffectComposer(gl);
    composer.addPass(new RenderPass(scene, camera));

    const afterimagePass = new AfterimagePass();
    composer.addPass(afterimagePass);

    //@ts-ignore
    const halftonePass = new HalftonePass(0, 0, {
      radius: 10,
      shape: 1,
      scatter: 0,
      blending: 1,
    });
    // composer.addPass(halftonePass);

    const unrealBloomPass = new UnrealBloomPass(0.1, 0.1);
    unrealBloomPass.strength = 1;
    unrealBloomPass.threshold = 0.3;
    unrealBloomPass.radius = 1;
    composer.addPass(unrealBloomPass);

    const shaderPass = new ShaderPass(GammaCorrectionShader);
    composer.addPass(shaderPass);

    return composer;
  }, []);

  return useFrame((_, delta) => composer.render(delta), 1);
}
