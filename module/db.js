"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbChat = exports.client = void 0;
const mongodb_1 = require("mongodb");
// const url = "mongodb+srv://ghifari:alghi7198254@democluster.hfncl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const url = process.env.MONGO_URI;
const client = new mongodb_1.MongoClient(url);
exports.client = client;
const dbChat = client.db("chat");
exports.dbChat = dbChat;
