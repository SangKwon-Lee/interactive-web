import { useState } from "react";
import Nudake from "../containers/matter/Nudake";
import RotateCanvas from "../containers/matter/RotateCanvas";
export default function Matter() {
  const [toggled, setToggle] = useState(false);
  return (
    <div>
      <section className="section-1">
        <header>
          <h1 onClick={() => setToggle((state) => !state)}>Kogong</h1>
          <ul>
            <li>Drag Mouse</li>
          </ul>
        </header>
        <main>
          <div>{toggled ? "toggled" : <Nudake />}</div>
        </main>
      </section>
      <section className="section-4">
        <RotateCanvas />
      </section>
    </div>
  );
}
