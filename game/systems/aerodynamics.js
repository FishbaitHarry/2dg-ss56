function createAerodynamics(options) {
	// init components
	var tiles = options.tiles || throw 'error';

	// logic
	function update() {
		tiles.map(getAeroCommit).forEach(executeCommit);
	}
	function getAeroCommit(tile) {
		var newPressure = tile.getPressure() + 1;
		return function() { tile.setPressure(newPressure); };
	}
	function executeCommit(commit) {
		commit();
	}

	// define api
	return Object.freeze({
		update: update
	});
}

module.exports = createAerodynamics;
