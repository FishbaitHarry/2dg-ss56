/*
Example door
{
  id: 'door-1', x: 3, y: 5,
  door: true, // enables this system
  closed: true, // internal and visual
  reqAuth: false, // can anyone open them?
  wall: true, // closed door block like walls
}
*/
export function initializeDoors(sector) {
  let entities = sector.getEntities();

  return {
    tick: () => tick(entities)
  }
}

function tick(entities) {
  entities.filter(e => e.door)
  .forEach( door => {
    door.doorTimer = door.doorTimer ? door.doorTimer-1 : 0;
    let openBtnPressed = (door.collidedWith || door.pressedWith) && !door.reqAuth;
    door.doorTimer = openBtnPressed ? 20 : door.doorTimer;
    door.closed = (door.doorTimer == 0);
    door.wall = door.closed;
  });
}