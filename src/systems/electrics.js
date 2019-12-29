// This system centralizes power consumption.
//
// {id:'computer-1', powered: true, powerCons: 500}
// {id:'computer-2', powered: false, powerCons: 1}
// {id:'cable-7', powered: true, powerCons: 0}
// {id:'generator', powered: true, powerCons: -5000}
export function initializeElectrics(sector) {
  let grids = [];

  return {
    tick() {}
  };
}

function makeNewGrid() {
  return {
    id: 'new-grid',
    flow: 0,
    inputs: [],
    outputs: []
  };
}

function powerConsReducer(total, entity) {
  return total + entity.powerCons;
}
function balanceGrid(grid) {
  grid.totalIn = -1*grid.inputs.reduce(powerConsReducer);
  grid.totalOut = grid.outputs.reduce(powerConsReducer);
  if (grid.totalIn < grid.totalOut) {
    grid.flow = 0;
    grid.outputs.forEach( e => e.powered = false );
  } else {
    grid.flow = grid.totalOut;
    grid.outputs.forEach( e => e.powered = true );
  }
}

function balanceVoltage(sector) {
  sector.getCells().forEach( cell => {
    let horizontalNeighbor = sector.getCell(cell.x+1, cell.y);
    let verticalNeighbor = sector.getCell(cell.x, cell.y+1);
    balanceVoltageBetween(cell, horizontalNeighbor);
    balanceVoltageBetween(cell, verticalNeighbor);
  });
}