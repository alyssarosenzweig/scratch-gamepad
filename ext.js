(function(ext) {
	ext.gamepadSupport = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;
	ext.gamepad = null;

	ext.tick = function() {
		// poll status
		if(!ext.gamepad) {
			ext.gamepad = navigator.webkitGetGamepads && navigator.webkitGetGamepads()[0];
			
			if(ext.gamepad) {
				console.log("Got it!");
			}
		}

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

	var descriptor = {
		blocks: [
		]
	}

	ScratchExtensions.register("Gamepad", descriptor, ext);
})({});