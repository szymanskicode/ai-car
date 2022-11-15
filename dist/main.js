/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/classes/Car.ts":
/*!****************************!*\
  !*** ./src/classes/Car.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Car": () => (/* binding */ Car)
/* harmony export */ });
/* harmony import */ var _Controls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Controls */ "./src/classes/Controls.ts");
/* harmony import */ var _Sensor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Sensor */ "./src/classes/Sensor.ts");
/* harmony import */ var _Network__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Network */ "./src/classes/Network.ts");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../models */ "./src/models.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");





var Car = /** @class */ (function () {
    function Car(x, y, width, height, controlType, maxSpeed) {
        if (maxSpeed === void 0) { maxSpeed = 3; }
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged = false;
        this.useBrain = controlType === _models__WEBPACK_IMPORTED_MODULE_3__.CONTROL.AI;
        if (controlType != _models__WEBPACK_IMPORTED_MODULE_3__.CONTROL.DUMMY) {
            this.sensor = new _Sensor__WEBPACK_IMPORTED_MODULE_1__.Sensor(this);
            this.brain = new _Network__WEBPACK_IMPORTED_MODULE_2__.NeuralNetwork([this.sensor.rayCount, 6, 4]);
        }
        this.controls = new _Controls__WEBPACK_IMPORTED_MODULE_0__.Controls(controlType);
    }
    Car.prototype.createPlygon = function () {
        var points = [];
        var rad = Math.hypot(this.width, this.height) / 2;
        var alpha = Math.atan2(this.width, this.height);
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
        });
        return points;
    };
    Car.prototype.move = function () {
        // acceleration and breaking
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }
        // capping the speed
        if (this.speed >= this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        if (this.speed <= -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2;
        }
        // applying the friction
        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }
        // steering
        if (this.speed != 0) {
            var flip = this.speed > 0 ? 1 : -1;
            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }
            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }
        }
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    };
    Car.prototype.assessDamage = function (roadBorders, traffic) {
        for (var i = 0; i < roadBorders.length; i++) {
            if ((0,_utils__WEBPACK_IMPORTED_MODULE_4__.polysIntersect)(this.polygon, roadBorders[i])) {
                return true;
            }
        }
        for (var i = 0; i < traffic.length; i++) {
            if ((0,_utils__WEBPACK_IMPORTED_MODULE_4__.polysIntersect)(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }
        return false;
    };
    Car.prototype.update = function (roadBorders, traffic) {
        if (!this.damaged) {
            this.move();
            this.polygon = this.createPlygon();
            this.damaged = this.assessDamage(roadBorders, traffic);
        }
        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
            var offsets = this.sensor.readings.map(function (s) { return (s === null ? 0 : 1 - s.offset); });
            var outputs = _Network__WEBPACK_IMPORTED_MODULE_2__.NeuralNetwork.feedForward(offsets, this.brain);
            if (this.useBrain) {
                this.controls.forward = Boolean(outputs[0]);
                this.controls.left = Boolean(outputs[1]);
                this.controls.right = Boolean(outputs[2]);
                this.controls.reverse = Boolean(outputs[3]);
            }
        }
    };
    Car.prototype.draw = function (ctx, color, drawSensor) {
        if (drawSensor === void 0) { drawSensor = false; }
        if (this.damaged) {
            ctx.fillStyle = 'silver';
        }
        else {
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (var i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        if (this.sensor && drawSensor) {
            this.sensor.draw(ctx);
        }
    };
    return Car;
}());



/***/ }),

/***/ "./src/classes/Controls.ts":
/*!*********************************!*\
  !*** ./src/classes/Controls.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Controls": () => (/* binding */ Controls)
/* harmony export */ });
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models */ "./src/models.ts");

var Controls = /** @class */ (function () {
    function Controls(type) {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;
        switch (type) {
            case _models__WEBPACK_IMPORTED_MODULE_0__.CONTROL.KEYS:
                this.addKeyboardListeners();
                break;
            case _models__WEBPACK_IMPORTED_MODULE_0__.CONTROL.DUMMY:
                this.forward = true;
                break;
        }
    }
    Controls.prototype.addKeyboardListeners = function () {
        var _this = this;
        document.onkeydown = function (event) {
            switch (event.key) {
                case 'ArrowLeft':
                    _this.left = true;
                    break;
                case 'ArrowRight':
                    _this.right = true;
                    break;
                case 'ArrowUp':
                    _this.forward = true;
                    break;
                case 'ArrowDown':
                    _this.reverse = true;
                    break;
            }
        };
        document.onkeyup = function (event) {
            switch (event.key) {
                case 'ArrowLeft':
                    _this.left = false;
                    break;
                case 'ArrowRight':
                    _this.right = false;
                    break;
                case 'ArrowUp':
                    _this.forward = false;
                    break;
                case 'ArrowDown':
                    _this.reverse = false;
                    break;
            }
        };
    };
    return Controls;
}());



/***/ }),

/***/ "./src/classes/Network.ts":
/*!********************************!*\
  !*** ./src/classes/Network.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Level": () => (/* binding */ Level),
/* harmony export */   "NeuralNetwork": () => (/* binding */ NeuralNetwork)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");

var NeuralNetwork = /** @class */ (function () {
    function NeuralNetwork(neuronCounts) {
        this.levels = [];
        for (var i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
        }
    }
    NeuralNetwork.feedForward = function (givenInputs, network) {
        var outputs = Level.feedForward(givenInputs, network.levels[0]);
        for (var i = 1; i < network.levels.length; i++) {
            outputs = Level.feedForward(outputs, network.levels[i]);
        }
        return outputs;
    };
    NeuralNetwork.mutate = function (network, amount) {
        network.levels.forEach(function (level) {
            for (var i = 0; i < level.biases.length; i++) {
                level.biases[i] = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.lerp)(level.biases[i], Math.random() * 2 - 1, amount);
            }
            for (var i = 0; i < level.weights.length; i++) {
                for (var j = 0; j < level.weights[i].length; j++) {
                    level.weights[i][j] = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.lerp)(level.weights[i][j], Math.random() * 2 - 1, amount);
                }
            }
        });
    };
    return NeuralNetwork;
}());

var Level = /** @class */ (function () {
    function Level(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);
        this.weights = [];
        for (var i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }
        Level.randomize(this);
    }
    Level.randomize = function (level) {
        for (var i = 0; i < level.inputs.length; i++) {
            for (var j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }
        for (var i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    };
    Level.feedForward = function (givenInputs, level) {
        for (var i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }
        for (var i = 0; i < level.outputs.length; i++) {
            var sum = 0;
            for (var j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i];
            }
            if (sum > level.biases[i]) {
                level.outputs[i] = 1;
            }
            else {
                level.outputs[i] = 0;
            }
        }
        return level.outputs;
    };
    return Level;
}());



/***/ }),

/***/ "./src/classes/Road.ts":
/*!*****************************!*\
  !*** ./src/classes/Road.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Road": () => (/* binding */ Road)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");

var Road = /** @class */ (function () {
    function Road(x, width, laneCount) {
        if (laneCount === void 0) { laneCount = 3; }
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;
        this.left = x - width / 2;
        this.right = x + width / 2;
        var infinity = 10000000;
        this.top = -infinity;
        this.bottom = infinity;
        var topLeft = { x: this.left, y: this.top };
        var topRight = { x: this.right, y: this.top };
        var bottomLeft = { x: this.left, y: this.bottom };
        var bottomRight = { x: this.right, y: this.bottom };
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight],
        ];
    }
    Road.prototype.getLaneCenter = function (laneIndex) {
        var laneWidth = this.width / this.laneCount;
        return this.left + laneWidth / 2 + Math.min(laneIndex, this.laneCount - 1) * laneWidth;
    };
    Road.prototype.draw = function (ctx) {
        ctx.strokeStyle = 'orange';
        ctx.lineWidth = 5;
        for (var i = 1; i < this.laneCount; i++) {
            var x = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.lerp)(this.left, this.right, i / this.laneCount);
            ctx.setLineDash([20, 20]);
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }
        ctx.setLineDash([]);
        this.borders.forEach(function (border) {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        });
    };
    return Road;
}());



/***/ }),

/***/ "./src/classes/Sensor.ts":
/*!*******************************!*\
  !*** ./src/classes/Sensor.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Sensor": () => (/* binding */ Sensor)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");

var Sensor = /** @class */ (function () {
    function Sensor(car) {
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        this.raySpread = Math.PI / 2;
        this.rays = [];
        this.readings = [];
    }
    Sensor.prototype.update = function (roadBorders, traffic) {
        this.castRays();
        this.readings = [];
        for (var i = 0; i < this.rays.length; i++) {
            this.readings.push(this.getReading(this.rays[i], roadBorders, traffic));
        }
    };
    Sensor.prototype.draw = function (ctx) {
        for (var i = 0; i < this.rayCount; i++) {
            var end = this.rays[i][1];
            if (this.readings[i]) {
                end = this.readings[i];
            }
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'yellow';
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
    };
    Sensor.prototype.getReading = function (ray, roadBorders, traffic) {
        var touches = [];
        for (var i = 0; i < roadBorders.length; i++) {
            var touch = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getIntersection)(ray[0], ray[1], roadBorders[i][0], roadBorders[i][1]);
            if (touch) {
                touches.push(touch);
            }
        }
        for (var i = 0; i < traffic.length; i++) {
            var poly = traffic[i].polygon;
            for (var j = 0; j < poly.length; j++) {
                var touch = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getIntersection)(ray[0], ray[1], poly[j], poly[(j + 1) % poly.length]);
                if (touch) {
                    touches.push(touch);
                }
            }
        }
        if (touches.length === 0) {
            return null;
        }
        else {
            var offsets = touches.map(function (el) { return el.offset; });
            var minOffset_1 = Math.min.apply(Math, offsets);
            return touches.find(function (el) { return el.offset === minOffset_1; });
        }
    };
    Sensor.prototype.castRays = function () {
        this.rays = [];
        for (var i = 0; i < this.rayCount; i++) {
            var rayAngle = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.lerp)(this.raySpread / 2, -this.raySpread / 2, this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)) + this.car.angle;
            var start = { x: this.car.x, y: this.car.y };
            var end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength,
            };
            this.rays.push([start, end]);
        }
    };
    return Sensor;
}());



/***/ }),

/***/ "./src/classes/Visualizer.ts":
/*!***********************************!*\
  !*** ./src/classes/Visualizer.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Visualizer": () => (/* binding */ Visualizer)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");

var Visualizer = /** @class */ (function () {
    function Visualizer() {
    }
    Visualizer.drawNetwork = function (ctx, network) {
        var margin = 50;
        var left = margin;
        var top = margin;
        var width = ctx.canvas.width - margin * 2;
        var height = ctx.canvas.height - margin * 2;
        var levelHeight = height / network.levels.length;
        for (var i = network.levels.length - 1; i >= 0; i--) {
            // reverse drawing order on canvas
            var levelTop = top + (0,_utils__WEBPACK_IMPORTED_MODULE_0__.lerp)(height - levelHeight, 0, network.levels.length === 1 ? 0.5 : i / (network.levels.length - 1));
            ctx.setLineDash([7, 3]);
            Visualizer.drawLevel(ctx, network.levels[i], left, levelTop, width, levelHeight, i === network.levels.length - 1 ? ['F', 'L', 'R', 'B'] : []);
        }
    };
    Visualizer.drawLevel = function (ctx, level, left, top, width, height, lables) {
        var inputs = level.inputs, outputs = level.outputs, weights = level.weights, biases = level.biases;
        var right = left + width;
        var bottom = top + height;
        var nodeRadius = 20;
        for (var i = 0; i < inputs.length; i++) {
            for (var j = 0; j < outputs.length; j++) {
                ctx.beginPath();
                ctx.moveTo(Visualizer.getNodeX(inputs, i, left, right), bottom);
                ctx.lineTo(Visualizer.getNodeX(outputs, j, left, right), top);
                ctx.lineWidth = 2;
                ctx.strokeStyle = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getRGBA)(weights[i][j]);
                ctx.stroke();
            }
        }
        for (var i = 0; i < inputs.length; i++) {
            var x = Visualizer.getNodeX(inputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'darkgreen';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getRGBA)(inputs[i]);
            ctx.fill();
        }
        for (var i = 0; i < outputs.length; i++) {
            var x = Visualizer.getNodeX(outputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'darkgreen';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getRGBA)(outputs[i]);
            ctx.fill();
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
            ctx.strokeStyle = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getRGBA)(biases[i]);
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);
            if (lables[i]) {
                ctx.beginPath();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'darkgreen';
                ctx.strokeStyle = 'white';
                ctx.font = "bold ".concat(nodeRadius * 1, "px Arial");
                ctx.fillText(lables[i], x, top);
                ctx.lineWidth = 0.5;
                ctx.strokeText(lables[i], x, top);
            }
        }
    };
    Visualizer.getNodeX = function (nodes, index, left, right) {
        return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.lerp)(left, right, nodes.length === 1 ? 0.5 : index / (nodes.length - 1));
    };
    return Visualizer;
}());



/***/ }),

/***/ "./src/models.ts":
/*!***********************!*\
  !*** ./src/models.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CONTROL": () => (/* binding */ CONTROL)
/* harmony export */ });
var CONTROL;
(function (CONTROL) {
    CONTROL["KEYS"] = "KEYS";
    CONTROL["DUMMY"] = "DUMMY";
    CONTROL["AI"] = "AI";
})(CONTROL || (CONTROL = {}));


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getIntersection": () => (/* binding */ getIntersection),
/* harmony export */   "getRGBA": () => (/* binding */ getRGBA),
/* harmony export */   "lerp": () => (/* binding */ lerp),
/* harmony export */   "polysIntersect": () => (/* binding */ polysIntersect)
/* harmony export */ });
function lerp(a, b, t) {
    return a + (b - a) * t;
}
function getIntersection(a, b, c, d) {
    var tTop = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x);
    var uTop = (c.y - a.y) * (a.x - b.x) - (c.x - a.x) * (a.y - b.y);
    var bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y);
    if (bottom !== 0) {
        var t = tTop / bottom;
        var u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(a.x, b.x, t),
                y: lerp(a.y, b.y, t),
                offset: t,
            };
        }
    }
    return null;
}
function polysIntersect(poly1, poly2) {
    for (var i = 0; i < poly1.length; i++) {
        for (var j = 0; j < poly2.length; j++) {
            var touch = getIntersection(poly1[i], //
            poly1[(i + 1) % poly1.length], poly2[j], poly2[(j + 1) % poly2.length]);
            if (touch) {
                return true;
            }
        }
    }
    return false;
}
function getRGBA(value) {
    var alpha = Math.abs(value);
    var r = value > 0 ? 0 : 255;
    var g = value < 0 ? 0 : 255;
    var b = 255;
    return "rgba(".concat(r, ",").concat(g, ",").concat(b, ",").concat(alpha, ")");
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _classes_Car__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./classes/Car */ "./src/classes/Car.ts");
/* harmony import */ var _classes_Network__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./classes/Network */ "./src/classes/Network.ts");
/* harmony import */ var _classes_Road__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./classes/Road */ "./src/classes/Road.ts");
/* harmony import */ var _classes_Visualizer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./classes/Visualizer */ "./src/classes/Visualizer.ts");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./models */ "./src/models.ts");





var carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;
var networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 300;
var saveBtn = document.getElementById('save');
saveBtn.onclick = function () { return save(); };
var delBtn = document.getElementById('delete');
delBtn.onclick = function () { return discard(); };
var dnaSelect = document.getElementById('dna');
dnaSelect.onchange = function (e) { return localStorage.setItem('dna', JSON.stringify(e.target.value)); };
var carsSelect = document.getElementById('cars');
carsSelect.onchange = function (e) { return localStorage.setItem('cars', JSON.stringify(e.target.value)); };
var carCtx = carCanvas.getContext('2d');
var networkCtx = networkCanvas.getContext('2d');
var road = new _classes_Road__WEBPACK_IMPORTED_MODULE_2__.Road(carCanvas.width / 2, carCanvas.width * 0.9);
var n = 1;
var mutateValue = 0.5;
if (localStorage.getItem('cars')) {
    var value = localStorage.getItem('cars');
    n = Number(JSON.parse(value));
}
if (localStorage.getItem('dna')) {
    var value = localStorage.getItem('dna');
    mutateValue = Number(JSON.parse(value));
}
carsSelect.value = n.toString();
dnaSelect.value = mutateValue.toString();
var cars = generateCars(n);
var bestCar = cars[0];
if (!localStorage.getItem('bestBrain') && !localStorage.getItem('init')) {
    var defaultBestBrain = JSON.stringify({
        levels: [
            {
                inputs: [0.4102945266595419, 0, 0, 0, 0],
                outputs: [0, 0, 0, 1, 0, 0],
                biases: [0.1962922231959734, 0.5367099018497876, 0.10172583674319013, -0.26908625859977486, 0.3394455918976538, -0.05712848365334566],
                weights: [
                    [0.17974021862359968, -0.11102523429791877, -0.5426159247605957, -0.24563119225571883, -0.20495874094196087, -0.8263884527110488],
                    [-0.3503237507420016, -0.01916520473353467, -0.2989811720566733, -0.5275187843482703, 0.640436186546111, -0.2577538149130878],
                    [-0.16333994628536241, 0.2007634196383441, 0.008908677318323122, -0.45572880930700377, 0.6056748785836785, 0.045058390130371384],
                    [-0.2189972011596799, -0.7143436085596897, 0.7174669317265192, 0.5739678507114592, -0.028579345004591028, 0.41209626977243996],
                    [0.22992179021970038, 0.0008699523001456377, -0.11366559314215552, 0.1112520726841153, -0.5205834524697048, -0.5484622772246524],
                ],
            },
            {
                inputs: [0, 0, 0, 1, 0, 0],
                outputs: [1, 0, 0, 0],
                biases: [-0.27869460558716086, 0.3293407830949491, -0.7712322671108596, 0.02938609856675045],
                weights: [
                    [0.15788700253349042, -0.38073413462521466, -0.1285074249060969, 0.21719920991898256],
                    [-0.27088392588446286, 0.2951937518604202, 0.1566403781711463, -0.1169307952162455],
                    [0.4044270741907148, 0.46066921330750876, -0.4336988780424471, -0.5925630867673444],
                    [0.06784795011088751, 0.11167935260502215, -0.8212532591737616, -0.48059837028488617],
                    [-0.05319245939571893, -0.49904095966195294, 0.23269720183261322, 0.35105743271215806],
                    [-0.10240077380058787, -0.5946951690470295, 0.3046172918406014, 0.23126207775933483],
                ],
            },
        ],
    });
    localStorage.setItem('bestBrain', defaultBestBrain);
    localStorage.setItem('init', 'false');
}
if (localStorage.getItem('bestBrain')) {
    for (var i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'));
        if (i != 0) {
            _classes_Network__WEBPACK_IMPORTED_MODULE_1__.NeuralNetwork.mutate(cars[i].brain, mutateValue);
        }
    }
}
var traffic = [
    new _classes_Car__WEBPACK_IMPORTED_MODULE_0__.Car(road.getLaneCenter(1), -100, 30, 50, _models__WEBPACK_IMPORTED_MODULE_4__.CONTROL.DUMMY, 2),
    new _classes_Car__WEBPACK_IMPORTED_MODULE_0__.Car(road.getLaneCenter(0), -300, 30, 50, _models__WEBPACK_IMPORTED_MODULE_4__.CONTROL.DUMMY, 2),
    new _classes_Car__WEBPACK_IMPORTED_MODULE_0__.Car(road.getLaneCenter(2), -300, 30, 50, _models__WEBPACK_IMPORTED_MODULE_4__.CONTROL.DUMMY, 2),
    new _classes_Car__WEBPACK_IMPORTED_MODULE_0__.Car(road.getLaneCenter(0), -500, 30, 50, _models__WEBPACK_IMPORTED_MODULE_4__.CONTROL.DUMMY, 2),
    new _classes_Car__WEBPACK_IMPORTED_MODULE_0__.Car(road.getLaneCenter(1), -500, 30, 50, _models__WEBPACK_IMPORTED_MODULE_4__.CONTROL.DUMMY, 2),
    new _classes_Car__WEBPACK_IMPORTED_MODULE_0__.Car(road.getLaneCenter(1), -700, 30, 50, _models__WEBPACK_IMPORTED_MODULE_4__.CONTROL.DUMMY, 2),
    new _classes_Car__WEBPACK_IMPORTED_MODULE_0__.Car(road.getLaneCenter(2), -700, 30, 50, _models__WEBPACK_IMPORTED_MODULE_4__.CONTROL.DUMMY, 2),
];
animate(0);
function save() {
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
    console.log('Brain saved!');
}
function discard() {
    confirm('Warning! You are about to delete current best brain. After this you will have to train your car again, have fun!');
    localStorage.removeItem('bestBrain');
    console.log('Brain deleted!');
    location.reload();
}
function generateCars(n) {
    var cars = [];
    for (var i = 1; i <= n; i++) {
        cars.push(new _classes_Car__WEBPACK_IMPORTED_MODULE_0__.Car(road.getLaneCenter(1), 100, 30, 50, _models__WEBPACK_IMPORTED_MODULE_4__.CONTROL.AI));
    }
    return cars;
}
function animate(time) {
    traffic.forEach(function (trafficCar) {
        trafficCar.update(road.borders, []);
    });
    cars.forEach(function (car) { return car.update(road.borders, traffic); });
    bestCar = cars.find(function (car) { return car.y === Math.min.apply(Math, cars.map(function (car) { return car.y; })); });
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);
    road.draw(carCtx);
    traffic.forEach(function (trafficCar) {
        trafficCar.draw(carCtx, 'red');
    });
    carCtx.globalAlpha = 0.2;
    cars.forEach(function (car) { return car.draw(carCtx, 'blue'); });
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, 'blue', true);
    carCtx.restore();
    networkCtx.lineDashOffset = -time / 50;
    _classes_Visualizer__WEBPACK_IMPORTED_MODULE_3__.Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQXNDO0FBQ0o7QUFDUTtBQUNFO0FBQ0Y7QUFFMUM7SUFpQkksYUFBWSxDQUFTLEVBQUUsQ0FBUyxFQUFFLEtBQWEsRUFBRSxNQUFjLEVBQUUsV0FBb0IsRUFBRSxRQUFvQjtRQUFwQix1Q0FBb0I7UUFDdkcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUM7UUFDeEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUVyQixJQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsS0FBSywrQ0FBVSxDQUFDO1FBRTNDLElBQUksV0FBVyxJQUFJLGtEQUFhLEVBQUU7WUFDOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLDJDQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLG1EQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNoRTtRQUNELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSwrQ0FBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFTywwQkFBWSxHQUFwQjtRQUNJLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNsQixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwRCxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWxELE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDUixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRztZQUM5QyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRztTQUNqRCxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ1IsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUc7WUFDOUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUc7U0FDakQsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNSLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUc7WUFDeEQsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRztTQUMz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TSxTQUFTLElBQUksQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7SUFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLENBQUM7QUFFTSxTQUFTLGVBQWUsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO0lBQ3RFLElBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkUsSUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRSxJQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXJFLElBQUksTUFBTSxLQUFLLENBQUMsRUFBRTtRQUNkLElBQU0sQ0FBQyxHQUFHLElBQUksR0FBRyxNQUFNLENB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LENBQUM7SUFDdEMsYUFBYSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO0lBRTFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNkLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ3pELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFVBQVU7UUFDdkIsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbkMsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztJQUN6QixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxJQUFLLFVBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUF4QixDQUF3QixDQUFDLENBQUM7SUFDaEQsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7SUFDdkIsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBRW5DLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUVqQixVQUFVLENBQUMsY0FBYyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUN2Qyx1RUFBc0IsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRWxELHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ25DLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9haS1jYXIvLi9zcmMvY2xhc3Nlcy9DYXIudHMiLCJ3ZWJwYWNrOi8vYWktY2FyLy4vc3JjL2NsYXNzZXMvQ29udHJvbHMudHMiLCJ3ZWJwYWNrOi8vYWktY2FyLy4vc3JjL2NsYXNzZXMvTmV0d29yay50cyIsIndlYnBhY2s6Ly9haS1jYXIvLi9zcmMvY2xhc3Nlcy9Sb2FkLnRzIiwid2VicGFjazovL2FpLWNhci8uL3NyYy9jbGFzc2VzL1NlbnNvci50cyIsIndlYnBhY2s6Ly9haS1jYXIvLi9zcmMvY2xhc3Nlcy9WaXN1YWxpemVyLnRzIiwid2VicGFjazovL2FpLWNhci8uL3NyYy9tb2RlbHMudHMiLCJ3ZWJwYWNrOi8vYWktY2FyLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL2FpLWNhci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9haS1jYXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2FpLWNhci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2FpLWNhci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2FpLWNhci8uL3NyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRyb2xzIH0gZnJvbSAnLi9Db250cm9scyc7XHJcbmltcG9ydCB7IFNlbnNvciB9IGZyb20gJy4vU2Vuc29yJztcclxuaW1wb3J0IHsgTmV1cmFsTmV0d29yayB9IGZyb20gJy4vTmV0d29yayc7XHJcbmltcG9ydCB7IElDb29yZCwgQ09OVFJPTCB9IGZyb20gJy4uL21vZGVscyc7XHJcbmltcG9ydCB7IHBvbHlzSW50ZXJzZWN0IH0gZnJvbSAnLi4vdXRpbHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENhciB7XHJcbiAgICB4OiBudW1iZXI7XHJcbiAgICB5OiBudW1iZXI7XHJcbiAgICB3aWR0aDogbnVtYmVyO1xyXG4gICAgaGVpZ2h0OiBudW1iZXI7XHJcbiAgICBjb250cm9sczogQ29udHJvbHM7XHJcbiAgICBzcGVlZDogbnVtYmVyO1xyXG4gICAgYWNjZWxlcmF0aW9uOiBudW1iZXI7XHJcbiAgICBtYXhTcGVlZDogbnVtYmVyO1xyXG4gICAgZnJpY3Rpb246IG51bWJlcjtcclxuICAgIGFuZ2xlOiBudW1iZXI7XHJcbiAgICBzZW5zb3I6IFNlbnNvcjtcclxuICAgIHBvbHlnb246IEFycmF5PElDb29yZD47XHJcbiAgICBkYW1hZ2VkOiBib29sZWFuO1xyXG4gICAgYnJhaW46IE5ldXJhbE5ldHdvcms7XHJcbiAgICB1c2VCcmFpbjogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGNvbnRyb2xUeXBlOiBDT05UUk9MLCBtYXhTcGVlZDogbnVtYmVyID0gMykge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMuc3BlZWQgPSAwO1xyXG4gICAgICAgIHRoaXMuYWNjZWxlcmF0aW9uID0gMC4yO1xyXG4gICAgICAgIHRoaXMubWF4U3BlZWQgPSBtYXhTcGVlZDtcclxuICAgICAgICB0aGlzLmZyaWN0aW9uID0gMC4wNTtcclxuICAgICAgICB0aGlzLmFuZ2xlID0gMDtcclxuICAgICAgICB0aGlzLmRhbWFnZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy51c2VCcmFpbiA9IGNvbnRyb2xUeXBlID09PSBDT05UUk9MLkFJO1xyXG5cclxuICAgICAgICBpZiAoY29udHJvbFR5cGUgIT0gQ09OVFJPTC5EVU1NWSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbnNvciA9IG5ldyBTZW5zb3IodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuYnJhaW4gPSBuZXcgTmV1cmFsTmV0d29yayhbdGhpcy5zZW5zb3IucmF5Q291bnQsIDYsIDRdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb250cm9scyA9IG5ldyBDb250cm9scyhjb250cm9sVHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVQbHlnb24oKTogQXJyYXk8SUNvb3JkPiB7XHJcbiAgICAgICAgY29uc3QgcG9pbnRzID0gW107XHJcbiAgICAgICAgY29uc3QgcmFkID0gTWF0aC5oeXBvdCh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCkgLyAyO1xyXG4gICAgICAgIGNvbnN0IGFscGhhID0gTWF0aC5hdGFuMih0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblxyXG4gICAgICAgIHBvaW50cy5wdXNoKHtcclxuICAgICAgICAgICAgeDogdGhpcy54IC0gTWF0aC5zaW4odGhpcy5hbmdsZSAtIGFscGhhKSAqIHJhZCxcclxuICAgICAgICAgICAgeTogdGhpcy55IC0gTWF0aC5jb3ModGhpcy5hbmdsZSAtIGFscGhhKSAqIHJhZCxcclxuICAgICAgICB9KTtcclxuICAgICAgICBwb2ludHMucHVzaCh7XHJcbiAgICAgICAgICAgIHg6IHRoaXMueCAtIE1hdGguc2luKHRoaXMuYW5nbGUgKyBhbHBoYSkgKiByYWQsXHJcbiAgICAgICAgICAgIHk6IHRoaXMueSAtIE1hdGguY29zKHRoaXMuYW5nbGUgKyBhbHBoYSkgKiByYWQsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcG9pbnRzLnB1c2goe1xyXG4gICAgICAgICAgICB4OiB0aGlzLnggLSBNYXRoLnNpbihNYXRoLlBJICsgdGhpcy5hbmdsZSAtIGFscGhhKSAqIHJhZCxcclxuICAgICAgICAgICAgeTogdGhpcy55IC0gTWF0aC5jb3MoTWF0aC5QSSArIHRoaXMuYW5nbGUgLSBhbHBoYSkgKiByYWQsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcG9pbnRzLnB1c2goe1xyXG4gICAgICAgICAgICB4OiB0aGlzLnggLSBNYXRoLnNpbihNYXRoLlBJICsgdGhpcy5hbmdsZSArIGFscGhhKSAqIHJhZCxcclxuICAgICAgICAgICAgeTogdGhpcy55IC0gTWF0aC5jb3MoTWF0aC5QSSArIHRoaXMuYW5nbGUgKyBhbHBoYSkgKiByYWQsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBwb2ludHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtb3ZlKCkge1xyXG4gICAgICAgIC8vIGFjY2VsZXJhdGlvbiBhbmQgYnJlYWtpbmdcclxuICAgICAgICBpZiAodGhpcy5jb250cm9scy5mb3J3YXJkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3BlZWQgKz0gdGhpcy5hY2NlbGVyYXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnJldmVyc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5zcGVlZCAtPSB0aGlzLmFjY2VsZXJhdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNhcHBpbmcgdGhlIHNwZWVkXHJcbiAgICAgICAgaWYgKHRoaXMuc3BlZWQgPj0gdGhpcy5tYXhTcGVlZCkge1xyXG4gICAgICAgICAgICB0aGlzLnNwZWVkID0gdGhpcy5tYXhTcGVlZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuc3BlZWQgPD0gLXRoaXMubWF4U3BlZWQgLyAyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3BlZWQgPSAtdGhpcy5tYXhTcGVlZCAvIDI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBhcHBseWluZyB0aGUgZnJpY3Rpb25cclxuICAgICAgICBpZiAodGhpcy5zcGVlZCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5zcGVlZCAtPSB0aGlzLmZyaWN0aW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5zcGVlZCA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy5zcGVlZCArPSB0aGlzLmZyaWN0aW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoTWF0aC5hYnModGhpcy5zcGVlZCkgPCB0aGlzLmZyaWN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3BlZWQgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gc3RlZXJpbmdcclxuICAgICAgICBpZiAodGhpcy5zcGVlZCAhPSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZsaXAgPSB0aGlzLnNwZWVkID4gMCA/IDEgOiAtMTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLmxlZnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5nbGUgKz0gMC4wMyAqIGZsaXA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuY29udHJvbHMucmlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5nbGUgLT0gMC4wMyAqIGZsaXA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMueCAtPSBNYXRoLnNpbih0aGlzLmFuZ2xlKSAqIHRoaXMuc3BlZWQ7XHJcbiAgICAgICAgdGhpcy55IC09IE1hdGguY29zKHRoaXMuYW5nbGUpICogdGhpcy5zcGVlZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFzc2Vzc0RhbWFnZShyb2FkQm9yZGVyczogSUNvb3JkW11bXSwgdHJhZmZpYzogQ2FyW10pOiBib29sZWFuIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvYWRCb3JkZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwb2x5c0ludGVyc2VjdCh0aGlzLnBvbHlnb24sIHJvYWRCb3JkZXJzW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJhZmZpYy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAocG9seXNJbnRlcnNlY3QodGhpcy5wb2x5Z29uLCB0cmFmZmljW2ldLnBvbHlnb24pKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKHJvYWRCb3JkZXJzOiBJQ29vcmRbXVtdLCB0cmFmZmljOiBDYXJbXSkge1xyXG4gICAgICAgIGlmICghdGhpcy5kYW1hZ2VkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnBvbHlnb24gPSB0aGlzLmNyZWF0ZVBseWdvbigpO1xyXG4gICAgICAgICAgICB0aGlzLmRhbWFnZWQgPSB0aGlzLmFzc2Vzc0RhbWFnZShyb2FkQm9yZGVycywgdHJhZmZpYyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5zZW5zb3IpIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5zb3IudXBkYXRlKHJvYWRCb3JkZXJzLCB0cmFmZmljKTtcclxuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0cyA9IHRoaXMuc2Vuc29yLnJlYWRpbmdzLm1hcCgocykgPT4gKHMgPT09IG51bGwgPyAwIDogMSAtIHMub2Zmc2V0KSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG91dHB1dHMgPSBOZXVyYWxOZXR3b3JrLmZlZWRGb3J3YXJkKG9mZnNldHMsIHRoaXMuYnJhaW4pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMudXNlQnJhaW4pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbHMuZm9yd2FyZCA9IEJvb2xlYW4ob3V0cHV0c1swXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLmxlZnQgPSBCb29sZWFuKG91dHB1dHNbMV0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy5yaWdodCA9IEJvb2xlYW4ob3V0cHV0c1syXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLnJldmVyc2UgPSBCb29sZWFuKG91dHB1dHNbM10pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIGNvbG9yOiBzdHJpbmcsIGRyYXdTZW5zb3IgPSBmYWxzZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmRhbWFnZWQpIHtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdzaWx2ZXInO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8odGhpcy5wb2x5Z29uWzBdLngsIHRoaXMucG9seWdvblswXS55KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMucG9seWdvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKHRoaXMucG9seWdvbltpXS54LCB0aGlzLnBvbHlnb25baV0ueSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnNlbnNvciAmJiBkcmF3U2Vuc29yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Vuc29yLmRyYXcoY3R4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ09OVFJPTCB9IGZyb20gJy4uL21vZGVscyc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29udHJvbHMge1xyXG4gICAgZm9yd2FyZDogYm9vbGVhbjtcclxuICAgIGxlZnQ6IGJvb2xlYW47XHJcbiAgICByaWdodDogYm9vbGVhbjtcclxuICAgIHJldmVyc2U6IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IodHlwZTogQ09OVFJPTCkge1xyXG4gICAgICAgIHRoaXMuZm9yd2FyZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubGVmdCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmlnaHQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJldmVyc2UgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgQ09OVFJPTC5LRVlTOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRLZXlib2FyZExpc3RlbmVycygpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgQ09OVFJPTC5EVU1NWTpcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9yd2FyZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRLZXlib2FyZExpc3RlbmVycygpIHtcclxuICAgICAgICBkb2N1bWVudC5vbmtleWRvd24gPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXkpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWZ0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93UmlnaHQnOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dVcCc6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3J3YXJkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93RG93bic6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXZlcnNlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGRvY3VtZW50Lm9ua2V5dXAgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXkpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWZ0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1JpZ2h0JzpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1VwJzpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvcndhcmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93RG93bic6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXZlcnNlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IGxlcnAgfSBmcm9tICcuLi91dGlscyc7XHJcblxyXG5leHBvcnQgY2xhc3MgTmV1cmFsTmV0d29yayB7XHJcbiAgICBsZXZlbHM6IExldmVsW107XHJcblxyXG4gICAgY29uc3RydWN0b3IobmV1cm9uQ291bnRzOiBudW1iZXJbXSkge1xyXG4gICAgICAgIHRoaXMubGV2ZWxzID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV1cm9uQ291bnRzLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmxldmVscy5wdXNoKG5ldyBMZXZlbChuZXVyb25Db3VudHNbaV0sIG5ldXJvbkNvdW50c1tpICsgMV0pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZlZWRGb3J3YXJkKGdpdmVuSW5wdXRzOiBudW1iZXJbXSwgbmV0d29yazogTmV1cmFsTmV0d29yayk6IG51bWJlcltdIHtcclxuICAgICAgICBsZXQgb3V0cHV0cyA9IExldmVsLmZlZWRGb3J3YXJkKGdpdmVuSW5wdXRzLCBuZXR3b3JrLmxldmVsc1swXSk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBuZXR3b3JrLmxldmVscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBvdXRwdXRzID0gTGV2ZWwuZmVlZEZvcndhcmQob3V0cHV0cywgbmV0d29yay5sZXZlbHNbaV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dHB1dHM7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG11dGF0ZShuZXR3b3JrOiBOZXVyYWxOZXR3b3JrLCBhbW91bnQ6IG51bWJlcikge1xyXG4gICAgICAgIG5ldHdvcmsubGV2ZWxzLmZvckVhY2goKGxldmVsKSA9PiB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGV2ZWwuYmlhc2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXZlbC5iaWFzZXNbaV0gPSBsZXJwKGxldmVsLmJpYXNlc1tpXSwgTWF0aC5yYW5kb20oKSAqIDIgLSAxLCBhbW91bnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxldmVsLndlaWdodHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbGV2ZWwud2VpZ2h0c1tpXS5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldmVsLndlaWdodHNbaV1bal0gPSBsZXJwKGxldmVsLndlaWdodHNbaV1bal0sIE1hdGgucmFuZG9tKCkgKiAyIC0gMSwgYW1vdW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTGV2ZWwge1xyXG4gICAgaW5wdXRzOiBudW1iZXJbXTtcclxuICAgIG91dHB1dHM6IG51bWJlcltdO1xyXG4gICAgYmlhc2VzOiBudW1iZXJbXTtcclxuICAgIHdlaWdodHM6IG51bWJlcltdW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoaW5wdXRDb3VudDogbnVtYmVyLCBvdXRwdXRDb3VudDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5pbnB1dHMgPSBuZXcgQXJyYXkoaW5wdXRDb3VudCk7XHJcbiAgICAgICAgdGhpcy5vdXRwdXRzID0gbmV3IEFycmF5KG91dHB1dENvdW50KTtcclxuICAgICAgICB0aGlzLmJpYXNlcyA9IG5ldyBBcnJheShvdXRwdXRDb3VudCk7XHJcblxyXG4gICAgICAgIHRoaXMud2VpZ2h0cyA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0Q291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLndlaWdodHNbaV0gPSBuZXcgQXJyYXkob3V0cHV0Q291bnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgTGV2ZWwucmFuZG9taXplKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHJhbmRvbWl6ZShsZXZlbDogTGV2ZWwpOiB2b2lkIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxldmVsLmlucHV0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGxldmVsLm91dHB1dHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldmVsLndlaWdodHNbaV1bal0gPSBNYXRoLnJhbmRvbSgpICogMiAtIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGV2ZWwuYmlhc2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldmVsLmJpYXNlc1tpXSA9IE1hdGgucmFuZG9tKCkgKiAyIC0gMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZlZWRGb3J3YXJkKGdpdmVuSW5wdXRzOiBudW1iZXJbXSwgbGV2ZWw6IExldmVsKTogbnVtYmVyW10ge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGV2ZWwuaW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldmVsLmlucHV0c1tpXSA9IGdpdmVuSW5wdXRzW2ldO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZXZlbC5vdXRwdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBzdW0gPSAwO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBsZXZlbC5pbnB1dHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHN1bSArPSBsZXZlbC5pbnB1dHNbal0gKiBsZXZlbC53ZWlnaHRzW2pdW2ldO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc3VtID4gbGV2ZWwuYmlhc2VzW2ldKSB7XHJcbiAgICAgICAgICAgICAgICBsZXZlbC5vdXRwdXRzW2ldID0gMTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldmVsLm91dHB1dHNbaV0gPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbGV2ZWwub3V0cHV0cztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBsZXJwIH0gZnJvbSAnLi4vdXRpbHMnO1xyXG5pbXBvcnQgeyBJQ29vcmQgfSBmcm9tICcuLi9tb2RlbHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJvYWQge1xyXG4gICAgeDogbnVtYmVyO1xyXG4gICAgd2lkdGg6IG51bWJlcjtcclxuICAgIGxhbmVDb3VudDogbnVtYmVyO1xyXG4gICAgbGVmdDogbnVtYmVyO1xyXG4gICAgcmlnaHQ6IG51bWJlcjtcclxuICAgIHRvcDogbnVtYmVyO1xyXG4gICAgYm90dG9tOiBudW1iZXI7XHJcbiAgICBib3JkZXJzOiBBcnJheTxBcnJheTxJQ29vcmQ+PjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGxhbmVDb3VudDogbnVtYmVyID0gMykge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMubGFuZUNvdW50ID0gbGFuZUNvdW50O1xyXG5cclxuICAgICAgICB0aGlzLmxlZnQgPSB4IC0gd2lkdGggLyAyO1xyXG4gICAgICAgIHRoaXMucmlnaHQgPSB4ICsgd2lkdGggLyAyO1xyXG5cclxuICAgICAgICBjb25zdCBpbmZpbml0eSA9IDEwMDAwMDAwO1xyXG4gICAgICAgIHRoaXMudG9wID0gLWluZmluaXR5O1xyXG4gICAgICAgIHRoaXMuYm90dG9tID0gaW5maW5pdHk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRvcExlZnQgPSB7IHg6IHRoaXMubGVmdCwgeTogdGhpcy50b3AgfTtcclxuICAgICAgICBjb25zdCB0b3BSaWdodCA9IHsgeDogdGhpcy5yaWdodCwgeTogdGhpcy50b3AgfTtcclxuICAgICAgICBjb25zdCBib3R0b21MZWZ0ID0geyB4OiB0aGlzLmxlZnQsIHk6IHRoaXMuYm90dG9tIH07XHJcbiAgICAgICAgY29uc3QgYm90dG9tUmlnaHQgPSB7IHg6IHRoaXMucmlnaHQsIHk6IHRoaXMuYm90dG9tIH07XHJcbiAgICAgICAgdGhpcy5ib3JkZXJzID0gW1xyXG4gICAgICAgICAgICBbdG9wTGVmdCwgYm90dG9tTGVmdF0sXHJcbiAgICAgICAgICAgIFt0b3BSaWdodCwgYm90dG9tUmlnaHRdLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TGFuZUNlbnRlcihsYW5lSW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGxhbmVXaWR0aCA9IHRoaXMud2lkdGggLyB0aGlzLmxhbmVDb3VudDtcclxuICAgICAgICByZXR1cm4gdGhpcy5sZWZ0ICsgbGFuZVdpZHRoIC8gMiArIE1hdGgubWluKGxhbmVJbmRleCwgdGhpcy5sYW5lQ291bnQgLSAxKSAqIGxhbmVXaWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ29yYW5nZSc7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDU7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5sYW5lQ291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB4ID0gbGVycCh0aGlzLmxlZnQsIHRoaXMucmlnaHQsIGkgLyB0aGlzLmxhbmVDb3VudCk7XHJcblxyXG4gICAgICAgICAgICBjdHguc2V0TGluZURhc2goWzIwLCAyMF0pO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oeCwgdGhpcy50b3ApO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKHgsIHRoaXMuYm90dG9tKTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3R4LnNldExpbmVEYXNoKFtdKTtcclxuICAgICAgICB0aGlzLmJvcmRlcnMuZm9yRWFjaCgoYm9yZGVyKSA9PiB7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyhib3JkZXJbMF0ueCwgYm9yZGVyWzBdLnkpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKGJvcmRlclsxXS54LCBib3JkZXJbMV0ueSk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDYXIgfSBmcm9tICcuL0Nhcic7XHJcbmltcG9ydCB7IGxlcnAsIGdldEludGVyc2VjdGlvbiB9IGZyb20gJy4uL3V0aWxzJztcclxuaW1wb3J0IHsgSUNvb3JkLCBJQ29vcmRXaXRoT2Zmc2V0IH0gZnJvbSAnLi4vbW9kZWxzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBTZW5zb3Ige1xyXG4gICAgY2FyOiBDYXI7XHJcbiAgICByYXlDb3VudDogbnVtYmVyO1xyXG4gICAgcmF5TGVuZ3RoOiBudW1iZXI7XHJcbiAgICByYXlTcHJlYWQ6IG51bWJlcjtcclxuICAgIHJheXM6IEFycmF5PEFycmF5PHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfT4+O1xyXG4gICAgcmVhZGluZ3M6IEFycmF5PGFueT47XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2FyOiBDYXIpIHtcclxuICAgICAgICB0aGlzLmNhciA9IGNhcjtcclxuICAgICAgICB0aGlzLnJheUNvdW50ID0gNTtcclxuICAgICAgICB0aGlzLnJheUxlbmd0aCA9IDE1MDtcclxuICAgICAgICB0aGlzLnJheVNwcmVhZCA9IE1hdGguUEkgLyAyO1xyXG4gICAgICAgIHRoaXMucmF5cyA9IFtdO1xyXG4gICAgICAgIHRoaXMucmVhZGluZ3MgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUocm9hZEJvcmRlcnM6IElDb29yZFtdW10sIHRyYWZmaWM6IENhcltdKSB7XHJcbiAgICAgICAgdGhpcy5jYXN0UmF5cygpO1xyXG4gICAgICAgIHRoaXMucmVhZGluZ3MgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucmF5cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnJlYWRpbmdzLnB1c2godGhpcy5nZXRSZWFkaW5nKHRoaXMucmF5c1tpXSwgcm9hZEJvcmRlcnMsIHRyYWZmaWMpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyhjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yYXlDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBlbmQgPSB0aGlzLnJheXNbaV1bMV07XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlYWRpbmdzW2ldKSB7XHJcbiAgICAgICAgICAgICAgICBlbmQgPSB0aGlzLnJlYWRpbmdzW2ldO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAyO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAneWVsbG93JztcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyh0aGlzLnJheXNbaV1bMF0ueCwgdGhpcy5yYXlzW2ldWzBdLnkpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKGVuZC54LCBlbmQueSk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDI7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdibGFjayc7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8odGhpcy5yYXlzW2ldWzFdLngsIHRoaXMucmF5c1tpXVsxXS55KTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyhlbmQueCwgZW5kLnkpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0UmVhZGluZyhyYXk6IElDb29yZFtdLCByb2FkQm9yZGVyczogSUNvb3JkW11bXSwgdHJhZmZpYzogQ2FyW10pIHtcclxuICAgICAgICBsZXQgdG91Y2hlczogSUNvb3JkV2l0aE9mZnNldFtdID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm9hZEJvcmRlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgdG91Y2ggPSBnZXRJbnRlcnNlY3Rpb24ocmF5WzBdLCByYXlbMV0sIHJvYWRCb3JkZXJzW2ldWzBdLCByb2FkQm9yZGVyc1tpXVsxXSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodG91Y2gpIHtcclxuICAgICAgICAgICAgICAgIHRvdWNoZXMucHVzaCh0b3VjaCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJhZmZpYy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBwb2x5ID0gdHJhZmZpY1tpXS5wb2x5Z29uO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwb2x5Lmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0b3VjaCA9IGdldEludGVyc2VjdGlvbihyYXlbMF0sIHJheVsxXSwgcG9seVtqXSwgcG9seVsoaiArIDEpICUgcG9seS5sZW5ndGhdKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodG91Y2gpIHtcclxuICAgICAgICAgICAgICAgICAgICB0b3VjaGVzLnB1c2godG91Y2gpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodG91Y2hlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0cyA9IHRvdWNoZXMubWFwKChlbCkgPT4gZWwub2Zmc2V0KTtcclxuICAgICAgICAgICAgY29uc3QgbWluT2Zmc2V0ID0gTWF0aC5taW4oLi4ub2Zmc2V0cyk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdG91Y2hlcy5maW5kKChlbCkgPT4gZWwub2Zmc2V0ID09PSBtaW5PZmZzZXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNhc3RSYXlzKCkge1xyXG4gICAgICAgIHRoaXMucmF5cyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yYXlDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJheUFuZ2xlID0gbGVycCh0aGlzLnJheVNwcmVhZCAvIDIsIC10aGlzLnJheVNwcmVhZCAvIDIsIHRoaXMucmF5Q291bnQgPT09IDEgPyAwLjUgOiBpIC8gKHRoaXMucmF5Q291bnQgLSAxKSkgKyB0aGlzLmNhci5hbmdsZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0geyB4OiB0aGlzLmNhci54LCB5OiB0aGlzLmNhci55IH07XHJcbiAgICAgICAgICAgIGNvbnN0IGVuZCA9IHtcclxuICAgICAgICAgICAgICAgIHg6IHRoaXMuY2FyLnggLSBNYXRoLnNpbihyYXlBbmdsZSkgKiB0aGlzLnJheUxlbmd0aCxcclxuICAgICAgICAgICAgICAgIHk6IHRoaXMuY2FyLnkgLSBNYXRoLmNvcyhyYXlBbmdsZSkgKiB0aGlzLnJheUxlbmd0aCxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5yYXlzLnB1c2goW3N0YXJ0LCBlbmRdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgZ2V0UkdCQSwgbGVycCB9IGZyb20gJy4uL3V0aWxzJztcclxuaW1wb3J0IHsgTGV2ZWwsIE5ldXJhbE5ldHdvcmsgfSBmcm9tICcuL05ldHdvcmsnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZpc3VhbGl6ZXIge1xyXG4gICAgc3RhdGljIGRyYXdOZXR3b3JrKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBuZXR3b3JrOiBOZXVyYWxOZXR3b3JrKSB7XHJcbiAgICAgICAgY29uc3QgbWFyZ2luID0gNTA7XHJcbiAgICAgICAgY29uc3QgbGVmdCA9IG1hcmdpbjtcclxuICAgICAgICBjb25zdCB0b3AgPSBtYXJnaW47XHJcbiAgICAgICAgY29uc3Qgd2lkdGggPSBjdHguY2FudmFzLndpZHRoIC0gbWFyZ2luICogMjtcclxuICAgICAgICBjb25zdCBoZWlnaHQgPSBjdHguY2FudmFzLmhlaWdodCAtIG1hcmdpbiAqIDI7XHJcbiAgICAgICAgY29uc3QgbGV2ZWxIZWlnaHQgPSBoZWlnaHQgLyBuZXR3b3JrLmxldmVscy5sZW5ndGg7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSBuZXR3b3JrLmxldmVscy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICAvLyByZXZlcnNlIGRyYXdpbmcgb3JkZXIgb24gY2FudmFzXHJcblxyXG4gICAgICAgICAgICBjb25zdCBsZXZlbFRvcCA9IHRvcCArIGxlcnAoaGVpZ2h0IC0gbGV2ZWxIZWlnaHQsIDAsIG5ldHdvcmsubGV2ZWxzLmxlbmd0aCA9PT0gMSA/IDAuNSA6IGkgLyAobmV0d29yay5sZXZlbHMubGVuZ3RoIC0gMSkpO1xyXG5cclxuICAgICAgICAgICAgY3R4LnNldExpbmVEYXNoKFs3LCAzXSk7XHJcbiAgICAgICAgICAgIFZpc3VhbGl6ZXIuZHJhd0xldmVsKGN0eCwgbmV0d29yay5sZXZlbHNbaV0sIGxlZnQsIGxldmVsVG9wLCB3aWR0aCwgbGV2ZWxIZWlnaHQsIGkgPT09IG5ldHdvcmsubGV2ZWxzLmxlbmd0aCAtIDEgPyBbJ0YnLCAnTCcsICdSJywgJ0InXSA6IFtdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGRyYXdMZXZlbChjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgbGV2ZWw6IExldmVsLCBsZWZ0OiBudW1iZXIsIHRvcDogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgbGFibGVzOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIGNvbnN0IHsgaW5wdXRzLCBvdXRwdXRzLCB3ZWlnaHRzLCBiaWFzZXMgfSA9IGxldmVsO1xyXG4gICAgICAgIGNvbnN0IHJpZ2h0ID0gbGVmdCArIHdpZHRoO1xyXG4gICAgICAgIGNvbnN0IGJvdHRvbSA9IHRvcCArIGhlaWdodDtcclxuICAgICAgICBjb25zdCBub2RlUmFkaXVzID0gMjA7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgb3V0cHV0cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhWaXN1YWxpemVyLmdldE5vZGVYKGlucHV0cywgaSwgbGVmdCwgcmlnaHQpLCBib3R0b20pO1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhWaXN1YWxpemVyLmdldE5vZGVYKG91dHB1dHMsIGosIGxlZnQsIHJpZ2h0KSwgdG9wKTtcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAyO1xyXG4gICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gZ2V0UkdCQSh3ZWlnaHRzW2ldW2pdKTtcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgeCA9IFZpc3VhbGl6ZXIuZ2V0Tm9kZVgoaW5wdXRzLCBpLCBsZWZ0LCByaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4LmFyYyh4LCBib3R0b20sIG5vZGVSYWRpdXMsIDAsIE1hdGguUEkgKiAyKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdkYXJrZ3JlZW4nO1xyXG4gICAgICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5hcmMoeCwgYm90dG9tLCBub2RlUmFkaXVzICogMC42LCAwLCBNYXRoLlBJICogMik7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBnZXRSR0JBKGlucHV0c1tpXSk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG91dHB1dHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgeCA9IFZpc3VhbGl6ZXIuZ2V0Tm9kZVgob3V0cHV0cywgaSwgbGVmdCwgcmlnaHQpO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5hcmMoeCwgdG9wLCBub2RlUmFkaXVzLCAwLCBNYXRoLlBJICogMik7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnZGFya2dyZWVuJztcclxuICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHguYXJjKHgsIHRvcCwgbm9kZVJhZGl1cyAqIDAuNiwgMCwgTWF0aC5QSSAqIDIpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZ2V0UkdCQShvdXRwdXRzW2ldKTtcclxuICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuXHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDI7XHJcbiAgICAgICAgICAgIGN0eC5hcmMoeCwgdG9wLCBub2RlUmFkaXVzICogMC44LCAwLCBNYXRoLlBJICogMik7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGdldFJHQkEoYmlhc2VzW2ldKTtcclxuICAgICAgICAgICAgY3R4LnNldExpbmVEYXNoKFszLCAzXSk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgY3R4LnNldExpbmVEYXNoKFtdKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChsYWJsZXNbaV0pIHtcclxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcclxuICAgICAgICAgICAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJztcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnZGFya2dyZWVuJztcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICd3aGl0ZSc7XHJcbiAgICAgICAgICAgICAgICBjdHguZm9udCA9IGBib2xkICR7bm9kZVJhZGl1cyAqIDF9cHggQXJpYWxgO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGxhYmxlc1tpXSwgeCwgdG9wKTtcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAwLjU7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlVGV4dChsYWJsZXNbaV0sIHgsIHRvcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0Tm9kZVgobm9kZXM6IG51bWJlcltdLCBpbmRleDogbnVtYmVyLCBsZWZ0OiBudW1iZXIsIHJpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gbGVycChsZWZ0LCByaWdodCwgbm9kZXMubGVuZ3RoID09PSAxID8gMC41IDogaW5kZXggLyAobm9kZXMubGVuZ3RoIC0gMSkpO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBpbnRlcmZhY2UgSUNvb3JkIHtcclxuICAgIHg6IG51bWJlcjtcclxuICAgIHk6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQ29vcmRXaXRoT2Zmc2V0IGV4dGVuZHMgSUNvb3JkIHtcclxuICAgIG9mZnNldDogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgZW51bSBDT05UUk9MIHtcclxuICAgIEtFWVMgPSAnS0VZUycsXHJcbiAgICBEVU1NWSA9ICdEVU1NWScsXHJcbiAgICBBSSA9ICdBSScsXHJcbn1cclxuIiwiaW1wb3J0IHsgSUNvb3JkLCBJQ29vcmRXaXRoT2Zmc2V0IH0gZnJvbSAnLi9tb2RlbHMnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxlcnAoYTogbnVtYmVyLCBiOiBudW1iZXIsIHQ6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gYSArIChiIC0gYSkgKiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW50ZXJzZWN0aW9uKGE6IElDb29yZCwgYjogSUNvb3JkLCBjOiBJQ29vcmQsIGQ6IElDb29yZCk6IElDb29yZFdpdGhPZmZzZXQgfCBudWxsIHtcclxuICAgIGNvbnN0IHRUb3AgPSAoZC54IC0gYy54KSAqIChhLnkgLSBjLnkpIC0gKGQueSAtIGMueSkgKiAoYS54IC0gYy54KTtcclxuICAgIGNvbnN0IHVUb3AgPSAoYy55IC0gYS55KSAqIChhLnggLSBiLngpIC0gKGMueCAtIGEueCkgKiAoYS55IC0gYi55KTtcclxuICAgIGNvbnN0IGJvdHRvbSA9IChkLnkgLSBjLnkpICogKGIueCAtIGEueCkgLSAoZC54IC0gYy54KSAqIChiLnkgLSBhLnkpO1xyXG5cclxuICAgIGlmIChib3R0b20gIT09IDApIHtcclxuICAgICAgICBjb25zdCB0ID0gdFRvcCAvIGJvdHRvbTtcclxuICAgICAgICBjb25zdCB1ID0gdVRvcCAvIGJvdHRvbTtcclxuICAgICAgICBpZiAodCA+PSAwICYmIHQgPD0gMSAmJiB1ID49IDAgJiYgdSA8PSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB4OiBsZXJwKGEueCwgYi54LCB0KSxcclxuICAgICAgICAgICAgICAgIHk6IGxlcnAoYS55LCBiLnksIHQpLFxyXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiB0LFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBvbHlzSW50ZXJzZWN0KHBvbHkxOiBJQ29vcmRbXSwgcG9seTI6IElDb29yZFtdKTogYm9vbGVhbiB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvbHkxLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwb2x5Mi5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBjb25zdCB0b3VjaCA9IGdldEludGVyc2VjdGlvbihcclxuICAgICAgICAgICAgICAgIHBvbHkxW2ldLCAvL1xyXG4gICAgICAgICAgICAgICAgcG9seTFbKGkgKyAxKSAlIHBvbHkxLmxlbmd0aF0sXHJcbiAgICAgICAgICAgICAgICBwb2x5MltqXSxcclxuICAgICAgICAgICAgICAgIHBvbHkyWyhqICsgMSkgJSBwb2x5Mi5sZW5ndGhdXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBpZiAodG91Y2gpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFJHQkEodmFsdWU6IG51bWJlcikge1xyXG4gICAgY29uc3QgYWxwaGEgPSBNYXRoLmFicyh2YWx1ZSk7XHJcbiAgICBjb25zdCByID0gdmFsdWUgPiAwID8gMCA6IDI1NTtcclxuICAgIGNvbnN0IGcgPSB2YWx1ZSA8IDAgPyAwIDogMjU1O1xyXG4gICAgY29uc3QgYiA9IDI1NTtcclxuICAgIHJldHVybiBgcmdiYSgke3J9LCR7Z30sJHtifSwke2FscGhhfSlgO1xyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgQ2FyIH0gZnJvbSAnLi9jbGFzc2VzL0Nhcic7XHJcbmltcG9ydCB7IE5ldXJhbE5ldHdvcmsgfSBmcm9tICcuL2NsYXNzZXMvTmV0d29yayc7XHJcbmltcG9ydCB7IFJvYWQgfSBmcm9tICcuL2NsYXNzZXMvUm9hZCc7XHJcbmltcG9ydCB7IFZpc3VhbGl6ZXIgfSBmcm9tICcuL2NsYXNzZXMvVmlzdWFsaXplcic7XHJcbmltcG9ydCB7IENPTlRST0wgfSBmcm9tICcuL21vZGVscyc7XHJcblxyXG5jb25zdCBjYXJDYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyQ2FudmFzJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbmNhckNhbnZhcy53aWR0aCA9IDIwMDtcclxuY29uc3QgbmV0d29ya0NhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXR3b3JrQ2FudmFzJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbm5ldHdvcmtDYW52YXMud2lkdGggPSAzMDA7XHJcbmNvbnN0IHNhdmVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2F2ZScpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG5zYXZlQnRuLm9uY2xpY2sgPSAoKSA9PiBzYXZlKCk7XHJcbmNvbnN0IGRlbEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZWxldGUnKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuZGVsQnRuLm9uY2xpY2sgPSAoKSA9PiBkaXNjYXJkKCk7XHJcbmNvbnN0IGRuYVNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkbmEnKSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcclxuZG5hU2VsZWN0Lm9uY2hhbmdlID0gKGU6IGFueSkgPT4gbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2RuYScsIEpTT04uc3RyaW5naWZ5KGUudGFyZ2V0LnZhbHVlKSk7XHJcbmNvbnN0IGNhcnNTZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FycycpIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG5jYXJzU2VsZWN0Lm9uY2hhbmdlID0gKGU6IGFueSkgPT4gbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NhcnMnLCBKU09OLnN0cmluZ2lmeShlLnRhcmdldC52YWx1ZSkpO1xyXG5cclxuY29uc3QgY2FyQ3R4ID0gY2FyQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbmNvbnN0IG5ldHdvcmtDdHggPSBuZXR3b3JrQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbmNvbnN0IHJvYWQgPSBuZXcgUm9hZChjYXJDYW52YXMud2lkdGggLyAyLCBjYXJDYW52YXMud2lkdGggKiAwLjkpO1xyXG5cclxubGV0IG4gPSAxO1xyXG5sZXQgbXV0YXRlVmFsdWUgPSAwLjU7XHJcblxyXG5pZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NhcnMnKSkge1xyXG4gICAgY29uc3QgdmFsdWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2FycycpO1xyXG4gICAgbiA9IE51bWJlcihKU09OLnBhcnNlKHZhbHVlKSk7XHJcbn1cclxuXHJcbmlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZG5hJykpIHtcclxuICAgIGNvbnN0IHZhbHVlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2RuYScpO1xyXG4gICAgbXV0YXRlVmFsdWUgPSBOdW1iZXIoSlNPTi5wYXJzZSh2YWx1ZSkpO1xyXG59XHJcblxyXG5jYXJzU2VsZWN0LnZhbHVlID0gbi50b1N0cmluZygpO1xyXG5kbmFTZWxlY3QudmFsdWUgPSBtdXRhdGVWYWx1ZS50b1N0cmluZygpO1xyXG5cclxuY29uc3QgY2FycyA9IGdlbmVyYXRlQ2FycyhuKTtcclxubGV0IGJlc3RDYXIgPSBjYXJzWzBdO1xyXG5cclxuaWYgKCFsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYmVzdEJyYWluJykgJiYgIWxvY2FsU3RvcmFnZS5nZXRJdGVtKCdpbml0JykpIHtcclxuICAgIGNvbnN0IGRlZmF1bHRCZXN0QnJhaW4gPSBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgbGV2ZWxzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlucHV0czogWzAuNDEwMjk0NTI2NjU5NTQxOSwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgICAgICAgICBvdXRwdXRzOiBbMCwgMCwgMCwgMSwgMCwgMF0sXHJcbiAgICAgICAgICAgICAgICBiaWFzZXM6IFswLjE5NjI5MjIyMzE5NTk3MzQsIDAuNTM2NzA5OTAxODQ5Nzg3NiwgMC4xMDE3MjU4MzY3NDMxOTAxMywgLTAuMjY5MDg2MjU4NTk5Nzc0ODYsIDAuMzM5NDQ1NTkxODk3NjUzOCwgLTAuMDU3MTI4NDgzNjUzMzQ1NjZdLFxyXG4gICAgICAgICAgICAgICAgd2VpZ2h0czogW1xyXG4gICAgICAgICAgICAgICAgICAgIFswLjE3OTc0MDIxODYyMzU5OTY4LCAtMC4xMTEwMjUyMzQyOTc5MTg3NywgLTAuNTQyNjE1OTI0NzYwNTk1NywgLTAuMjQ1NjMxMTkyMjU1NzE4ODMsIC0wLjIwNDk1ODc0MDk0MTk2MDg3LCAtMC44MjYzODg0NTI3MTEwNDg4XSxcclxuICAgICAgICAgICAgICAgICAgICBbLTAuMzUwMzIzNzUwNzQyMDAxNiwgLTAuMDE5MTY1MjA0NzMzNTM0NjcsIC0wLjI5ODk4MTE3MjA1NjY3MzMsIC0wLjUyNzUxODc4NDM0ODI3MDMsIDAuNjQwNDM2MTg2NTQ2MTExLCAtMC4yNTc3NTM4MTQ5MTMwODc4XSxcclxuICAgICAgICAgICAgICAgICAgICBbLTAuMTYzMzM5OTQ2Mjg1MzYyNDEsIDAuMjAwNzYzNDE5NjM4MzQ0MSwgMC4wMDg5MDg2NzczMTgzMjMxMjIsIC0wLjQ1NTcyODgwOTMwNzAwMzc3LCAwLjYwNTY3NDg3ODU4MzY3ODUsIDAuMDQ1MDU4MzkwMTMwMzcxMzg0XSxcclxuICAgICAgICAgICAgICAgICAgICBbLTAuMjE4OTk3MjAxMTU5Njc5OSwgLTAuNzE0MzQzNjA4NTU5Njg5NywgMC43MTc0NjY5MzE3MjY1MTkyLCAwLjU3Mzk2Nzg1MDcxMTQ1OTIsIC0wLjAyODU3OTM0NTAwNDU5MTAyOCwgMC40MTIwOTYyNjk3NzI0Mzk5Nl0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMjI5OTIxNzkwMjE5NzAwMzgsIDAuMDAwODY5OTUyMzAwMTQ1NjM3NywgLTAuMTEzNjY1NTkzMTQyMTU1NTIsIDAuMTExMjUyMDcyNjg0MTE1MywgLTAuNTIwNTgzNDUyNDY5NzA0OCwgLTAuNTQ4NDYyMjc3MjI0NjUyNF0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbnB1dHM6IFswLCAwLCAwLCAxLCAwLCAwXSxcclxuICAgICAgICAgICAgICAgIG91dHB1dHM6IFsxLCAwLCAwLCAwXSxcclxuICAgICAgICAgICAgICAgIGJpYXNlczogWy0wLjI3ODY5NDYwNTU4NzE2MDg2LCAwLjMyOTM0MDc4MzA5NDk0OTEsIC0wLjc3MTIzMjI2NzExMDg1OTYsIDAuMDI5Mzg2MDk4NTY2NzUwNDVdLFxyXG4gICAgICAgICAgICAgICAgd2VpZ2h0czogW1xyXG4gICAgICAgICAgICAgICAgICAgIFswLjE1Nzg4NzAwMjUzMzQ5MDQyLCAtMC4zODA3MzQxMzQ2MjUyMTQ2NiwgLTAuMTI4NTA3NDI0OTA2MDk2OSwgMC4yMTcxOTkyMDk5MTg5ODI1Nl0sXHJcbiAgICAgICAgICAgICAgICAgICAgWy0wLjI3MDg4MzkyNTg4NDQ2Mjg2LCAwLjI5NTE5Mzc1MTg2MDQyMDIsIDAuMTU2NjQwMzc4MTcxMTQ2MywgLTAuMTE2OTMwNzk1MjE2MjQ1NV0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuNDA0NDI3MDc0MTkwNzE0OCwgMC40NjA2NjkyMTMzMDc1MDg3NiwgLTAuNDMzNjk4ODc4MDQyNDQ3MSwgLTAuNTkyNTYzMDg2NzY3MzQ0NF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMDY3ODQ3OTUwMTEwODg3NTEsIDAuMTExNjc5MzUyNjA1MDIyMTUsIC0wLjgyMTI1MzI1OTE3Mzc2MTYsIC0wLjQ4MDU5ODM3MDI4NDg4NjE3XSxcclxuICAgICAgICAgICAgICAgICAgICBbLTAuMDUzMTkyNDU5Mzk1NzE4OTMsIC0wLjQ5OTA0MDk1OTY2MTk1Mjk0LCAwLjIzMjY5NzIwMTgzMjYxMzIyLCAwLjM1MTA1NzQzMjcxMjE1ODA2XSxcclxuICAgICAgICAgICAgICAgICAgICBbLTAuMTAyNDAwNzczODAwNTg3ODcsIC0wLjU5NDY5NTE2OTA0NzAyOTUsIDAuMzA0NjE3MjkxODQwNjAxNCwgMC4yMzEyNjIwNzc3NTkzMzQ4M10sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIF0sXHJcbiAgICB9KTtcclxuXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYmVzdEJyYWluJywgZGVmYXVsdEJlc3RCcmFpbik7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnaW5pdCcsICdmYWxzZScpO1xyXG59XHJcblxyXG5pZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jlc3RCcmFpbicpKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjYXJzW2ldLmJyYWluID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYmVzdEJyYWluJykpO1xyXG5cclxuICAgICAgICBpZiAoaSAhPSAwKSB7XHJcbiAgICAgICAgICAgIE5ldXJhbE5ldHdvcmsubXV0YXRlKGNhcnNbaV0uYnJhaW4sIG11dGF0ZVZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHRyYWZmaWMgPSBbXHJcbiAgICBuZXcgQ2FyKHJvYWQuZ2V0TGFuZUNlbnRlcigxKSwgLTEwMCwgMzAsIDUwLCBDT05UUk9MLkRVTU1ZLCAyKSwgLy9cclxuICAgIG5ldyBDYXIocm9hZC5nZXRMYW5lQ2VudGVyKDApLCAtMzAwLCAzMCwgNTAsIENPTlRST0wuRFVNTVksIDIpLFxyXG4gICAgbmV3IENhcihyb2FkLmdldExhbmVDZW50ZXIoMiksIC0zMDAsIDMwLCA1MCwgQ09OVFJPTC5EVU1NWSwgMiksXHJcbiAgICBuZXcgQ2FyKHJvYWQuZ2V0TGFuZUNlbnRlcigwKSwgLTUwMCwgMzAsIDUwLCBDT05UUk9MLkRVTU1ZLCAyKSxcclxuICAgIG5ldyBDYXIocm9hZC5nZXRMYW5lQ2VudGVyKDEpLCAtNTAwLCAzMCwgNTAsIENPTlRST0wuRFVNTVksIDIpLFxyXG4gICAgbmV3IENhcihyb2FkLmdldExhbmVDZW50ZXIoMSksIC03MDAsIDMwLCA1MCwgQ09OVFJPTC5EVU1NWSwgMiksXHJcbiAgICBuZXcgQ2FyKHJvYWQuZ2V0TGFuZUNlbnRlcigyKSwgLTcwMCwgMzAsIDUwLCBDT05UUk9MLkRVTU1ZLCAyKSxcclxuXTtcclxuXHJcbmFuaW1hdGUoMCk7XHJcblxyXG5mdW5jdGlvbiBzYXZlKCkge1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Jlc3RCcmFpbicsIEpTT04uc3RyaW5naWZ5KGJlc3RDYXIuYnJhaW4pKTtcclxuICAgIGNvbnNvbGUubG9nKCdCcmFpbiBzYXZlZCEnKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlzY2FyZCgpIHtcclxuICAgIGNvbmZpcm0oJ1dhcm5pbmchIFlvdSBhcmUgYWJvdXQgdG8gZGVsZXRlIGN1cnJlbnQgYmVzdCBicmFpbi4gQWZ0ZXIgdGhpcyB5b3Ugd2lsbCBoYXZlIHRvIHRyYWluIHlvdXIgY2FyIGFnYWluLCBoYXZlIGZ1biEnKTtcclxuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdiZXN0QnJhaW4nKTtcclxuICAgIGNvbnNvbGUubG9nKCdCcmFpbiBkZWxldGVkIScpO1xyXG4gICAgbG9jYXRpb24ucmVsb2FkKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlQ2FycyhuOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGNhcnMgPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBuOyBpKyspIHtcclxuICAgICAgICBjYXJzLnB1c2gobmV3IENhcihyb2FkLmdldExhbmVDZW50ZXIoMSksIDEwMCwgMzAsIDUwLCBDT05UUk9MLkFJKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNhcnM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFuaW1hdGUodGltZTogbnVtYmVyKSB7XHJcbiAgICB0cmFmZmljLmZvckVhY2goKHRyYWZmaWNDYXIpID0+IHtcclxuICAgICAgICB0cmFmZmljQ2FyLnVwZGF0ZShyb2FkLmJvcmRlcnMsIFtdKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNhcnMuZm9yRWFjaCgoY2FyKSA9PiBjYXIudXBkYXRlKHJvYWQuYm9yZGVycywgdHJhZmZpYykpO1xyXG5cclxuICAgIGJlc3RDYXIgPSBjYXJzLmZpbmQoKGNhcikgPT4gY2FyLnkgPT09IE1hdGgubWluKC4uLmNhcnMubWFwKChjYXIpID0+IGNhci55KSkpO1xyXG5cclxuICAgIGNhckNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbiAgICBuZXR3b3JrQ2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHJcbiAgICBjYXJDdHguc2F2ZSgpO1xyXG4gICAgY2FyQ3R4LnRyYW5zbGF0ZSgwLCAtYmVzdENhci55ICsgY2FyQ2FudmFzLmhlaWdodCAqIDAuNyk7XHJcbiAgICByb2FkLmRyYXcoY2FyQ3R4KTtcclxuICAgIHRyYWZmaWMuZm9yRWFjaCgodHJhZmZpY0NhcikgPT4ge1xyXG4gICAgICAgIHRyYWZmaWNDYXIuZHJhdyhjYXJDdHgsICdyZWQnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNhckN0eC5nbG9iYWxBbHBoYSA9IDAuMjtcclxuICAgIGNhcnMuZm9yRWFjaCgoY2FyKSA9PiBjYXIuZHJhdyhjYXJDdHgsICdibHVlJykpO1xyXG4gICAgY2FyQ3R4Lmdsb2JhbEFscGhhID0gMTtcclxuICAgIGJlc3RDYXIuZHJhdyhjYXJDdHgsICdibHVlJywgdHJ1ZSk7XHJcblxyXG4gICAgY2FyQ3R4LnJlc3RvcmUoKTtcclxuXHJcbiAgICBuZXR3b3JrQ3R4LmxpbmVEYXNoT2Zmc2V0ID0gLXRpbWUgLyA1MDtcclxuICAgIFZpc3VhbGl6ZXIuZHJhd05ldHdvcmsobmV0d29ya0N0eCwgYmVzdENhci5icmFpbik7XHJcblxyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xyXG59XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==