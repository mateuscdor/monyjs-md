import bodyParser from "body-parser";
import express from "express";
import { createServer } from "http";
// import { client } from "./module/db";
import route from "./route";
const app = express()
const port = 3000;
const httpServer = createServer(app)

// client.connect().then(() => console.log("db connected"))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(route)
app.use(express.static('static'))


httpServer.listen(port, () => {
    console.log(`server online, port: ${port}`)
})

export {
    httpServer
}