// Sector is an area of space.

export function initializeSector() {
  let size = 100;
  let cells = createCells(size);
  let mixedCells = mixCellsOrder(cells, size);
  let entities = [];

  placeStartingEntities(entities);
  entities.forEach( e => getCell(e.x, e.y).entities.push(e) );

  function getCell(x, y) {
    if (x >= size || y >= size) return null;
    return cells[y+x*size];
  }
  function addEntity(entity) {
    entities.push(entity);
    if (entity.x != null) {
      let cell = getCell(entity.x, entity.y) || [];
      cell.push(entity);
    }
  }
  function updateCells() {
    entities.forEach
  }
  function updateCoordinates(entity, coordinates) {
    let oldCell = getCell(entity.x, entity.y);
    let newCell = getCell(coordinates.x, coordinates.y);
    // update cells first
    let oldIndex = oldCell.entities.indexOf(entity);
    let lastEntity = oldCell.entities.pop();
    if (entity != lastEntity) oldCell.entities[oldIndex] = lastEntity;
    newCell.entities.push(entity);
    // then rewrite x/y
    entity.x = coordinates.x;
    entity.y = coordinates.y;
  }
  function getNeighborhood(x, y, radius) {
    let nearbyCells = [];
    for (var i = x-radius; i < x+radius; i++)
      for (var j = y-radius; j < y+radius; j++)
        if ( (x-i)*(x-i) + (y-j)*(y-j) < radius*radius )
          nearbyCells.push(getCell(i, j));
  }

  return {
    getEntities() { return entities; },
    getRootEntities() { return entities.map(e=>!e.parentId); },
    getCell,
    getCells() { return cells; },
    getMixedCells() { return mixedCells; },
    addEntity,
    updateCoordinates,
    getNeighborhood
  };
}

function newBlankEntity() {
  // return a POJO, source-of-truth entity definition, normalized
  return {
    id: 'some-entity-id', // used to synchronize data
    parentId: 'some-entity-id', // for items in bags, on people etc.
    x: 0, y: 0, // for floor and things that move on their own (can be null)

    // other props are tags and determine behavior and actions
    floor: true, // things you can stand on
    bulky: false, // only one bulky thing allowed on one floor tile
    pressure: 1,
    dirty: true,
    hp: 56
  }
}

function createCells(size) {
  let cells = [];
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      cells.push({x:i, y:j, entities: []});
    }
  }
  return cells;
}

// returns cells in a chessboard-like order
// for 10:10 grid, it's: 0,2,4,6,8,11,13,15,17,19,20,22,...,96,98
function mixCellsOrder(cells, size) {
  let newCells1 = [];
  let newCells2 = [];
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      if ( (i+j)%2 == 0 ) {
        newCells1.push(cells[i+j*size]);
      } else {
        newCells2.push(cells[i+j*size]);
      }
    }
  }
  return newCells1.concat(newCells2);
}


function placeStartingEntities(entities) {
  for (var i = 0; i < 10000; i++) {
    if (i != 1015)
    entities.push({
      id: `floor-${i}`,
      floor: true,
      x: Math.floor(i/100),
      y: Math.floor(i%100)
    });
  }

  entities.push({
    id: `spaace`,
    space: true,
    x: 10,
    y: 15
  });

  let guy = {
    id: 'main-guy',
    player: true,
    character: true,
    bulky: true,
    x: 15, y: 15
  };
  entities.push(guy);

  let badGuy = {
    id: 'bad-guy',
    character: true,
    randomMove: true,
    enemy: true,
    x: 15, y: 15
  };
  entities.push(badGuy);

  let someDoor = {
    id: 'door-1',
    door: true,
    wall: true,
    //parentId: 'floor-1313',
    x: 13, y: 13
  };
  entities.push(someDoor);

  let walls = [
    {x: 12, y:13}, {x: 14, y:13}, {x: 15, y:13}, {x: 16, y:13},
    {x: 12, y:14}, {x: 12, y:15}, {x: 12, y:16},
    {x: 16, y:14}, {x: 16, y:15}, {x: 16, y:16},
    {x: 12, y:17}, {x: 13, y:17}, {x: 14, y:17}, {x: 15, y:17}, {x: 16, y:17}
  ];
  walls.forEach( (coord, i) => entities.push({
    id: `wall-${i}`,
    x: coord.x, y: coord.y,
    wall: true
  }))
}
