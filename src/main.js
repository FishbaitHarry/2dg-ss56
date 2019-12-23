import { initializeSector } from "./sector.js";
import { initializeSimulator } from "./simulator.js";
import { initizalizeRenderer } from "./renderer.js";

let sector = initializeSector();
let simulator = initializeSimulator(sector);
let renderer = initizalizeRenderer(sector);

setInterval(loopIt, 1000);
function loopIt() {
  simulator.tick();
  renderer.render();
}