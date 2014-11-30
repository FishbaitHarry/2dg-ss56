var aerodynamics = require('./systems/aerodynamics');
var optics = require('./systems/optics');


function createGame(options) {
	// init items
	// init systems
	var systems = [
		aerodynamics(),
		optics()
	];

	// define logic
	function elapseTime(time) {
		systems.forEach(function(system){
			system.update();
		});
		if (time > 1) elapseTime(time - 1);
	}

	return Object.freeze({
		draw: function(element) {},
		elapseTime: elapseTime
	});
}

module.exports = createGame;
