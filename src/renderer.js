export function initizalizeRenderer(sector) {
  let entities = sector.getEntities();
  let canvas = document.querySelector('#canvas');
  let cameraMan = entities.find(e=>e.player);

  canvas.addEventListener('click', setMoveTarget);
  function setMoveTarget(event) {
    let el = event.target;
    cameraMan.moveTarget = entities.find(et => et.el == el);
  }

  return {
    render() {
      updateVisibility(entities, cameraMan)
      renderAll(canvas, entities);
      centerCamera(canvas, cameraMan);
    }
  };
}

function renderAll(canvas, entities) {
  entities.forEach( e => renderOne(canvas, e) );
}

function renderOne(canvas, entity) {
  if (!entity.el) {
    if (!entity.visible) return;
    entity.el = document.createElement("div");
    canvas.append(entity.el);
    entity.el.append(entity.id);
  }

  let classList = ['entity'];
  if (!entity.visible) classList.push('hidden');
  if (entity.character) classList.push('character');
  if (entity.red) classList.push('enemy');
  if (entity.floor) classList.push('floor');
  entity.el.className = classList.join(' ');

  if (!entity.visible) return;
  let top = entity.y * 50;
  let left = entity.x * 50;
  entity.el.setAttribute('style', `top: ${top}px; left: ${left}px`);
}

function centerCamera(canvas, guy) {
  let top = (5 - guy.y) * 50;
  let left = (5 - guy.x) * 50;
  canvas.setAttribute('style', `top: ${top}px; left: ${left}px`);
}

function updateVisibility(entities, guy) {
  entities.forEach(et => et.visible = (et.x - guy.x)*(et.x - guy.x) + (et.y - guy.y)*(et.y - guy.y) < 14)
}