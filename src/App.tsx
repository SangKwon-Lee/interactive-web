import Circle from "./pages/Circle";
import Confetti from "./pages/Confetti";
import Firework from "./pages/Firework";
import Home from "./pages/Home";
import Matter from "./pages/Matter";
import { Route, Routes } from "react-router-dom";
import MouseInteractive from "./pages/MouseInteractive";
import Scroll from "./pages/Scroll";
import DropWater from "./pages/DropWater";
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
      </Routes>
    </>
  );
}

export default App;
