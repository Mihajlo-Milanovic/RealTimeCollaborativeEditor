"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
var next_auth_1 = require("next-auth");
var authOptions_1 = require("../../../../../lib/authOptions");
var handler = (0, next_auth_1.default)(authOptions_1.authOptions);
exports.GET = handler;
exports.POST = handler;
