"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onEventWS = exports.socketInstances = void 0;
exports.socketInstances = {};
const onEventWS = (events, socket) => {
    console.log("ini event: " + events);
    console.log(socket);
};
exports.onEventWS = onEventWS;
