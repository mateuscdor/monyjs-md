import { MongoClient } from "mongodb";

// const url = "mongodb+srv://ghifari:alghi7198254@democluster.hfncl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const url = process.env.MONGO_URI;

const client = new MongoClient(url)

const dbChat = client.db("chat")

export {
    client,
    dbChat
}