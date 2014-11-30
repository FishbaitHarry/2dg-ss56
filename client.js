var game = require('./game/game.js');
var client = require('./client/client.js');

// application initialization code
window.document.onload = function init() {
	client({
		game: game(),
		serverUrl: window.location.href
	});
}