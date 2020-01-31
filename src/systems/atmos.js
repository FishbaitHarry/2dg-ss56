// This system centralizes pressure control.
//
// {id:'computer-1', powered: false, powerCons: 500}
export function initializeAtmos(sector) {
  let cells = sector.getCells();

  updateCellInfo(cells);
  setStartingPressure(cells);

  return {
    tick() {
      updateCellInfo(cells);
      balancePressure(sector);
    }
  };
}

function setStartingPressure(cells) {
  cells.forEach( cell => {
    cell.pressure = cell.hasFloor ? 1000 : 0;
  });
}

function updateCellInfo(cells) {
  cells.forEach( cell => {
    cell.hasFloor = cell.entities.find( e => e.floor );
    cell.hasWall = cell.entities.find( e => e.wall );
  });

}

function balancePressure(sector) {
  sector.getCells().forEach( cell => {
    let horizontalNeighbor = sector.getCell(cell.x+1, cell.y);
    let verticalNeighbor = sector.getCell(cell.x, cell.y+1);
    if (horizontalNeighbor) balancePressureBetween(cell, horizontalNeighbor);
    if (verticalNeighbor) balancePressureBetween(cell, verticalNeighbor);
  });
}

function balancePressureBetween(cell1, cell2) {
  if (!cell1.hasFloor) cell1.pressure = 0;
  if (!cell2.hasFloor) cell2.pressure = 0;
  if (cell1.hasWall || cell2.hasWall) return;
  let avgPressure = (cell1.pressure + cell2.pressure)/2;
  cell1.pressure = cell2.pressure = avgPressure;
}