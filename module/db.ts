import { MongoClient } from "mongodb";
const url = process.env.MONGO_URI;

const client = new MongoClient(url)

const dbChat = client.db("chat")

export {
    client,
    dbChat
}