(function(e, a) { for(var i in a) e[i] = a[i]; }(this, /******/ (function(modules) { // webpackBootstrap
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
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/src/index.js":
/*!*************************!*\
  !*** ./js/src/index.js ***!
  \*************************/
/*! exports provided: copyEmail, initMaterialize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"copyEmail\", function() { return copyEmail; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initMaterialize\", function() { return initMaterialize; });\n\r\nfunction copyEmail(id){\r\n    let emailAddr = document.getElementById(id);\r\n    emailAddr.disabled = false;\r\n    emailAddr.focus();\r\n    emailAddr.select();\r\n    try{\r\n        document.execCommand('copy');\r\n        M.toast({html: \"Copied to clipboard\"});\r\n    } catch (err){\r\n        console.log(\"Error copying to clipboard: \" + err);\r\n    } finally {\r\n        emailAddr.disabled = true;\r\n    }\r\n}\r\n\r\nfunction initMaterialize(){\r\n    M.Slider.init(document.querySelector('.slider'), {\r\n        height: 400,\r\n        full_width: true,\r\n        indicators: true,\r\n        interval: 12000});\r\n    M.Pushpin.init(document.querySelector('#toc'), {\r\n        top: 750,\r\n        offset: 64\r\n    });\r\n    M.Materialbox.init(document.querySelectorAll('.materialboxed'));\r\n    M.ScrollSpy.init(document.querySelectorAll('.scrollspy'));\r\n    M.Modal.init(document.querySelectorAll('.modal'));\r\n    M.FormSelect.init(document.querySelector('select'));\r\n    M.Carousel.init(document.querySelector('.carousel'), {numVisible: 6, fullWidth: true, indicators: true});\r\n    return true;\r\n}\r\n\n\n//# sourceURL=webpack:///./js/src/index.js?");

/***/ })

/******/ })));