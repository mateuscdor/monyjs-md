"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendText = exports.botArray = exports.startWhatsapp = void 0;
const baileys_md_1 = __importStar(require("@adiwajshing/baileys-md"));
// import { dbChat } from './module/db'
const fs = __importStar(require("fs"));
const qr = __importStar(require("qr-image"));
const wsInit_1 = require("./wsInit");
const context_chatbot_1 = require("context-chatbot");
const botContext_1 = require("./module/botContext");
const botArray = {};
exports.botArray = botArray;
const failArray = {};
context_chatbot_1.Ctx.registerArrayContext(botContext_1.botContext);
const sendText = async (bot_id, number, content, options) => {
    try {
        await botArray[bot_id].sendMessage(number + '@s.whatsapp.net', content, options);
    }
    catch (error) {
        return new Error(error);
    }
};
exports.sendText = sendText;
const startWhatsapp = async (bot_id, ws_id) => {
    let maxQr = 0;
    let isFailedCreateInstance = false;
    // const messages = dbChat.collection("messages")
    // const status = dbChat.collection("status")
    const { state, saveState } = (0, baileys_md_1.useSingleFileAuthState)(`./authState/${bot_id}.json`);
    const sock = (0, baileys_md_1.default)({
        browser: [bot_id, "Google Chrome", "18.04"],
        printQRInTerminal: true,
        auth: state,
        // implement to handle retries
        getMessage: async (key) => {
            return {
                conversation: 'hello'
            };
        }
    });
    botArray[bot_id] = sock;
    sock.ev.on('messages.upsert', async (m) => {
        var _a, _b;
        const msg = m.messages[0];
        //check message conversation
        if ((_a = msg.message) === null || _a === void 0 ? void 0 : _a.conversation) {
            sock.sendReadReceipt(msg.key.remoteJid, msg.key.participant, [msg.key.id]);
            switch (msg.message.conversation) {
                case "!getid":
                case "!mony":
                    context_chatbot_1.Ctx.setState(msg.key.remoteJid, msg.message.conversation);
                    break;
                default:
                    context_chatbot_1.Ctx.setState(msg.key.remoteJid, "default");
                    break;
            }
            context_chatbot_1.Ctx.Context(msg.key.remoteJid, { bot: sock, bot_id: bot_id });
        }
        //check message image
        if ((_b = msg.message) === null || _b === void 0 ? void 0 : _b.imageMessage) {
            sock.sendReadReceipt(msg.key.remoteJid, msg.key.participant, [msg.key.id]);
            if (msg.message.imageMessage.caption.includes("!mony")) {
                context_chatbot_1.Ctx.setState(msg.key.remoteJid, "!imageSticker");
                context_chatbot_1.Ctx.Context(msg.key.remoteJid, { bot: sock, bot_id: bot_id, other: {
                        caption: msg.message.imageMessage.caption,
                        stream: await (0, baileys_md_1.downloadContentFromMessage)(msg.message.imageMessage, 'image')
                    } });
            }
        }
        console.log(msg.message.conversation);
        if (!msg.key.fromMe && m.type === 'notify') {
            console.log('replying to', m.messages[0].key.remoteJid);
            // await sock!.sendReadReceipt(msg.key.remoteJid, msg.key.participant, [msg.key.id])
            // await sock.sendMessage(msg.key.remoteJid, {text: 'halo'})
        }
        // console.log('ini M: ' + JSON.stringify(m, undefined, 2))
        if (!Array.isArray(m)) {
            try {
                m.messages.map(async (message) => {
                    if (message.key.remoteJid === "status@broadcast") {
                        //await status.insertOne(m)
                    }
                    else {
                        // await messages.insertOne(message)
                        // console.log("SUKSES INSERT INTO MESSAGE FROM M")
                    }
                });
            }
            catch (e) {
                console.error(e);
                console.log('eror pada message.upsert');
                console.log('ini M: ' + JSON.stringify(m, undefined, 2));
            }
            console.log("OBJECT TERDETEKSI");
        }
        else {
            console.log("BUKAN OBJECT, antara array");
        }
    });
    sock.ev.on('messages.update', async (m) => {
        // console.log('message update: ' + JSON.stringify(m, undefined, 2));
        if (typeof m === "object") {
            try {
                m.map(async (message) => {
                    if (message.key.remoteJid === "status@broadcast") {
                        //await status.insertOne(m)
                    }
                    else {
                        // let record = await messages.findOne({ "key.id": message.key.id })
                        // console.log('RECORD: ')
                        // console.log(record)
                        // if (record && message?.update?.status) {
                        //     messages.updateOne({ "key.id": message.key.id }, { $set: { "status": message.update.status } })
                        // }
                        // await messages.insertOne(message)
                    }
                });
            }
            catch (e) {
                console.error(e);
                console.log('eror pada messages.update');
                console.log('ini M: ' + JSON.stringify(m, undefined, 2));
            }
            console.log("OBJECT TERDETEKSI");
        }
        else {
            console.log("BUKAN OBJECT");
        }
    });
    sock.ev.on('presence.update', m => { console.log('presence update: ' + JSON.stringify(m, undefined, 2)); });
    sock.ev.on('chats.update', m => { console.log('chat update: ' + JSON.stringify(m, undefined, 2)); });
    sock.ev.on('contacts.update', m => { console.log('contact update: ' + JSON.stringify(m, undefined, 2)); });
    sock.ev.on('connection.update', update => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (typeof update.isNewLogin !== "undefined") {
            if (update.isNewLogin) {
                // messages.deleteMany({}).then(() => console.log('new login, messages deleted')).catch(e => console.error(e))
                // status.deleteMany({}).then(() => console.log('new login, status deleted')).catch(e => console.error(e))
                wsInit_1.io.to(ws_id).emit("bot_success", "bot created successfully, please scan the qr");
            }
            else {
                wsInit_1.io.to(ws_id).emit("bot_success", "bot created successfully");
            }
        }
        if (update.qr) {
            if (maxQr > 1) {
                wsInit_1.io.to(ws_id).emit("qr_timeout", "QR scan timeout, please create again");
                isFailedCreateInstance = true;
                sock.ws.close();
            }
            let buff = qr.imageSync(update.qr);
            wsInit_1.io.to(ws_id).emit("qr", Buffer.from(buff).toString('base64'));
            maxQr++;
        }
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            //connection closed, duplicate connection
            if (((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) === baileys_md_1.DisconnectReason.connectionClosed) {
                wsInit_1.io.to(ws_id).emit("duplicate_connection", "Bot already connected with this session, abort connection");
                delete failArray[bot_id];
                isFailedCreateInstance = true;
                return sock.ws.close();
            }
            //not identified error, try reconnect
            else if (((_d = (_c = lastDisconnect.error) === null || _c === void 0 ? void 0 : _c.output) === null || _d === void 0 ? void 0 : _d.statusCode) !== baileys_md_1.DisconnectReason.loggedOut && !isFailedCreateInstance) {
                startWhatsapp(bot_id, ws_id);
            }
            else if (((_f = (_e = lastDisconnect.error) === null || _e === void 0 ? void 0 : _e.output) === null || _f === void 0 ? void 0 : _f.statusCode) !== baileys_md_1.DisconnectReason.loggedOut && isFailedCreateInstance) {
                return "";
            }
            else if (((_h = (_g = lastDisconnect.error) === null || _g === void 0 ? void 0 : _g.output) === null || _h === void 0 ? void 0 : _h.statusCode) === baileys_md_1.DisconnectReason.loggedOut) {
                if (typeof failArray[bot_id] === 'undefined') {
                    failArray[bot_id] = 1;
                }
                else {
                    failArray[bot_id]++;
                }
                fs.unlinkSync(`./authState/${bot_id}.json`);
                console.log('key mismatch');
                if (failArray[bot_id] < 3) {
                    startWhatsapp(bot_id, ws_id);
                }
                else {
                    delete failArray[bot_id];
                }
            }
            else {
                console.log('connection closed');
            }
        }
        console.log('connection update: ', update);
    });
    sock.ev.on('creds.update', saveState);
    return sock;
};
exports.startWhatsapp = startWhatsapp;
