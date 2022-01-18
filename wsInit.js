"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onEventWS = exports.socketInstances = exports.io = void 0;
const socket_io_1 = require("socket.io");
const server_1 = require("./server");
exports.io = new socket_io_1.Server(server_1.httpServer);
exports.io.on("connection", (socket) => {
    exports.socketInstances[socket.id] = socket;
    socket.onAny(event => {
        (0, exports.onEventWS)(event, socket);
    });
    console.log("socket connected " + socket.id);
});
exports.socketInstances = {};
const onEventWS = (events, socket) => {
    console.log("ini event: " + events);
    console.log(socket);
};
exports.onEventWS = onEventWS;
