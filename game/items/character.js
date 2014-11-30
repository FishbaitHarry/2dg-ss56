
function createCharacter(options){

	// init components
	var location = options.location || throw 'error';
	var props = options.props || {};
	var drawable = drawable({location: location, type: 'guy'});
	var currentAction = options.currentAction || undefined;

	// define api
	return Object.freeze({
		getLocation: function getLocation(){ return location; },
		getDrawable: function getDrawable(){ return drawable; },
		getCurrentAction: function getCurrentAction(){ return currentAction; }
	});
}

module.exports = createCharacter;
