"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idBotRequired = exports.botInitializerGuard = exports.apiGuards = void 0;
const bot_1 = require("../bot");
const apiGuards = (req, res, next) => {
    if (typeof req.headers.authorization === "undefined" || req.headers.authorization !== process.env.API_KEY) {
        return res.status(401).json({
            "Error": "Not Authorized",
            "Time": new Date()
        });
    }
    if (typeof req.body.number === "undefined") {
        return res.status(401).json({
            "Error": "Number Required",
            "Time": new Date()
        });
    }
    if (typeof bot_1.botArray[req.body.bot_id] === "undefined") {
        return res.status(400).json({
            "Error": "Bot not found",
            "Time": new Date()
        });
    }
    next();
};
exports.apiGuards = apiGuards;
const botInitializerGuard = (req, res, next) => {
    if (typeof req.body.authorization === "undefined" || typeof req.body.ws_id === "undefined" || req.body.authorization !== process.env.AUTHENTICATE_KEY) {
        return res.status(401).json({
            "Error": "Not Authorized",
            "Time": new Date()
        });
    }
    next();
};
exports.botInitializerGuard = botInitializerGuard;
const idBotRequired = (req, res, next) => {
    if (typeof req.body.bot_id === "undefined") {
        return res.status(400).json({
            "Error": "ID required",
            "Time": new Date()
        });
    }
    next();
};
exports.idBotRequired = idBotRequired;
