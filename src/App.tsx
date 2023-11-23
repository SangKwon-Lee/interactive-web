import Circle from "./pages/Circle";
import Confetti from "./pages/Confetti";
import Firework from "./pages/Firework";
import Home from "./pages/Home";
import Matter from "./pages/Matter";
import { Route, Routes } from "react-router-dom";
import MouseInteractive from "./pages/MouseInteractive";
import Scroll from "./pages/Scroll";
import DropWater from "./pages/DropWater";
import Cube from "./pages/Cube";
import Text from "./pages/Text";
import Card from "./pages/Card";
import ScrollWave from "./pages/ScrollWave";
import Particle from "./pages/Particle3d";
import CubeMap from "./pages/CubeMap";
import Character from "./pages/Character";
import Boiler2 from "./pages/Boiler2";
import Boiler3 from "./pages/Boiler3";
import Earth from "./pages/Earth";
import EarthPostProcessing from "./pages/EarthPostProcessing";
// import Earth3 from "./pages/Earth3";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<Home />} />
        <Route path="/confetti" element={<Confetti />} />
        <Route path="/firework" element={<Firework />} />
        <Route path="/matter" element={<Matter />} />
        <Route path="/circle" element={<Circle />} />
        <Route path="/mouse-interactive" element={<MouseInteractive />} />
        <Route path="/scroll" element={<Scroll />} />
        <Route path="/dropwater" element={<DropWater />} />
        <Route path="/cube" element={<Cube />} />
        <Route path="/text" element={<Text />} />
        <Route path="/card" element={<Card />} />
        <Route path="/scroll-wave" element={<ScrollWave />} />
        <Route path="/particle3d" element={<Particle />} />
        <Route path="/cubemap" element={<CubeMap />} />
        <Route path="/character" element={<Character />} />
        <Route path="/boiler" element={<Boiler2 />} />
        <Route path="/boiler3" element={<Boiler3 />} />
        <Route path="/earth" element={<Earth />} />
        <Route path="/earth2" element={<EarthPostProcessing />} />
        {/* <Route path="/earth3" element={<Earth3 />} /> */}
      </Routes>
    </>
  );
}

export default App;
