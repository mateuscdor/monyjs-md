import { NextFunction, Request, Response } from "express";
import { botArray } from "../bot";

export const apiGuards = (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.headers.authorization === "undefined" || req.headers.authorization !== process.env.API_KEY) {
        return res.status(401).json({
            "Error": "Not Authorized",
            "Time": new Date(),
        })
    }

    if (typeof req.body.number === "undefined") {
        return res.status(401).json({
            "Error": "Number Required",
            "Time": new Date(),
            "Payload": req.body
        })
    }

    if (typeof botArray[req.body.bot_id] === "undefined") {
        return res.status(400).json({
            "Error": "Bot not found",
            "Time": new Date(),
            "Payload": req.body
        })
    }


    next()
}

export const botInitializerGuard = (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.body.authorization === "undefined" || typeof req.body.ws_id === "undefined" || req.body.authorization !== process.env.AUTHENTICATE_KEY) {
        return res.status(401).json({
            "Error": "Not Authorized",
            "Time": new Date(),
        })
    }
    next()
}

export const idBotRequired = (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.body.bot_id === "undefined") {
        return res.status(400).json({
            "Error": "ID required",
            "Time": new Date(),
            "Payload": req.body
        })
    }
    next()
}

export const mediaRequired = (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.body.file === "undefined") {
        return res.status(400).json({
            "Error": "File required (Buffer or URL)",
            "Time": new Date(),
            "Payload": req.body
        })
    }
}