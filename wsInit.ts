import { Server } from "socket.io";
import { httpServer } from "./server";

export const io = new Server(httpServer)

io.on("connection", (socket) => {
    socketInstances[socket.id] = socket;
    socket.onAny(event => {
        onEventWS(event, socket)
    })
    console.log("socket connected " + socket.id)
})


export const socketInstances = {}

export const onEventWS = (events: string, socket: any) => {
    console.log("ini event: " + events)
    console.log(socket)
}