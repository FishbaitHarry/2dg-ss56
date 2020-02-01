/*
Character is anything that can move on its own and use items on items.
Basically players go here, but possibly also enemies.

{
  id: 'main-guy',
  x: 15, y: 15,
  bulky: true,
  player: true, // controlled by real human
  character: true,
  actionTarget: [object Object], // reference entity you want to use / click
  moveTarget: [object Object], // reference entity you want to approach
};
*/
export function initializeCharacters(sector) {
  let entities = sector.getEntities();
  return {
    tick: () => tick(sector)
  };
}

function tick(sector) {
  // stupid bots generate random push commands
  sector.getEntities()
    .filter(e=>e.randomMove)
    .forEach(e=>randomizeTarget(e));

  // players and other walking things have actionTarget
  sector.getEntities()
    .filter(e=>e.actionTarget)
    .forEach(e=>chaseMove(sector, e, e.actionTarget));

  sector.getEntities()
    .filter(e=>e.actionTarget)
    .forEach(e=>interact(sector, e, e.actionTarget));
}


function randomizeTarget(guy) {
  guy.pushTo = {
    x: guy.x + Math.floor(Math.random()*3) -1,
    y: guy.y + Math.floor(Math.random()*3) -1
  }
}

function chaseMove(sector, guy, moveTarget) {
  // only chase rootEntities that have x/y
  if (!moveTarget.x) return;

  let isUp    = 0 < moveTarget.y - guy.y;
  let isDown  = 0 > moveTarget.y - guy.y;
  let isLeft  = 0 < moveTarget.x - guy.x;
  let isRight = 0 > moveTarget.x - guy.x;

  // marvelous pathfinding lol
  isUp    = isUp    && !isSpaceTaken(sector, guy.x, guy.y+1);
  isDown  = isDown  && !isSpaceTaken(sector, guy.x, guy.y-1);
  isLeft  = isLeft  && !isSpaceTaken(sector, guy.x+1, guy.y);
  isRight = isRight && !isSpaceTaken(sector, guy.x-1, guy.y);

  guy.pushTo = {
    x: guy.x + (isLeft ? 1 : 0) + (isRight ? -1 : 0),
    y: guy.y + (isUp ? 1 : 0) + (isDown ? -1 : 0)
  };
}

function interact(sector, guy, actionTarget) {
  if (Math.abs(guy.x - actionTarget.x) > 1) return;
  if (Math.abs(guy.y - actionTarget.y) > 1) return;
  actionTarget.pressedWith = guy;
}

// returns first thing in the way
function isSpaceTaken(sector, x, y) {
  let cell = sector.getCell(x, y);
  if (!cell) return false;
  return cell.entities.find(e => e.wall);
}