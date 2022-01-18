"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const bot_1 = require("./bot");
const authenticate_1 = require("./middleware/authenticate");
const db_1 = require("./module/db");
const route = (0, express_1.Router)();
route.get('/', async (req, res) => {
    return res.sendFile(path_1.default.resolve('./static/index.html'));
});
route.post('/createBotInstance', authenticate_1.botInitializerGuard, authenticate_1.idBotRequired, (req, res) => {
    (0, bot_1.startWhatsapp)(req.body.bot_id, req.body.ws_id);
    console.log(`wa started with bot_id: ${req.body.bot_id} and ws_id: ${req.body.ws_id}`);
    return res.json("OK");
});
route.post('/sendText', authenticate_1.apiGuards, authenticate_1.idBotRequired, async (req, res) => {
    await (0, bot_1.sendText)(req.body.bot_id, req.body.number, { text: req.body.message });
    return res.json({ Status: "OK", payload: req.body });
});
route.post('/updateSocket', async (req, res) => {
    if (!req.body.number || !req.body.sock) {
        console.log(req.body);
        return res.json("number and sock required");
    }
    const sockidColl = db_1.dbChat.collection("sockid");
    const row = await sockidColl.findOneAndUpdate({ number: req.body.number }, { $set: { sock: req.body.sock } });
    console.log(row);
    if (!row.value) {
        sockidColl.insertOne({
            number: req.body.number,
            sock: req.body.sock
        });
    }
    return res.json("OK");
});
exports.default = route;
