function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _createClass(e, r, t) {
  return Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e  ) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: !0
          } : {
            done: !1,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = !0,
    u = !1;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = !0, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

var FishingOption;
(function (FishingOption) {
  FishingOption["SMALL_NET"] = "Small Net";
  FishingOption["BIG_NET"] = "Big Net";
  FishingOption["FISHING_ROD"] = "Fishing Rod";
  FishingOption["FLY_FISHING_ROD"] = "Fly Fishing Rod";
  FishingOption["CAGE"] = "Cage";
  FishingOption["HARPOON"] = "Harpoon";
  FishingOption["BAREHAND"] = "Barehand";
  FishingOption["KARAMBWAN_VESSEL"] = "Karambwan Vessel";
})(FishingOption || (FishingOption = {}));
var Config = /*#__PURE__*/_createClass(function Config() {
  _classCallCheck(this, Config);
  _defineProperty(this, "fishingMethod", FishingOption.HARPOON);
  _defineProperty(this, "maxDistance", 20);
  _defineProperty(this, "enableDebug", true);
  _defineProperty(this, "timeout", 3);
  _defineProperty(this, "isRunning", false);
  _defineProperty(this, "currentAction", 'Waiting to start...');
  _defineProperty(this, "startTime", 0);
});
var config = new Config();
var FISHING_ANIMATIONS = _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, FishingOption.SMALL_NET, 621), FishingOption.BIG_NET, 620), FishingOption.FISHING_ROD, 623), FishingOption.FLY_FISHING_ROD, 622), FishingOption.CAGE, 619), FishingOption.HARPOON, 618), FishingOption.BAREHAND, 624), FishingOption.KARAMBWAN_VESSEL, 1193);
var FISHING_CONFIGS = _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, FishingOption.CAGE, {
  spotIds: [1510, 1519, 1522, 2146, 3657, 3914, 5821, 7199, 7460, 7465, 7470, 7946, 9173, 9174],
  action: 'Cage'
}), FishingOption.SMALL_NET, {
  spotIds: [1514, 1517, 1518, 1521, 1523, 1524, 1525, 1528, 1530, 1544, 3913, 4710, 7155, 7459, 7462, 7467, 7469, 7947],
  action: 'Net'
}), FishingOption.BIG_NET, {
  spotIds: [1520, 1521],
  action: 'Big Net'
}), FishingOption.FISHING_ROD, {
  spotIds: [1517, 1518],
  action: 'Bait'
}), FishingOption.FLY_FISHING_ROD, {
  spotIds: [1517, 1518],
  action: 'Lure'
}), FishingOption.HARPOON, {
  spotIds: [1510, 1519, 1522, 2146, 3657, 3914, 5821, 7199, 7460, 7465, 7470, 7946, 9173, 9174],
  action: 'Harpoon'
}), FishingOption.BAREHAND, {
  spotIds: [1542, 1544],
  action: 'Catch'
}), FishingOption.KARAMBWAN_VESSEL, {
  spotIds: [4712, 4713],
  action: 'Fish'
});
function isPlayerFishing() {
  var player = client.getLocalPlayer();
  if (!player) return false;
  var animation = player.getAnimation();
  return animation === FISHING_ANIMATIONS[config.fishingMethod];
}
function isPlayerIdle() {
  return !isPlayerFishing() && bot.localPlayerIdle();
}
function clickNpc(npcIds, action) {
  var npcs = bot.npcs.getWithIds(npcIds);
  if (!npcs || npcs.length < 1) {
    config.currentAction = 'No fishing spots found';
    if (config.enableDebug) {
      api.printGameMessage('No fishing spots found nearby');
    }
    return false;
  }
  var closestNpc = npcs[0];
  var closestDistance = Number.MAX_VALUE;
  var player = client.getLocalPlayer();
  if (player) {
    var playerLocation = player.getWorldLocation();
    var _iterator = _createForOfIteratorHelper(npcs),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var npc = _step.value;
        var npcLocation = npc.getWorldLocation();
        if (playerLocation && npcLocation) {
          var distance = Math.abs(playerLocation.getX() - npcLocation.getX()) + Math.abs(playerLocation.getY() - npcLocation.getY());
          if (distance < closestDistance) {
            closestDistance = distance;
            closestNpc = npc;
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  try {
    bot.npcs.interactSupplied(closestNpc, action);
    config.currentAction = "Fishing using ".concat(action);
    return true;
  } catch (err) {
    var error = err;
    config.currentAction = "Error: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'Unknown error');
    return false;
  }
}
function fish() {
  if (!config.isRunning) return;
  var fishingConfig = FISHING_CONFIGS[config.fishingMethod];
  if (!fishingConfig) {
    config.currentAction = 'Invalid fishing method';
    return;
  }
  if (isPlayerFishing()) {
    config.currentAction = 'Currently fishing...';
    return;
  }
  clickNpc(fishingConfig.spotIds, fishingConfig.action);
}
function updateStatus() {
  if (!config.isRunning) return;
  var runtime = Math.floor((Date.now() - config.startTime) / 1000);
  var hours = Math.floor(runtime / 3600);
  var minutes = Math.floor(runtime % 3600 / 60);
  var seconds = runtime % 60;
  var status = ["-----------------", "AIO Fisher Status", "Method: ".concat(config.fishingMethod), "Action: ".concat(config.currentAction), "Runtime: ".concat(hours, ":").concat(minutes.toString().padStart(2, '0'), ":").concat(seconds.toString().padStart(2, '0')), "-----------------"].join('\n');
  api.printGameMessage(status);
}
function onStart() {
  api.printGameMessage('AIO Fishing script started');
  config.isRunning = true;
  config.startTime = Date.now();
}
function onGameTick() {
  if (!config.isRunning) return;
  if (isPlayerIdle()) {
    fish();
  }
  if (client.getTickCount() % 4 === 0) {
    updateStatus();
  }
}

