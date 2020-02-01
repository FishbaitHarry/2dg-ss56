export function initializeRenderer(sector) {
  let entities = sector.getEntities();
  let canvas = document.querySelector('#canvas');
  let cameraMan = entities.find(e=>e.player);

  canvas.addEventListener('click', setTarget);
  function setTarget(event) {
    let el = event.target;
    cameraMan.actionTarget = entities.find(et => et.el == el);
  }

  return {
    render() {
      updateVisibility(entities, cameraMan);
      renderAll(canvas, entities);
      centerCamera(canvas, cameraMan);
    }
  };
}

function renderAll(canvas, entities) {
  entities.forEach( entity => {
    if (!entity.el) createOne(canvas, entity);
    updateOne(entity);
  });
}

function linkParents(entities, entity) {
  if (!entity.parentId) return;
  if (entity.parent) return;
  entity.parent = entities.find(e=>e.id==entity.parentId);
}

function createOne(canvas, entity) {
  if (!entity.visible) return;
  entity.el = document.createElement("div");
  entity.el.append(entity.id);

  if (entity.x != null) {
    canvas.append(entity.el);
  } else if (entity.parent) {
    entity.parent.el.append(entity.el);
  }
}

function updateOne(entity) {
  if (!entity.el) return;

  let classes = ['visible', 'character', 'enemy', 'floor', 'wall', 'door', 'closed'];
  entity.el.className = 'entity ' + classes.filter(c => entity[c]).join(' ');

  if (!entity.visible) return;
  if (entity.x != null) {
    let top = entity.y * 50;
    let left = entity.x * 50;
    entity.el.setAttribute('style', `top: ${top}px; left: ${left}px`);
  }
}

function centerCamera(canvas, guy) {
  let top = (5 - guy.y) * 50;
  let left = (5 - guy.x) * 50;
  canvas.setAttribute('style', `top: ${top}px; left: ${left}px`);
}

function updateVisibility(entities, guy) {
  entities.forEach(et => {
    if (et.parentId) linkParents(entities, et);
    if(et.parent) {
      et.visible = et.parent.visible;
    } else {
      et.visible = (et.x - guy.x)*(et.x - guy.x) + (et.y - guy.y)*(et.y - guy.y) < 14;
    }
  });
}