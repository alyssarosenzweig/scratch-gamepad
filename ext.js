(function(ext) {

  var DEADZONE = 8000 / 32767;

  var buttons = [
    ["left top", 4],
    ["left bottom", 6],
    ["right top", 5],
    ["right bottom", 7],
    ["left stick", 10],
    ["right stick", 11],
    ["A", 0],
    ["B", 1],
    ["X", 2],
    ["Y", 3],
    ["select", 8],
    ["start", 9],
    ["up", 12],
    ["down", 13],
    ["left", 14],
    ["right", 15],
  ];

  var buttonMenu = [];
  var buttonNames = {};
  buttons.forEach(function(d) {
    var name = d[0],
        index = d[1];
    buttonMenu.push(name);
    buttonNames[name] = index;
  });

  ext.gamepadSupport = (!!navigator.getGamepads ||
                        !!navigator.gamepads);
  ext.gamepad = null;

  ext.stickDirection = {left: 90, right: 90};

  ext.tick = function() {
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

  ext.installed = function() {
    return true;
  }

  ext.getButton = function(name) {
    var index = buttonNames[name];
    var button = ext.gamepad.buttons[index];
    return button.pressed;
  };

  ext.getStick = function(what, stick) {
    var x, y;
    switch (stick) {
      case "left":  x = ext.gamepad.axes[0]; y = -ext.gamepad.axes[1]; break;
      case "right": x = ext.gamepad.axes[2]; y = -ext.gamepad.axes[3]; break;
    }
    if (-DEADZONE < x && x < DEADZONE) x = 0;
    if (-DEADZONE < y && y < DEADZONE) y = 0;

    switch (what) {
      case "direction":
        if (x === 0 && y === 0) {
          // report the stick's previous direction
          return ext.stickDirection[stick];
        }
        var value = 180 * Math.atan2(x, y) / Math.PI;
        ext.stickDirection[stick] = value;
        return value;
      case "force":
        return Math.sqrt(x*x + y*y) * 100;
    }
  };

  var descriptor = {
    blocks: [
      ["b", "Gamepad Extension installed?", "installed"],
      ["b", "button %m.button pressed?", "getButton", "X"],
      ["r", "%m.axisValue of %m.stick stick", "getStick", "direction", "left"],
    ],
    menus: {
      button: buttonMenu,
      stick: ["left", "right"],
      axisValue: ["direction", "force"],
    },
  };

  ScratchExtensions.register("Gamepad", descriptor, ext);

})({});

