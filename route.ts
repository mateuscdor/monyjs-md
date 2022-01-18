import { Router } from "express";
import path from "path";
import { startWhatsapp, sendText } from "./bot";
import { apiGuards, botInitializerGuard, idBotRequired } from "./middleware/authenticate";
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