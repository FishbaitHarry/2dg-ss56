// System used to determine what's visible from a point in space.
// Currently uses the taxi metric to determine distance.
// Currently ignores walls.

function createOptics(options) {
	// init components
	var tiles = options.tiles || throw 'error';
	var locations = options.locations || throw 'error';
	var maxDrawDistance = 12;

	// logic
	function update() {
		// todo: draw the game to the user? refresh cache?
	}
	function getAllVisibleItems(location) {
		var result = locations
			.filter(proximityFilter)
			.reduce(getVisibleItems, []);
		function proximityFilter(otherLocation) {
			var xDist = Math.abs(location.getX() - otherLocation.getX());
			var yDist = Math.abs(location.getY() - otherLocation.getY());
			return (xDist + yDist) <= maxDrawDistance;
		}
		function getVisibleItems(items, currentLocation) {
			var newItems = currentLocation.getTile().getVisible();
			return items.concat(newItems);
		}
		return result;
	}

	// define api
	return Object.freeze({
		update: update,
		getAllVisibleItems: getAllVisibleItems
	});
}

module.exports = createOptics;
