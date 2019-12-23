// Sector is an area of space.

export function initializeSector() {
  let entities = [];

  placeStartingEntities(entities);

  return {
    getEntities() { return entities; },
    getRootEntities() { return entities.map(e=>!e.parentId); }
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

function placeStartingEntities(entities) {
  for (var i = 0; i < 10000; i++) {
    entities.push({
      id: `floor-${i}`,
      floor: true,
      x: Math.floor(i/100),
      y: Math.floor(i%100)
    });
  }

  let guy = {
    id: 'main-guy',
    player: true,
    character: true,
    x: 15, y: 15
  };
  entities.push(guy);

  let badGuy = {
    id: 'bad-guy',
    character: true,
    randomMove: true,
    red: true,
    x: 15, y: 15
  };
  entities.push(badGuy);

  let someDoor = {
    id: 'door-1',
    door: true,
    bulky: true,
    parentId: 'floor-1313'
  };
  entities.push(someDoor);
}
