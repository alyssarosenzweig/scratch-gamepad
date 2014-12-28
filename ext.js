(function(ext) {

  ext.gamepadSupport = (!!navigator.getGamepads ||
                        !!navigator.gamepads);
  ext.gamepad = null;

  ext.tick = function() {
    // poll status
    ext.gamepad = (navigator.getGamepads &&
                   navigator.getGamepads()[0]);
    window.requestAnimationFrame(ext.tick);
  };
  if (ext.gamepadSupport) window.requestAnimationFrame(ext.tick);

  ext._shutdown = function() {};

  ext._getStatus = function() {
    if (!ext.gamepadSupport) return {
      status: 1,
      msg: "Please use a recent version of Google Chrome",
    };

    if (!ext.gamepad) return {
      status: 1,
      msg: "Please plug in a gamepad and press any button",
    };

    return {
      status: 2,
      msg: "Good to go!",
    };
  };

  ext.isReady = function() {
    return !!ext.gamepad;
  };

  ext.getID = function() {
    return ext.gamepad.id;
  };

  ext.getButton = function(btn) {
    return ext.gamepad.buttons[btn];
  };

  ext.getAxis = function(axis) {
    return ext.gamepad.axes[axis];
  };

  var descriptor = {
    blocks: [
      ["r", "ready?", "isReady"],
    ["-"],
    ["r", "gamepad ID", "getID"],
    ["r", "get button %n", "getButton", 0],
    ["r", "get axis %n", "getAxis", 0],
    ]
  };

  ScratchExtensions.register("Gamepad", descriptor, ext);

})({});

