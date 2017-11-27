/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

let utils = {
  PROJECTOR: {
    cameraPosition: {
      x: 0,
      y: -100,
      z: -400
    },
    cameraOrientation: {
      x: -Math.PI / 4,
      y: 0,
      z: 0
    },

    canvas: {
      width: null,
      height: null
    },

    viewerPosition: {
      x: 0,
      y: 0,
      z: 500
    },

    eye2plane: 600,

    setCanvas: (canvas) => {
      utils.PROJECTOR.canvas = canvas;
      utils.PROJECTOR.viewerPosition.x = -canvas.width *0.5;
      utils.PROJECTOR.viewerPosition.y = -canvas.width * 0.4;
    },

    get2d: (x, y, z) => {

      // let scale = utils.PROJECTOR.eye2plane / (utils.PROJECTOR.eye2plane + z);
      let cx = Math.cos(utils.PROJECTOR.cameraOrientation.x);
      let sx = Math.sin(utils.PROJECTOR.cameraOrientation.x);
      let cy = Math.cos(utils.PROJECTOR.cameraOrientation.y);
      let sy = Math.sin(utils.PROJECTOR.cameraOrientation.y);
      let cz = Math.cos(utils.PROJECTOR.cameraOrientation.z);
      let sz = Math.sin(utils.PROJECTOR.cameraOrientation.z);

      let X = (x - utils.PROJECTOR.cameraPosition.x);
      let Y = (y - utils.PROJECTOR.cameraPosition.y);
      let Z = (z - utils.PROJECTOR.cameraPosition.z);

      let xWithRespectToCam = cy * (sz * Y + cz * X) - sy * Z;
      let yWithRespectToCam = sx * (cy * Z + sy * (sz * Y + cz * X)) + cx * (cz * Y - sz * X);
      let zWithRespectToCam = cx * (cy * Z + sy * (sz * Y + cz * X)) - sx * (cz * Y - sz * X);

      let zWithRespectToCamInverse = 1 / zWithRespectToCam;

      let x2d = xWithRespectToCam * (zWithRespectToCamInverse) * utils.PROJECTOR.viewerPosition.z - utils.PROJECTOR.viewerPosition.x;

      let y2d = yWithRespectToCam * zWithRespectToCamInverse * utils.PROJECTOR.viewerPosition.z - utils.PROJECTOR.viewerPosition.y;

      return {
        x2d: x2d,
        y2d: y2d
      };

    },

    get2dLength: (l, z) => {
      let scale = utils.PROJECTOR.eye2plane / (utils.PROJECTOR.eye2plane + z);

      return l * scale;
    },

    get3d: (x2d, y2d) => {

      let cx = Math.cos(utils.PROJECTOR.cameraOrientation.x);
      let sx = Math.sin(utils.PROJECTOR.cameraOrientation.x);
      let cy = Math.cos(utils.PROJECTOR.cameraOrientation.y);
      let sy = Math.sin(utils.PROJECTOR.cameraOrientation.y);
      let cz = Math.cos(utils.PROJECTOR.cameraOrientation.z);
      let sz = Math.sin(utils.PROJECTOR.cameraOrientation.z);

      let y =   utils.BAT_Y_POSITION;


      let Y = (y - utils.PROJECTOR.cameraPosition.y);

      let numeratorZ = Y * -1 * (utils.PROJECTOR.viewerPosition.z * cx * cz + y2d * sx * cz + utils.PROJECTOR.viewerPosition.y * sx * cz)
      let denumeratorZ = cy * (utils.PROJECTOR.viewerPosition.z * sx - y2d * cx - utils.PROJECTOR.viewerPosition.y * cx)
      let Z = numeratorZ / denumeratorZ;


      let numeratorX = (x2d + utils.PROJECTOR.viewerPosition.x) * (cx * cy * Z - sx * cz * Y);
      let denumeratorX = utils.PROJECTOR.viewerPosition.z * cy * cz;

      let X = numeratorX / denumeratorX;

      let x = X + utils.PROJECTOR.cameraPosition.x;
      let z = Z + utils.PROJECTOR.cameraPosition.z;
      return {
        x: Math.floor(x),
        y: Math.floor(y),
        z: Math.floor(z)
      };

    },

  },

  BAT_Y_POSITION: 150,

}

module.exports = utils;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "draw", function() { return draw; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Board_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Ball_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Bat_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Game_js__ = __webpack_require__(5);




const utils = __webpack_require__(0)


let game = new __WEBPACK_IMPORTED_MODULE_3__Game_js__["a" /* Game */]();
// game.init();
let draw = () => {
  if (game.hasServed) game.timer++;
  game.drawBackground();
  game.drawScore();
  game.board.drawBoard();
  if (game.ball.y < game.board.y) game.ball.dy += game.gravity * game.timer;
  // else game.ball.dy = 0;
  game.ball.updatePosition();

  if(game.ball.z > -200) game.ball.draw();

  game.bat.drawBat(game.hasServed);

  if (game.ball.z > game.board.length/2) {
    game.opponentBat.x = game.ball.x;
    if (game.ball.opponentBounceCount > 0) {
      game.opponentBat.z = game.ball.z;

      console.log("gt0",game.opponentBat.dz);
    if (Math.abs(game.opponentBat.dz) > Math.abs(game.ball.dz * 1.2)) {
      game.ball.reflect(game.ball.dz * -1.1);

      console.log(game.opponentBat.dz);
    }else {
      game.ball.reflect(game.ball.dz * 1.1);
      // game.ball.reflect(game.opponentBat.dz);
      console.log("lt0",game.opponentBat.dz);

    }
  }
    // game.ball.opponentBounceCount = 0;
    // game.ball.bounceCount = 0;
    // if (game.ball.z >= game.board.length) {
    //   game.opponentBat.y = game.ball.y;
    // }
  }
  // game.opponentBat.y = game.ball.y;
  game.opponentBat.drawBat(game.hasServed);

  if (!game.hasServed) game.ball.x = game.bat.x
  if (!game.hasServed && game.bat.dz > 0 && game.bat.z > game.ball.z) game.serve();
  if (game.hasServed && game.ball.bounceCount != 0 && game.ball.z < game.bat.z && game.ball.x > game.bat.x - game.bat.r && game.ball.x < game.bat.x + game.bat.r && game.ball.y > game.bat.y - game.bat.r ) {
    console.log("reflected");
    game.ball.bounceCount = 0;
    game.ball.opponentBounceCount = 0;
    game.ball.reflect(game.ball.dz * -1);
    // game.ball.z = 10;
  }
  if (game.ball.bounceCount >= 5) {
    game.ball.bounceCount = 0;
    game.ball.opponentBounceCount = 0;
    game.removePoint();
    game.anotherBall();
  } else if (game.ball.opponentBounceCount > 5) {
    game.ball.bounceCount = 0;
    game.ball.opponentBounceCount = 0;
    game.awardPoint();
    game.anotherBall();
  }{

  }

  if (game.score == -10) {
    game.over();
  } else {

    game.animationLoop = window.requestAnimationFrame(draw);
  }
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const utils = __webpack_require__(0);

class Board {
  constructor(canvas, ctx) {

    this.canvas = canvas;
    this.ctx = ctx;

    this.x = 0;
    this.y = 300;
    this.z = 0;

    //Dimensions of the board
    this.width = this.canvas.width / 2 * 0.63; //xMax
    this.thickness = 10 / 400 * this.canvas.width / 2; //yMax
    this.length = 720 / 400 * this.canvas.width / 2; //zMax

    this.netHeight = this.y - 55 / 400 * this.width;
    this.netPosition = this.length / 2;
    this.netHeight = his.y - this.length / 4
    this.borderWidth = 10 / 400 * this.width;

    this.frontLeftPoint2d = utils.PROJECTOR.get2d(this.x - this.width, this.y, this.z);
    this.frontRightPoint2d = utils.PROJECTOR.get2d(this.x + this.width, this.y, this.z);
    this.backRightPoint2d = utils.PROJECTOR.get2d(this.x + this.width, this.y, this.z + this.length);
    this.backLeftPoint2d = utils.PROJECTOR.get2d(this.x - this.width, this.y, this.z + this.length);
    this.frontLeftoint2d = utils.PROJECTOR.get2d(this.x - this.width, this.y, this.z);
    this.frontLeftBottomPoint2d = utils.PROJECTOR.get2d(this.x - this.width, this.y + this.thickness, this.z);
    this.frontRightBottomPoint2d = utils.PROJECTOR.get2d(this.x + this.width, this.y + this.thickness, this.z);
    this.frontRightTopPoint2d = utils.PROJECTOR.get2d(this.x + this.width, this.y, this.z);

    this.middleRightPoint2d = utils.PROJECTOR.get2d(this.x + this.width, this.y, this.z + this.netPosition);
    this.middleRightTopPoint2d = utils.PROJECTOR.get2d(this.x + this.width, this.netHeight, this.z + this.netPosition);
    this.middleLeftPoint2d = utils.PROJECTOR.get2d(this.x - this.width, this.y, this.z + this.netPosition);
    this.middleLeftTopPoint2d = utils.PROJECTOR.get2d(this.x - this.width, this.netHeight, this.z + this.netPosition);

    this.singlePlayerMiddleRightPoint2d = utils.PROJECTOR.get2d(this.x + this.width, this.y, this.z + this.netPosition);
    this.singlePlayerMiddleRightTopPoint2d = utils.PROJECTOR.get2d(this.x + this.width, this.netHeight, this.z + this.netPosition);
    this.singlePlayerMiddleLeftPoint2d = utils.PROJECTOR.get2d(this.x - this.width, this.y, this.z + this.netPosition);
    this.singlePlayerMiddleLeftTopPoint2d = utils.PROJECTOR.get2d(this.x - this.width, this.netHeight, this.z + this.netPosition);

    this.innerSurfaceFrontLeftPoint2d = utils.PROJECTOR.get2d(this.x - this.width + this.borderWidth, this.y, this.z + this.borderWidth);
    this.innerSurfaceFrontRightPoint2d = utils.PROJECTOR.get2d(this.x + this.width - this.borderWidth, this.y, this.z + this.borderWidth);
    this.innerSurfaceBackRightPoint2d = utils.PROJECTOR.get2d(this.x + this.width - this.borderWidth, this.y, this.z + this.length - this.borderWidth);
    this.innerSurfaceBackLeftPoint2d = utils.PROJECTOR.get2d(this.x - this.width + this.borderWidth, this.y, this.z + this.length - this.borderWidth);
    this.innerSurfaceFrontLeftoint2d = utils.PROJECTOR.get2d(this.x - this.width + this.borderWidth, this.y, this.z + this.borderWidth);


    this.centerBorderFrontLeftPoint2d = utils.PROJECTOR.get2d(this.x - 5 / 400 * this.width, this.y, this.z);
    this.centerBorderFrontRightPoint2d = utils.PROJECTOR.get2d(this.x + 5 / 400 * this.width, this.y, this.z);
    this.centerBorderBackLeftPoint2d = utils.PROJECTOR.get2d(this.x - 5 / 400 * this.width, this.y, this.z + this.length);
    this.centerBorderBackRightPoint2d = utils.PROJECTOR.get2d(this.x + 5 / 400 * this.width, this.y, this.z + this.length);

    this.netSquare = new Image();
    this.netSquare.src = 'images/netSquare.png';
    this.netSquare.onload = () => {
      this.netPattern = this.ctx.createPattern(this.netSquare, 'repeat');
      this.ctx.fillStyle = this.netPattern;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }


    this.drawBoard();
  }
  drawBoard(isSingle) {

    //outer white surface drawing
    this.ctx.beginPath();
    //outer white surface path
    this.makeOuterWhiteSurface();
    this.ctx.stroke();
    this.ctx.fillStyle = "white";
    this.ctx.fill();
    this.ctx.closePath();
    //inner surface drawing
    this.ctx.beginPath();
    //inner surface path
    this.makeInnerSurface();
    this.ctx.stroke();
    this.ctx.fillStyle = "#24529b";
    this.ctx.fill();
    this.ctx.closePath();

    //center border drawing
    this.ctx.beginPath();
    //center border path
    this.makeCenterBorder();
    this.ctx.fillStyle = "white";
    this.ctx.fill();
    this.ctx.closePath();

    //board-thickness drawing
    this.ctx.beginPath();
    //board-thickness path
    this.makeBoardThickness();
    this.ctx.stroke();
    this.ctx.fillStyle = "#122c5f";
    this.ctx.fill();
    this.ctx.closePath();
    // this.ctx.arc(utils.PROJECTOR.get2d(this.x, this.y, this.z).x2d, utils.PROJECTOR.get2d(this.x, this.y, this.z).y2d, 10, 0, 2 * Math.PI);
    // this.ctx.fillStyle = "red";
    //net drawing
    this.ctx.beginPath();
    //net path
    this.makeNet();
    this.ctx.fillStyle = this.netPattern;
    this.ctx.fill();
    this.ctx.closePath();

    // if (isSingle) {
    //   this.ctx.beginPath();
    //   this.makeOtherHalfVertical();
    //   this.ctx.stroke();
    //   this.ctx.fillStyle = "#24529b"
    //   this.ctx.fill();
    //   this.ctx.closePath();
    // }
    // this.ctx.fill();
  }
  makeOuterWhiteSurface() {
    this.ctx.moveTo(this.frontLeftPoint2d.x2d, this.frontLeftPoint2d.y2d);
    this.ctx.lineTo(this.frontRightPoint2d.x2d, this.frontRightPoint2d.y2d);
    this.ctx.lineTo(this.backRightPoint2d.x2d, this.backRightPoint2d.y2d);
    this.ctx.lineTo(this.backLeftPoint2d.x2d, this.backLeftPoint2d.y2d);
    this.ctx.lineTo(this.frontLeftoint2d.x2d, this.frontLeftoint2d.y2d);
  }
  makeNet() {
    this.ctx.moveTo(this.middleLeftTopPoint2d.x2d, this.middleLeftTopPoint2d.y2d)
    this.ctx.lineTo(this.middleRightTopPoint2d.x2d, this.middleRightTopPoint2d.y2d)
    this.ctx.lineTo(this.middleRightTopPoint2d.x2d, this.middleRightPoint2d.y2d)
    this.ctx.lineTo(this.middleLeftTopPoint2d.x2d, this.middleLeftPoint2d.y2d)
  }
  makeInnerSurface() {
    //front-left point
    this.ctx.moveTo(this.innerSurfaceFrontLeftPoint2d.x2d, this.innerSurfaceFrontLeftPoint2d.y2d);
    //front-right point
    this.ctx.lineTo(this.innerSurfaceFrontRightPoint2d.x2d, this.innerSurfaceFrontRightPoint2d.y2d);

    //back-right point
    this.ctx.lineTo(this.innerSurfaceBackRightPoint2d.x2d, this.innerSurfaceBackRightPoint2d.y2d);

    //back-left point
    this.ctx.lineTo(this.innerSurfaceBackLeftPoint2d.x2d, this.innerSurfaceBackLeftPoint2d.y2d);

    //front-left point
    this.ctx.lineTo(this.innerSurfaceFrontLeftoint2d.x2d, this.innerSurfaceFrontLeftoint2d.y2d);

  }
  makeCenterBorder() {

    this.ctx.moveTo(this.centerBorderFrontLeftPoint2d.x2d, this.centerBorderFrontLeftPoint2d.y2d)
    this.ctx.lineTo(this.centerBorderFrontRightPoint2d.x2d, this.centerBorderFrontRightPoint2d.y2d)
    this.ctx.lineTo(this.centerBorderBackRightPoint2d.x2d, this.centerBorderBackRightPoint2d.y2d)
    this.ctx.lineTo(this.centerBorderBackLeftPoint2d.x2d, this.centerBorderBackLeftPoint2d.y2d)

  }
  makeBoardThickness() {

    this.ctx.moveTo(this.frontLeftPoint2d.x2d, this.frontLeftPoint2d.y2d);
    //front-left-bottom point
    this.ctx.lineTo(this.frontLeftBottomPoint2d.x2d, this.frontLeftBottomPoint2d.y2d);
    //front-right-bottom point
    this.ctx.lineTo(this.frontRightBottomPoint2d.x2d, this.frontRightBottomPoint2d.y2d);
    //front-right-top point
    this.ctx.lineTo(this.frontRightTopPoint2d.x2d, this.frontRightTopPoint2d.y2d);
  }
  makeOtherHalfVertical() {
    this.ctx.moveTo(this.singlePlayerMiddleLeftPoint2d.x2d, this.singlePlayerMiddleLeftPoint2d.y2d)
    this.ctx.lineTo(this.singlePlayerMiddleRightPoint2d.x2d, this.singlePlayerMiddleRightPoint2d.y2d)
    this.ctx.lineTo(this.singlePlayerMiddleRightPoint2d.x2d, this.singlePlayerMiddleRightTopPoint2d.y2d)
    this.ctx.lineTo(this.singlePlayerMiddleLeftPoint2d.x2d, this.singlePlayerMiddleLeftTopPoint2d.y2d)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Board;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const utils = __webpack_require__(0)

class Ball {
  constructor(ctx, board, x, y, z) {

    this.ctx = ctx;
    this.board = board;
    this.x = x;
    this.y = y;
    this.z = z;

    this.r = 10 / 400 * this.board.width;
    // this.dx = 1 / 400 * this.board.width;
    // this.dy = 3 / 400 * this.board.width;
    // this.dz = 5 / 400 * this.board.width;

    this.dx = 0;
    this.dy = 0;
    this.dz = 0;

    this.maxY = this.board.y;

    this.shadowY = this.board.y;
    this.bounceCount = 0;
    this.opponentBounceCount = 0;

  }

  draw() {

    if (this.z < 0) this.shadowY = 600;
    else this.shadowY = this.board.y;

    this.center2d = utils.PROJECTOR.get2d(this.x, this.y, this.z);
    this.shadow = utils.PROJECTOR.get2d(this.x, this.maxY, this.z);
    let radius2d = utils.PROJECTOR.get2dLength(this.r, this.z);
    //shadow
    this.ctx.beginPath();
    this.ctx.arc(this.shadow.x2d, this.shadow.y2d, radius2d, 0, Math.PI * 2);
    this.ctx.fillStyle = "rgba(68,68,68,0.5)";
    this.ctx.fill();
    this.ctx.closePath();

    //ball
    this.ctx.beginPath();
    this.ctx.arc(this.center2d.x2d, this.center2d.y2d, radius2d, 0, Math.PI * 2);
    this.ctx.fillStyle = "#f4d443";
    this.ctx.fill();
    this.strokeStyle = "#837d66";
    // this.ctx.stroke();
    this.ctx.closePath();
  }

  reflect(dzOther) {
    this.dz = dzOther;
    this.maxY = this.board.y;
  }
  bounce() {
    this.dy = -this.dy;

    console.log(this.bounceCount,this.opponentBounceCount);
  }
  sideCheck() {
    this.dx = -this.dx;

  }

  fall(){
    this.maxY = 500;
  }
  rise(){
    this.maxY = this.board.y - this.r;
  }

  updatePosition() {

    this.x += this.dx;
    this.y += this.dy;
    this.z += this.dz;

    // if (this.x > this.board.x + this.board.width - this.r) {
      // this.sideCheck();
    // }
    // if (this.x < this.board.x - this.board.width - this.r) {
    //   this.sideCheck();
    // }
    if (this.z == this.board.netPosition && this.x > -this.board.width && this.x < this.board.width && this.y < this.board.y && this.y > this.board.netHeight ) {
      this.reflect(-this.dz)
    }

    if (this.y > this.maxY - this.r) {
      if (this.z <this.board.netPosition) {
        this.bounceCount++;
      }
      if (this.z >this.board.netPosition) {
        this.opponentBounceCount++;
      }
      this.bounce();
    }

    if (this.z < this.board.z || this.z > this.board.z + this.board.length || this.x < -this.board.width || this.x > this.board.width) {
      this.fall();
    }else {
      this.rise();
    }



    // if (this.z < -100) this.reflect();
    // if (this.z > this.board.length) {
    //   this.bounceCount = 0;
    //   console.log("board oppo");
    //   this.reflect(this.dz * 1.25);
    // }
  }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Ball;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const utils = __webpack_require__(0)
class Bat {
  constructor(canvas, ctx, board) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.board = board;
    this.x = 0;
    this.y = this.board.y - 150;
    this.z = -10;
    this.r = 5 * 10 / 400 * this.board.width;

    this.lastX = 0
    this.lastZ = 0;
    this.dx = 0;
    this.dz = 0;
    this.mouseX = 0;
    this.mouseY = 0;

    this.isOpponent= false;

  }
  drawBat(hasServed) {


    if(this.isOpponent && this.x < this.board.x - this.board.width) this.x = this.board.x - this.board.width
    if(this.isOpponent && this.x > this.board.x + this.board.width) this.x = this.board.x + this.board.width
    // if (this.z < -25) this.z = -25;
    if (!this.isOpponent && this.z > this.board.length/2) this.z = this.board.length/2;
    this.point2d = utils.PROJECTOR.get2d(this.x, this.y, this.z);
    this.dx = this.x - this.lastX;
    this.dz = this.z - this.lastZ;

    // this.ctx.save();
    // this.ctx.translate(this.point2d.x2d,this.point2d.y2d)
    // this.ctx.rotate(Math.PI);

    this.ctx.beginPath();
    // this.makeBatShadow();
    this.makeBatPaddle(hasServed);
    this.ctx.closePath();
    this.lastX = this.x;
    this.lastZ = this.z;
    // console.log(this.dz);
    // this.ctx.rotate(-Math.PI/2);
    // this.ctx.translate(-this.point2d.x2d,-this.point2d.y2d)
    this.ctx.restore();
  }
  makeBatShadow(){

  }
  makeBatPaddle(hasServed) {
    this.ctx.arc(this.point2d.x2d, this.point2d.y2d,Math.abs(utils.PROJECTOR.get2dLength( this.r,this.z)), Math.PI / 2, Math.PI * 2);
    // this.ctx.fillStyle = "#9c0710";
    if (hasServed) {
      this.ctx.fillStyle = "rgba(156,7,16,1)";
    }
    else {
      this.ctx.fillStyle = "rgba(156,7,16,0.5)";
    }
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.beginPath();
    this.ctx.moveTo(this.point2d.x2d +utils.PROJECTOR.get2dLength(  this.r,this.z), this.point2d.y2d);
    this.ctx.lineTo(this.point2d.x2d + utils.PROJECTOR.get2dLength( this.r,this.z), this.point2d.y2d + utils.PROJECTOR.get2dLength( 0.7 * this.r,this.z));
    this.ctx.lineTo(this.point2d.x2d + utils.PROJECTOR.get2dLength( this.r + 0.4 * this.r,this.z), this.point2d.y2d +utils.PROJECTOR.get2dLength(  0.7 * this.r + 0.4 * this.r,this.z))
    this.ctx.lineTo(this.point2d.x2d + utils.PROJECTOR.get2dLength( 0.7 * this.r + 0.4 * this.r,this.z), this.point2d.y2d + utils.PROJECTOR.get2dLength( this.r + 0.4 * this.r,this.z))
    this.ctx.lineTo(this.point2d.x2d + utils.PROJECTOR.get2dLength( 0.7 * this.r,this.z), this.point2d.y2d +utils.PROJECTOR.get2dLength(  this.r,this.z))
    this.ctx.lineTo(this.point2d.x2d, this.point2d.y2d + utils.PROJECTOR.get2dLength( this.r,this.z))
    // this.ctx.fillStyle = "#aa9f7f";
    this.ctx.fillStyle = "rgba(170,159,127,1)";
    this.ctx.fill();

  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Bat;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Board_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Ball_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Bat_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_app_js__ = __webpack_require__(1);




const utils = __webpack_require__(0)

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    // this.canvas.style.border = "#000 1px solid"
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 4;
    utils.PROJECTOR.setCanvas(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);


    this.bgImg = new Image();
    this.bgImg.src = "images/bg1.png";
    this.bgImg.onload = () => {
      this.bgPattern = this.ctx.createPattern(this.bgImg, 'repeat');
      this.ctx.fillStyle = this.bgPattern;
    }
    this.bgRadius = Math.floor(this.canvas.width * 1.2);
    this.bgCenter = {
      x: this.canvas.width / 2,
      y: this.canvas.width * 1.4
      // y: this.canvas.height * 2.8

    }
    this.bgGradient = this.ctx.createRadialGradient(this.bgCenter.x, this.bgCenter.y, this.bgRadius, this.bgCenter.x, this.bgCenter.y, this.bgRadius - 100);
    this.bgGradient.addColorStop(0, '#465069');
    this.bgGradient.addColorStop(1, '#78909c');

    this.gravity = 0.006;
    this.isStarted = false;
    this.hasServed = false;

    this.startButton = {
      x: 1.5 * this.canvas.width / 4,
      y: this.canvas.height / 2,
      width: this.canvas.width / 4,
      height: this.canvas.width / 8,
      text: "Start Game",
    };
    this.restartButton = {
      x: 1.5 * this.canvas.width / 4,
      y: this.canvas.height / 2,
      width: this.canvas.width / 4,
      height: this.canvas.width / 8,
      text: "Play Again",
    };

    this.button = this.startButton;
    this.drawButton();
    console.log(this.button);
    this.canvas.addEventListener('click', (e) => {
      this.handleClick(e)
    }, false);
  }

  init() {
    window.cancelAnimationFrame(this.animationLoop);
    this.board = new __WEBPACK_IMPORTED_MODULE_0__Board_js__["a" /* Board */](this.canvas, this.ctx);
    this.bat = new __WEBPACK_IMPORTED_MODULE_2__Bat_js__["a" /* Bat */](this.canvas, this.ctx, this.board);
    this.opponentBat = new __WEBPACK_IMPORTED_MODULE_2__Bat_js__["a" /* Bat */](this.canvas, this.ctx, this.board);
    this.opponentBat.z = this.board.length;
    this.opponentBat.isOpponent = true;
    this.ball = new __WEBPACK_IMPORTED_MODULE_1__Ball_js__["a" /* Ball */](this.ctx, this.board, this.bat.x, utils.BAT_Y_POSITION, 10);
    this.timer = 0;
    this.playerScore = 0;
    this.opponentScore = 0;
    this.canvas.style.cursor = 'none';
    this.canvas.removeEventListener('click', (e) => {
      this.handleClick(e)
    }, false);

    this.canvas.addEventListener("mouseover", (evt) => {
      this.bat.point3d = utils.PROJECTOR.get3d(evt.clientX, evt.clientY);
      this.bat.x = this.bat.point3d.x;
      this.bat.y = this.bat.point3d.y;
      this.bat.z = this.bat.point3d.z;

      this.bat.lastX = this.bat.point3d.x;
      this.bat.lastZ = this.bat.point3d.z;
    }, false);

    this.canvas.addEventListener('mousemove', (evt) => {
      evt.preventDefault();
      this.bat.point3d = utils.PROJECTOR.get3d(evt.clientX, evt.clientY);
      this.bat.x = this.bat.point3d.x;
      this.bat.y = this.bat.point3d.y;
      this.bat.z = this.bat.point3d.z;

    }, false)

    this.canvas.addEventListener('touchmove', (evt) => {
      evt.preventDefault();
      let touch = evt.touches[0];
      this.bat.point3d = utils.PROJECTOR.get3d(touch.pageX, touch.pageY);
      this.bat.x = this.bat.point3d.x;
      this.bat.y = this.bat.point3d.y;
      this.bat.z = this.bat.point3d.z;
    }, false)
    this.isStarted = true;
    this.animationLoop = window.requestAnimationFrame(__WEBPACK_IMPORTED_MODULE_3__src_app_js__["draw"])
  }
  drawButton() {
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(this.button.x, this.button.y, this.button.width, this.button.height);
    this.ctx.fillStyle = "white";
    this.ctx.font = "30px Arial";
    this.ctx.fillText(this.button.text, this.button.x + 20, this.button.y + 50);
  }
  handleClick(evt) {
    if (evt.clientX > this.button.x && evt.clientX < this.button.x + this.button.width && evt.clientY > this.button.y && evt.clientY < this.button.y + this.button.height) {
      this.init();
    }
  }
  serve() {
    this.ball.dx = 0.2 * this.bat.dx
    this.ball.dz = 0.2 * this.bat.dz;
    this.hasServed = true;
    this.timer = 0;
  }
  awardPoint() {
    this.playerScore++;
    this.hasServed = false;

  }
  removePoint() {
    this.opponentScore++;
    this.hasServed = false;
  }

  anotherBall() {
    this.ball = null;

    this.ball = new __WEBPACK_IMPORTED_MODULE_1__Ball_js__["a" /* Ball */](this.ctx, this.board, this.bat.x, utils.BAT_Y_POSITION, 5);
    this.timer = 0;

    this.opponentBat.z = this.board.length;
  }
  drawBackground() {

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.beginPath();
    this.ctx.arc(this.bgCenter.x, this.bgCenter.y, this.bgRadius, -Math.PI, 0);

    this.ctx.fillStyle = this.bgGradient;
    // ctx.fillRect(0, 0, 200, 200);
    // this.ctx.fillStyle = "#aa9f7f";
    this.ctx.fill();
    this.ctx.closePath();

  }


  drawScore() {
    this.ctx.fillStyle = "#fff";
    this.ctx.strokeStyle = "#000";
    this.ctx.font = "30px Arial";
    this.ctx.fillText("Your Score: " + this.playerScore, 30, 30);
    this.ctx.fillStyle = "#f99";
    this.ctx.fillText("Opponent's Score: " + this.opponentScore, this.canvas.width - 500, 30);

  }

  over() {

    this.board = null;
    this.bat = null;
    this.ball = null;
    this.point = 0;
    this.canvas.style.cursor = "auto";
    this.canvas.removeEventListener("mouseover", (evt) => {
      this.bat.point3d = utils.PROJECTOR.get3d(evt.clientX, evt.clientY);
      this.bat.x = this.bat.point3d.x;
      this.bat.y = this.bat.point3d.y;
      this.bat.z = this.bat.point3d.z;

      this.bat.lastX = this.bat.point3d.x;
      this.bat.lastZ = this.bat.point3d.z;
    }, false);

    this.canvas.removeEventListener('mousemove', (evt) => {
      evt.preventDefault();
      this.bat.point3d = utils.PROJECTOR.get3d(evt.clientX, evt.clientY);
      this.bat.x = this.bat.point3d.x;
      this.bat.y = this.bat.point3d.y;
      this.bat.z = this.bat.point3d.z;

    }, false)


    this.canvas.removeEventListener('touchmove', (evt) => {
      evt.preventDefault();
      let touch = evt.touches[0];
      this.bat.point3d = utils.PROJECTOR.get3d(touch.pageX, touch.pageY);
      this.bat.x = this.bat.point3d.x;
      this.bat.y = this.bat.point3d.y;
      this.bat.z = this.bat.point3d.z;
    }, false)

    this.button = this.restartButton;
    // this.canvas.addEventListener('click', (e) => {
    //   this.handleClick(e)
    // }, false);
    this.drawButton();
    this.hasServed=false;
    this.isStarted = false;
    window.cancelAnimationFrame(this.animationLoop);
  }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Game;



/***/ })
/******/ ]);