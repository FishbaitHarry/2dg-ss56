/*
Allows building walls and doors and floors.

{
  id: 'wall-3',
  wall: true,
  spawn: [description Object], // to create new entities indirectly
  delete: true, // marks entity for deletion
}
{
  id: 'welding-tool-2',
  tool: true,
  welder: true
}

*/
export function initializeBuilds(sector) {
  return {
    tick: () => {
      disassebleWallsAndFloors(sector);
      assembleWallsAndFloors(sector);
      disassembleScaffoldings(sector);
      assembleScaffoldings(sector);
    }
  }
}

function disassebleWallsAndFloors(sector) {
  sector.getEntities()
  .filter(e=>(e.wall || e.floor) && e.weldable && e.pressedWith)
  .forEach( entity => {
    if (!entity.pressedWith.welder) {
      entity.label = 'builds-need-welder';
      return;
    }
    entity.wall = false;
    entity.floor = false;
    entity.scaffolding = true;
    entity.bulky = true;
    entity.spawn = { // spawning new entities is done in bulk
      // x, y
      // pushTo
      steel: true,
      amount: 4
    };
    entity.pressedWith = false;
  });
}

function assembleWallsAndFloors(sector) {
  sector.getEntities()
  .filter(e=>e.scaffolding && e.weldable && e.pressedWith)
  .forEach( entity => {
    let sameCell = sector.getCell(entity.x, entity.y);
    let steel = sameCell.enities.find(e=>e.steel);
    if (!steel || steel.amount < 4) {
      entity.label = 'builds-not-enough-steel';
      return;
    }
    steel.delete = true; // remove entity at end of frame
    entity.toughness = (entity.toughness || 1) + steel.amount;
    entity.wall = !!sameCell.hasFloor;
    entity.floor = !sameCell.hasFloor;
    entity.bulky = false;
    entity.scaffolding = false;
    entity.pressedWith = false;
  });
}

function disassembleScaffoldings(sector) {
  sector.getEntities()
  .filter(e=>e.scaffolding && e.pressedWith)
  .forEach( entity => {
    if (!entity.pressedWith.screwdriver) {
      entity.label = 'builds-need-screwdriver';
      return;
    }
    entity.scaffolding = false;
    entity.bulky = false;
    entity.amount = entity.toughness;
    entity.toughness = 1;
    entity.srods = true;
    entity.pressedWith = false;
  });
}

function assembleScaffoldings(sector) {
  sector.getEntities()
  .filter(e=>e.srods && e.pressedWith)
  .forEach( entity => {
    if (!entity.pressedWith.screwdriver) {
      entity.label = 'builds-need-screwdriver';
      return;
    }
    if (entity.amount < 12) {
      entity.label = 'builds-not-enough-rods';
      return;
    }
    entity.scaffolding = true;
    entity.bulky = true;
    entity.toughness = entity.amount;
    entity.amount = false;
    entity.srods = false;
    entity.pressedWith = false;
  });
}