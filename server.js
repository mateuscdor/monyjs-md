"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
// import { client } from "./module/db";
const route_1 = __importDefault(require("./route"));
const app = (0, express_1.default)();
const port = 3000;
const httpServer = (0, http_1.createServer)(app);
exports.httpServer = httpServer;
// client.connect().then(() => console.log("db connected"))
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(route_1.default);
app.use(express_1.default.static('static'));
httpServer.listen(port, () => {
    console.log(`server online, port: ${port}`);
});
