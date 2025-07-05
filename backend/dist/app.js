"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = require("./middlewares/logger");
const errorHandler_1 = require("./middlewares/errorHandler");
const userRoutes_1 = require("./routes/userRoutes");
const config_1 = require("./config/config");
const db_1 = require("./config/db");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(logger_1.logger);
app.use(errorHandler_1.errorHandler);
app.use("/user", userRoutes_1.userRouter);
app.get('/', (req, res) => {
    res.send('Collaborative Editor Backend is running');
});
(async () => {
    await (0, db_1.connectDB)();
    app.listen(config_1.port, () => {
        console.log(`Server running on http://localhost:${config_1.port}`);
    });
})();
