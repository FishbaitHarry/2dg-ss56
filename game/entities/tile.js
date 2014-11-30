function createTile(options) {
	// init components
	var pressure = 0;
	var itemStack = [];

	// define logic
	function getVisible() {
		return itemStack.reduceRight(pushUntilOpaque, []);
	}
	function pushUntilOpaque(stack, item) {
		if ( !stack.length || !stack[0].isOpaque() ) {
			stack.unshift(item);
		}
		return stack;
	}

	// define api
	return Object.freeze({
		getPressure: function getPressure() { return pressure; },
		setPressure: function setPressure(newPressure) { pressure = newPressure; },
		push: function push(item) { itemStack.push(item); },
		getStack: function getStack() { return itemStack; },
		getVisible: getVisible
	});
}

modules.exports = createTile;
