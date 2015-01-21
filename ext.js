(function(ext) {

  var DEADZONE = 8000 / 32767;

  var buttons = [
    "A",
    "B",
    "X",
    "Y",
    "left button",
    "right button",
    "left trigger",
    "right trigger",
    "select",
    "start",
    "left stick",
    "right stick",
    "up",
    "down",
    "left",
    "right"
  ];

  var buttonMenu = [];
  var buttonNames = {};
  buttons.forEach(function(name, i) {
    buttonMenu.push(name);
    buttonNames[name] = i;
  });
  buttonMenu.splice(8, 0, "left trigger (fully pressed)");
  buttonMenu.splice(9, 0, "right trigger (fully pressed)");
  buttonMenu.push("any", "any (fully pressed)");

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
  };
  
  var hatFix = [false, false]; //Auto-reset hat
  ext.hatButton = function(name) {
    if(!hatFix[0] && ext.getButton(name) === true) {
        hatFix[0] = true;
        return true;
    } else {
        hatFix[0] = false;
        return false;
    }
  };
  
  ext.hatStick = function(stick) {
    if(!hatFix[1] && ext.getStick("direction", stick) != "false") {
        hatFix[1] = true;
        return true;
    } else {
        hatFix[1] = false;
        return false;
    }
  };

  ext.getButton = function(name) {
    if(name == "left trigger (fully pressed)") {
      return ext.gamepad.buttons[6].value == 1;
    }
    if(name == "right trigger (fully pressed)") {
      return ext.gamepad.buttons[7].value == 1;
    }
    if(name.indexOf("any") == -1) {
      var index = buttonNames[name];
      var button = ext.gamepad.buttons[index];
      return button.pressed;
    } else {
      if(name == "any") {
        return ext.gamepad.buttons.map(function(e) { return e.pressed; }).indexOf(true) > -1;
      } else {
        return ext.gamepad.buttons.map(function(e) { return e.value; }).indexOf(1) > -1;
      }
    }
  };
  
  ext.getTrigger = function(which) {
    which = (which == "left trigger") ? 6 : 7;
    return ext.gamepad.buttons[which].value;
  }

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
          // report false to indicate that the stick isn't pointing to any 2D direction
          return "false";
        }
        var value = 180 * Math.atan2(x, y) / Math.PI;
        ext.stickDirection[stick] = value;
        return value;
      case "force":
        return Math.sqrt(x*x + y*y);
    }
  };
  
  ext.whichButton = function() {
    var result = buttons[ext.gamepad.buttons.map(function(e) {return e.pressed;}).indexOf(true)];
    if(typeof result == "undefined") {
      result = -1;
    }
    return result;
  };

  var descriptor = {
    blocks: [
      ["b", "Gamepad Extension installed?", "installed"],
      ["-"],
      ["h", "when button %m.button is pressed", "hatButton", "A"],
      ["h", "when %m.stick stick points at any direction", "hatStick", "left"],
      ["-"],
      ["b", "button %m.button pressed?", "getButton", "A"],
      ["r", "% pressed of %m.trigger", "getTrigger", "left trigger"],
      ["r", "%m.axisValue of %m.stick stick", "getStick", "direction", "left"],
      ["-"],
      ["r", "Which button is pressed?", "whichButton"]
    ],
    menus: {
      button: buttonMenu,
      stick: ["left", "right"],
      trigger: ["left trigger", "right trigger"],
      axisValue: ["direction", "force"],
    },
  };

  ScratchExtensions.register("Gamepad", descriptor, ext);

})({});
