// This system centralizes power consumption in low-voltage no-cable grids.
// Most devices in station will be connected to these grids for simplicity.
// Long-range energy distribution will require high-voltage.
//
// {id:'computer-1', powered: true, powerCons: 500}
// {id:'computer-2', powered: false, powerCons: 1}
// {id:'cable-7', powered: true, powerCons: 0}
// {id:'generator', powered: true, powerCons: -5000}
const DEFAULT_GENERATOR_RANGE = 20;

export function initializeElectrics(sector) {
  let grids = [];

  return {
    tick() { tickGrids(sector); }
  };
}

function tickGrids(sector) {
  // set up power generators
  let generators = sector.getEntities()
  .filter( e => e.powerCons < 0 );

  generators.forEach( generator => {
    generator.devices = [];
    let generatorCell = sector.getCell(generator.x, generator.y);
    generatorCell.powerGrid = {
      generatorId: generator.id,
      generator: generator,
      ttl: DEFAULT_GENERATOR_RANGE
    };
  });

  // spread the grid to adjacent cells
  sector.getCellsCheckered()
  .forEach( cell => {
    balanceGrids(cell, sector.getCell(cell.x+1, cell.y));
    balanceGrids(cell, sector.getCell(cell.x, cell.y+1));
  });

  // each generator gets a list of things it powers
  sector.getEntities()
  .filter( e => e.powerCons > 0 )
  .forEach( device => {
    let grid = sector.getCell(device.x, device.y).powerGrid;
    if (!grid) return;
    grid.generator.devices.push(device);
  });

  // balance power within the grid
  generators.forEach( generator => {
    let powerDrain = generator.devices.reduce(powerConsReducer);
    let outputPower = generator.powerCons * -1;
    if (powerDrain < outputPower) {
      generator.powerDrain = 0;
      generator.devices.forEach( e => e.powered = false );
    } else {
      generator.powerDrain = powerDrain;
      generator.devices.forEach( e => e.powered = true );
    }
  });
}

function balanceGrids(cell1, cell2) {
  let grid1 = cell1.powerGrid || {ttl: 0};
  let grid2 = cell2.powerGrid || {ttl: 0};
  if (grid1.ttl > grid2.ttl) {
    cell2.powerGrid = {
      generatorId: grid1.generatorId,
      generator: grid1.generator,
      ttl: grid1.ttl - 1
    }
  }
  if (grid2.ttl > grid1.ttl) {
    cell1.powerGrid = {
      generatorId: grid2.generatorId,
      generator: grid2.generator,
      ttl: grid1.ttl - 1
    }
  }
}

function powerConsReducer(total, entity) {
  return total + entity.powerCons;
}
