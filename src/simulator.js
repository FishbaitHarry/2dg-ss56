
export function initializeSimulator(sector) {
  let entities = sector.getEntities();
  return {
    tick() { tick(entities) },
    undoTick() {}
  };
}

function tick(entities) {
  // stupid bots generate moveTargets
  entities
    .filter(e=>e.randomMove)
    .forEach(e=>randomizeTarget(e));
  // players and other walking things have moveTarget
  entities
    .filter(e=>e.moveTarget)
    .forEach(e=>chaseMove(entities, e, e.moveTarget));
}


function randomizeTarget(guy) {
  guy.moveTarget = {
    x: guy.x + Math.floor(Math.random()*3) -1,
    y: guy.y + Math.floor(Math.random()*3) -1
  }
}

function chaseMove(entities, guy, moveTarget) {
  // only chase rootEntities that have x/y
  if (!moveTarget.x) return;

  let isUp    = 0 < moveTarget.y - guy.y;
  let isDown  = 0 > moveTarget.y - guy.y;
  let isLeft  = 0 < moveTarget.x - guy.x;
  let isRight = 0 > moveTarget.x - guy.x;

  // check for collision
  isUp    = isUp    && !isSpaceTaken(entities, guy.x, guy.y+1);
  isDown  = isDown  && !isSpaceTaken(entities, guy.x, guy.y-1);
  isLeft  = isLeft  && !isSpaceTaken(entities, guy.x+1, guy.y);
  isRight = isRight && !isSpaceTaken(entities, guy.x-1, guy.y);

  guy.x = guy.x + (isLeft ? 1 : 0) + (isRight ? -1 : 0);
  guy.y = guy.y + (isUp ? 1 : 0) + (isDown ? -1 : 0);
}

// returns first thing in the way
function isSpaceTaken(entities, x, y) {
  return entities.find( entity => {
    if (!entity.bulky) return false;
    if (entity.x != x) return false;
    if (entity.y != y) return false;
    return true;
  });
}