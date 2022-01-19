import makeWASocket, { AnyMessageContent, AnyWASocket, DisconnectReason, downloadContentFromMessage, MiscMessageGenerationOptions, useSingleFileAuthState } from '@adiwajshing/baileys-md'
import { Boom } from "@hapi/boom"
// import { dbChat } from './module/db'
import * as fs from 'fs'
import * as qr from 'qr-image'
import { io } from './wsInit'
import { Ctx } from 'context-chatbot'
import { botContext } from './module/botContext'

const botArray: { [k: string]: AnyWASocket } = {}
const failArray = {}
Ctx.registerArrayContext(botContext)


const sendText = async (bot_id: string, number: string, content: AnyMessageContent, options?: MiscMessageGenerationOptions) => {
    try {
        await botArray[bot_id].sendMessage(number + '@s.whatsapp.net', content, options);
    } catch (error) {
        return new Error(error);
    }
}

const startWhatsapp = async (bot_id: string, ws_id: string) => {
    let maxQr = 0
    let isFailedCreateInstance = false

    // const messages = dbChat.collection("messages")
    // const status = dbChat.collection("status")

    const { state, saveState } = useSingleFileAuthState(`./authState/${bot_id}.json`)
    const sock = makeWASocket({

        browser: [bot_id, "Google Chrome", "18.04"],
        printQRInTerminal: true,
        auth: state,
        // implement to handle retries
        getMessage: async key => {
            return {
                conversation: 'hello'
            }
        }
    })

    botArray[bot_id] = sock

    sock.ev.on('messages.upsert', async m => {

        const msg = m.messages[0]

        //check message conversation
        if (msg.message?.conversation) {
            sock.sendReadReceipt(msg.key.remoteJid, msg.key.participant, [msg.key.id])
            switch (msg.message.conversation) {
                case "!getid":
                case "!mony":
                    Ctx.setState(msg.key.remoteJid, msg.message.conversation)
                    break;
                default:
                    Ctx.setState(msg.key.remoteJid, "default")
                    break;
            }
            Ctx.Context(msg.key.remoteJid, { bot: sock, bot_id: bot_id })
        }

        //check message image
        if (msg.message?.imageMessage) {
            sock.sendReadReceipt(msg.key.remoteJid, msg.key.participant, [msg.key.id])
            if (msg.message.imageMessage.caption.includes("!mony")) {
                Ctx.setState(msg.key.remoteJid, "!imageSticker")
                Ctx.Context(msg.key.remoteJid, {
                    bot: sock, bot_id: bot_id, other: {
                        caption: msg.message.imageMessage.caption,
                        stream: await downloadContentFromMessage(msg.message.imageMessage, 'image')
                    }
                })
            }
        }



        console.log(msg.message.conversation);
        if (!msg.key.fromMe && m.type === 'notify') {
            console.log('replying to', m.messages[0].key.remoteJid)
            // await sock!.sendReadReceipt(msg.key.remoteJid, msg.key.participant, [msg.key.id])
            // await sock.sendMessage(msg.key.remoteJid, {text: 'halo'})
        }


        // console.log('ini M: ' + JSON.stringify(m, undefined, 2))
        if (!Array.isArray(m)) {
            try {
                m.messages.map(async message => {
                    if (message.key.remoteJid === "status@broadcast") {
                        //await status.insertOne(m)
                    } else {
                        // await messages.insertOne(message)
                        // console.log("SUKSES INSERT INTO MESSAGE FROM M")
                    }
                })

            } catch (e) {
                console.error(e)
                console.log('eror pada message.upsert')
                console.log('ini M: ' + JSON.stringify(m, undefined, 2))
            }
            console.log("OBJECT TERDETEKSI")
        } else {
            console.log("BUKAN OBJECT, antara array")
        }


    })

    sock.ev.on('messages.update', async m => {
        // console.log('message update: ' + JSON.stringify(m, undefined, 2));
        if (typeof m === "object") {
            try {
                m.map(async message => {
                    if (message.key.remoteJid === "status@broadcast") {
                        //await status.insertOne(m)
                    } else {
                        // let record = await messages.findOne({ "key.id": message.key.id })
                        // console.log('RECORD: ')
                        // console.log(record)
                        // if (record && message?.update?.status) {
                        //     messages.updateOne({ "key.id": message.key.id }, { $set: { "status": message.update.status } })
                        // }
                        // await messages.insertOne(message)
                    }
                })
            } catch (e) {
                console.error(e)
                console.log('eror pada messages.update')
                console.log('ini M: ' + JSON.stringify(m, undefined, 2))
            }
            console.log("OBJECT TERDETEKSI")
        } else {
            console.log("BUKAN OBJECT")
        }
    })
    sock.ev.on('presence.update', m => { console.log('presence update: ' + JSON.stringify(m, undefined, 2)) })
    sock.ev.on('chats.update', m => { console.log('chat update: ' + JSON.stringify(m, undefined, 2)) })
    sock.ev.on('contacts.update', m => { console.log('contact update: ' + JSON.stringify(m, undefined, 2)) })


    sock.ev.on('connection.update', update => {
        if (typeof update.isNewLogin !== "undefined") {
            failArray[bot_id] = 0;
            if (update.isNewLogin) {
                // messages.deleteMany({}).then(() => console.log('new login, messages deleted')).catch(e => console.error(e))
                // status.deleteMany({}).then(() => console.log('new login, status deleted')).catch(e => console.error(e))
                io.to(ws_id).emit("bot_success", "bot created successfully, please scan the qr")
            } else {
                io.to(ws_id).emit("bot_success", "bot created successfully")
            }

        }

        if (update.qr) {
            if (maxQr > 1) {
                io.to(ws_id).emit("qr_timeout", "QR scan timeout, please create again")
                isFailedCreateInstance = true
                sock.ws.close()
            }
            let buff = qr.imageSync(update.qr);
            io.to(ws_id).emit("qr", Buffer.from(buff).toString('base64'))
            maxQr++

        }

        const { connection, lastDisconnect } = update
        if (connection === 'close') {

            //connection closed, duplicate connection
            if ((lastDisconnect.error as Boom)?.output?.statusCode === DisconnectReason.connectionClosed) {
                if (typeof failArray[bot_id] === 'undefined') {
                    failArray[bot_id] = 1;
                } else {
                    failArray[bot_id]++;
                }
                fs.unlinkSync(`./authState/${bot_id}.json`)
                console.log('key mismatch')

                if (failArray[bot_id] < 3) {
                    startWhatsapp(bot_id, ws_id)
                } else {
                    delete failArray[bot_id]
                }
            }
            //not identified error, try reconnect
            else if ((lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut && !isFailedCreateInstance) {
                startWhatsapp(bot_id, ws_id)
            }
            else if ((lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut && isFailedCreateInstance) {
                if (typeof failArray[bot_id] === 'undefined') {
                    failArray[bot_id] = 1;
                } else {
                    failArray[bot_id]++;
                }
                fs.unlinkSync(`./authState/${bot_id}.json`)
                console.log('key mismatch')

                if (failArray[bot_id] < 3) {
                    startWhatsapp(bot_id, ws_id)
                } else {
                    delete failArray[bot_id]
                }

            }
            else if ((lastDisconnect.error as Boom)?.output?.statusCode === DisconnectReason.loggedOut) {
                if (typeof failArray[bot_id] === 'undefined') {
                    failArray[bot_id] = 1;
                } else {
                    failArray[bot_id]++;
                }
                fs.unlinkSync(`./authState/${bot_id}.json`)
                console.log('key mismatch')

                if (failArray[bot_id] < 3) {
                    startWhatsapp(bot_id, ws_id)
                } else {
                    delete failArray[bot_id]
                }

            }
            else {
                console.log('connection closed')
                if (typeof failArray[bot_id] === 'undefined') {
                    failArray[bot_id] = 1;
                } else {
                    failArray[bot_id]++;
                }
                fs.unlinkSync(`./authState/${bot_id}.json`)
                console.log('key mismatch')

                if (failArray[bot_id] < 3) {
                    startWhatsapp(bot_id, ws_id)
                } else {
                    delete failArray[bot_id]
                }
            }
        }

        console.log('connection update: ', update)
    })

    sock.ev.on('creds.update', saveState)

    return sock
}


export {
    startWhatsapp,
    botArray,
    sendText
}
