(function(ext) {
	ext.gamepadSupport = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;
	ext.gamepad = null;

	ext.tick = function() {
		// poll status
		ext.gamepad = navigator.webkitGetGamepads && navigator.webkitGetGamepads()[0];
		window.webkitRequestAnimationFrame(ext.tick);
	}

	if(ext.gamepadSupport) {
		window.webkitRequestAnimationFrame(ext.tick);
	}

	ext._shutdown = function() {};
	
	ext._getStatus = function() {
		if(!ext.gamepadSupport) return { status: 1, msg: "Please use a recent version of Google Chrome"};
		if(!ext.gamepad) return { status: 1, msg: "Please plug in a gamepad and press any button"};

		return {
			status: 2,
			msg: "Good to go!"
		};
	}

	ext.isReady = function() {
		return !!ext.gamepad;
	}

	ext.getID = function() {
		return ext.gamepad.id;
	}

	ext.getButton = function(btn) {
		return ext.gamepad.buttons[btn];
	}

	ext.getAxis = function(axis) {
		return ext.gamepad.axes[axis];
	}

	var descriptor = {
		blocks: [
			["r", "ready?", "isReady"],
			["-"],
			["r", "gamepad ID", "getID"],
			["r", "get button %n", "getButton", 0],
			["r", "get axis %n", "getAxis", 0],
		]
	}

	ScratchExtensions.register("Gamepad", descriptor, ext);
})({});