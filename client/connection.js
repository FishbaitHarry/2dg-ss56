// This is a mockup.

function createConnection(options) {
	// init components
	var socket;
	var game;
	var actionQueue;

	// event handlers
	socket.on('game:event', processGameEvent);
	function processGameEvent(event) {
		game.add(event);
	}
	actionQueue.on('add', forwardAction);
	function forwardAction(action) {
		socket.push(action);
	}

	// define api
	return Object.freeze({
		close: function close() { socket.close(); }
	});
}

module.exports = createConnection;
