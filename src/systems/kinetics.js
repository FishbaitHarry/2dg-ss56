// This sytem centralizes movement of entities in relation to sector coordinates.
// Maintaining speed, kinetic energy and updating x/y/cells.
// No other system is allowed to update x/y/cells directly.
//
// Basic push example - {id:'guy', x:3, y:4, hp:56, pushTo: {x:4, y:4}}
export function initializeKinetics(sector) {
  let entities = sector.getEntities();

  function processPushes() {
    entities
    .filter( e => e.pushTo )
    .forEach( e => pushOne(e, e.pushTo) );
  }

  // only for pushing one entity for one cell in one direction
  function pushOne(entity, coordinates) {
    let targetCell = sector.getCell(coordinates.x, coordinates.y);
    // will stop if target contains a wall-type entity
    let wall = targetCell.find( e => e.wall );
    // will stop bulky entities entering other bulky entities cell
    let bulk = entity.bulky && targetCell.find( e => e.bulky );
    // if blocked, save collision
    let blocked = wall || bulk;
    if (blocked) entity.collidedWith = blocked;
    if (!blocked) sector.updateCoordinates(entity, coordinates);
  }

  function tick() {
    processPushes();
  }

  return { tick };
}