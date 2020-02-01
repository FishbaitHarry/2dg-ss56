import { initializeAtmos } from './systems/atmos.js';
import { initializeKinetics } from './systems/kinetics.js';
import { initializeElectrics } from './systems/electrics.js';
import { initializeDoors } from './systems/doors.js';
import { initializeCharacters } from './systems/characters.js';

export function initializeSimulator(sector) {

  let systems = [
    initializeAtmos(sector),
    initializeCharacters(sector),
    initializeKinetics(sector),
    initializeDoors(sector),
    // initializeElectrics(sector)
  ];

  return {
    tick() { systems.forEach( sys => sys.tick() ) }
  };
}
