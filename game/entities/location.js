// Abstracts the geometry of the world.
// By default, the world is a 2D grid of locations.

function createLocation(options) {
	// init components
	var xPos = 0;
	var yPos = 0;

	// define api
	return Object.freeze({
		getX: function getX() { return xPos; },
		getY: function getY() { return yPos; }
	});
}

module.exports = createLocation;
