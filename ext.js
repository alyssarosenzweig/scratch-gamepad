(function(ext) {

  var DEADZONE = 8000 / 32767;

  var axes = [
    ["left x", 0],
    ["left y", 1],
    ["right x", 2],
    ["right y", 3],
  ];
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

  var menus = {
    axis: [],
    button: [],
  };
  var axisNames = {};
  var buttonNames = {};
  axes.forEach(function(d) {
    var name = d[0],
        index = d[1];
    menus.axis.push(name);
    axisNames[name] = index;
  });
  buttons.forEach(function(d) {
    var name = d[0],
        index = d[1];
    menus.button.push(name);
    buttonNames[name] = index;
  });

  ext.gamepadSupport = (!!navigator.getGamepads ||
                        !!navigator.gamepads);
  ext.gamepad = null;

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

  ext.getButton = function(name) {
    var index = buttonNames[name];
    var button = ext.gamepad.buttons[index];
    return button.pressed;
  };

  ext.getAxis = function(name) {
    var index = axisNames[name];
    var value = ext.gamepad.axes[index];
    if (-DEADZONE < value && value < DEADZONE) value = 0;
    if (index === 1 || index === 3) value = -value;
    return value * 100;
  };

  var descriptor = {
    blocks: [
      ["b", "button %m.button pressed?", "getButton", "X"],
      ["r", "axis %m.axis", "getAxis", "left x"],
    ],
    menus: menus,
  };

  ScratchExtensions.register("Gamepad", descriptor, ext);

})({});

