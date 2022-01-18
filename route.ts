import { Router } from "express";
import path from "path";
import { startWhatsapp, sendText, botArray } from "./bot";
import { apiGuards, botInitializerGuard, idBotRequired, mediaRequired } from "./middleware/authenticate";
import { dbChat } from "./module/db";

const route = Router()

route.get('/', async (req, res) => {
    return res.sendFile(path.resolve('./static/index.html'))
})

route.post('/createBotInstance', botInitializerGuard, idBotRequired, (req, res) => {
    startWhatsapp(req.body.bot_id, req.body.ws_id)
    console.log(`wa started with bot_id: ${req.body.bot_id} and ws_id: ${req.body.ws_id}`)
    return res.json("OK")
})

route.post('/sendText', apiGuards, idBotRequired, async (req, res) => {
    await sendText(req.body.bot_id, req.body.number, { text: req.body.message })
    return res.json({ Status: "OK", payload: req.body })
})

route.post('/sendImage', apiGuards, idBotRequired, mediaRequired, async (req, res) => {
    Buffer.isBuffer(req.body.file) ?
        await sendText(req.body.bot_id, req.body.number, { image: req.body.file, caption: req.body.caption }) :
        await sendText(req.body.bot_id, req.body.number, { image: { url: req.body.file }, caption: req.body.caption })

})

route.post('/sendVideo', apiGuards, idBotRequired, mediaRequired, async (req, res) => {
    Buffer.isBuffer(req.body.file) ?
        await sendText(req.body.bot_id, req.body.number, { image: req.body.file, caption: req.body.caption }) :
        await sendText(req.body.bot_id, req.body.number, { image: { url: req.body.file }, caption: req.body.caption })
})

route.post('/sendFile', apiGuards, idBotRequired, mediaRequired, async (req, res) => {
    Buffer.isBuffer(req.body.file) ?
        await sendText(req.body.bot_id, req.body.number, { document: req.body.file, mimetype: req.body.mimeType, fileName: req.body.filename }) :
        await sendText(req.body.bot_id, req.body.number, { document: { url: req.body.file }, mimetype: req.body.mimeType, fileName: req.body.filename })
})

route.post('/sendButtonText', apiGuards, idBotRequired, mediaRequired, async (req, res) => {
    if (!Array.isArray(req.body.buttons)) {
        return res.status(400).json({ Error: "Buttons it's not array", payload: req.body })
    }

    let buttonMessage = {
        image: Buffer.isBuffer(req.body.file) ? req.body.file : { url: req.body.file },
        caption: req.body.caption,
        footerText: req.body.footerText,
        buttons: req.body.buttons,
        headerType: 4
    }

    await sendText(req.body.bot_id, req.body.number, buttonMessage)
})

route.post('/updatePresence', apiGuards, idBotRequired, async (req, res) => {
    await botArray[req.body.bot_id].sendPresenceUpdate(req.body.presence, `${req.body.number}@s.whatsapp.net`)
})

route.post('/updateSocket', async (req, res) => {
    if (!req.body.number || !req.body.sock) {
        console.log(req.body)
        return res.json("number and sock required")
    }
    const sockidColl = dbChat.collection("sockid")
    const row = await sockidColl.findOneAndUpdate({ number: req.body.number }, { $set: { sock: req.body.sock } })
    console.log(row);
    if (!row.value) {
        sockidColl.insertOne({
            number: req.body.number,
            sock: req.body.sock
        })
    }

    return res.json("OK")
})

export default route