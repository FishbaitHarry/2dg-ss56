// This renderer uses VDOM.
// It sucks because it swaps elements around and too many creates/removes.
// Aso fails at animations.

(() => {
  function MapEntity(props) {
    let css = {
      'display': props.visible ? 'block' : 'none',
      'left': props.x * 32 + 'px',
      'bottom': props.y * 32 + 'px'
    };
    let attrs = {
      className: `map-entity ${props.type}`,
      style: css,
      key: props.key,
      onclick: () => console.log(attrs)
    };
    return H('div', attrs);
  }
  function CartesianMap(props, state) {
    let player = props.entities.find(e => e.type == 'player');
    let style = {
      'left':    0 + 300 - player.x*32 + 'px',
      'top': -3200 + 300 + player.y*32 + 'px'
    };
    let attrs = {
      className: 'cartesian-map',
      style: style,
      onclick: () => moveIt(props)
    };
    // let visibles = props.entities.filter( e => {
    //   return Math.abs(e.x-player.x)+Math.abs(e.y-player.y) < 10;
    // })
    let children = props.entities.map(e => H(MapEntity, e));
    return H('div', attrs, children)
  }

  let entities = [{
    type: 'player',
    x: 55, y: 55
  }, {
    type: 'thing',
    x: 54, y: 54
  }, {
    type: 'thing',
    x: 57, y: 59
  }];
  for (let i=0;i<10000;i++) {
    entities.push({
      x: Math.floor(i/100),
      y: i%100,
      type: 'floor'
    });
  }
  entities.forEach( (e,i) => e.key=i );

  // let stacks = entities
  // .filter( e => e.type == 'floor' )
  // .map( (e, i) => {
  //   return {
  //     x: Math.floor(i/10),
  //     y: i%10,
  //     entities: [e]
  //   }
  // });
  // stacks[55].entities.push(entities[0]);
  // stacks[44].entities.push(entities[1]);
  // stacks[79].entities.push(entities[2]);

  let state = {
    entities: entities
  };

  R(
    H(CartesianMap, state),
    document.body
  )

  function moveIt(state) {
    let newEnts = state.entities.map( e => {
      if (e.type != 'floor') {
        return {
          x: Math.floor(e.x-1 + Math.random()*3),
          y: Math.floor(e.y-1 + Math.random()*3),
          type: e.type,
          key: e.key
        }
      } else {
        return e;
      }
    });
    let player = newEnts.find(e => e.type == 'player');
    newEnts.forEach(e => e.visible = Math.abs(e.x-player.x)+Math.abs(e.y-player.y) < 10);
    let newState = {entities: newEnts};
    R(H(CartesianMap, newState), document.body);
  }
})()