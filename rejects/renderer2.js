let entities = [];

for (var i = 0; i < 10000; i++) {
  entities.push({
    type: 'floor',
    class: 'floor entity',
    visible: true,
    x: Math.floor(i/100),
    y: Math.floor(i%100)
  });
}

let guy = {
  type: 'guy',
  class: 'character entity',
  visible: true,
  x: 15, y: 15
};
entities.push(guy);

let badGuy = {
  type: 'guy',
  class: 'enemy entity',
  visible: true,
  x: 15, y: 15
};
entities.push(badGuy);

// LOOP
setInterval(loopIt, 1000);
function loopIt() {
  chaseMove(guy)
  randomMove(badGuy);
  centerCamera(guy);
  updateVis(entities);
  renderAll(entities);
}

function updateVis(entities) {
  entities.forEach(et => et.visible = (et.x - guy.x)*(et.x - guy.x) + (et.y - guy.y)*(et.y - guy.y) < 14)
}

function randomMove(guy) {
  guy.x = guy.x + Math.floor(Math.random()*3) -1;
  guy.y = guy.y + Math.floor(Math.random()*3) -1;
}

function centerCamera(guy) {
  let top = (5 - guy.y) * 50;
  let left = (5 - guy.x) * 50;
  canvas.setAttribute('style', `top: ${top}px; left: ${left}px`);
}

/// RENDERING
let canvas = document.querySelector('#canvas');
function renderAll(entities) {
  entities.forEach( e => renderOne(e) );
}
function renderOne(entity) {
  if (!entity.el) {
    if (!entity.visible) return;
    entity.el = document.createElement("div");
    canvas.append(entity.el);
    entity.el.append(entity.type);
  }
  let hidden = entity.visible ? '' : ' hidden';
  entity.el.className = entity.class + hidden;
  if (!entity.visible) return;
  let top = entity.y * 50;
  let left = entity.x * 50;
  entity.el.setAttribute('style', `top: ${top}px; left: ${left}px`);
}


// INTERACT
let moveTarget;
canvas.addEventListener('click', setMoveTarget);
function setMoveTarget(event) {
  let el = event.target;
  moveTarget = entities.find(et => et.el == el);
}
function chaseMove(guy) {
  if (!moveTarget) return;
  let isUp = 0 < moveTarget.y - guy.y;
  let isDown = 0 > moveTarget.y - guy.y;
  let isLeft = 0 < moveTarget.x - guy.x;
  let isRight = 0 > moveTarget.x - guy.x;
  guy.x = guy.x + (isLeft ? 1 : 0) + (isRight ? -1 : 0);
  guy.y = guy.y + (isUp ? 1 : 0) + (isDown ? -1 : 0);
}