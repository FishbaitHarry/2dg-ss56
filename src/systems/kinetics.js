/*
// This sytem centralizes movement of entities in relation to sector coordinates.
// Maintaining speed, kinetic energy and updating x/y/cells.
// No other system is allowed to update x/y/cells directly.

{
  id:'guy', x:3, y:4, hp:56,
  pushTo: {x:4, y:4} // coords where the entity should be physically moved, max 1 space
  collidedWith: [object Object], // cyclical reference to another entity if they bumped last frame
}
*/
export function initializeKinetics(sector) {
  let entities = sector.getEntities();

  function processPushes() {
    entities
    .forEach( e => e.collidedWith = false);

    entities
    .filter( e => e.pushTo )
    .forEach( e => pushOne(e, e.pushTo) );
  }

  // only for pushing one entity for one cell in one direction
  function pushOne(entity, coordinates) {
    let targetCell = sector.getCell(coordinates.x, coordinates.y);
    if (!targetCell) return;
    // will stop if target contains a wall-type entity
    let wall = targetCell.entities.find( e => e.wall );
    // will stop bulky entities entering other bulky entities cell
    let bulk = entity.bulky && targetCell.entities.find( e => e.bulky );
    // if blocked, save collision
    let blocked = wall || bulk;
    if (blocked) {
      entity.collidedWith = blocked;
      blocked.collidedWith = entity;
    } else {
      sector.updateCoordinates(entity, coordinates);
    }
  }

  function tick() {
    processPushes();
  }

  return { tick };
}