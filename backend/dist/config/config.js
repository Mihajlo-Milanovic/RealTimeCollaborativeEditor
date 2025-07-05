"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoURI = exports.port = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
exports.port = process.env.PORT || 5000;
exports.mongoURI = process.env.MONGO_URI || "";
