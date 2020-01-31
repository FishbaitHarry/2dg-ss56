import { initializeSector } from "./sector.js";
import { initializeSimulator } from "./simulator.js";
import { initializeRenderer } from "./renderer.js";

let sector = initializeSector();
let simulator = initializeSimulator(sector);
let renderer = initializeRenderer(sector);

setInterval(loopIt, 500);
function loopIt() {
  simulator.tick();
  renderer.render();
  console.log('FPS');
}