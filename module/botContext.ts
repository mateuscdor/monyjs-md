import { AnyWASocket } from "@adiwajshing/baileys-md"
import { createSticker, StickerTypes } from "wa-sticker-formatter/dist"
import { imageCaption } from "./mony"
interface Payload {
    bot: AnyWASocket,
    bot_id: string,
    other?: any
}

export const botContext = [
    {
        state: 'base',
        callback: (id: string, payload: Payload) => {
            return "a"
        }
    },
    {
        state: '!getid',
        callback: (id: string, payload: Payload) => {
            return payload.bot.sendMessage(id, { text: payload.bot_id })
        }
    },
    {
        state: '!mony',
        callback: (id: string, payload: Payload) => {
            const msg = "Halo kak! kenalin aku Mony, ada yang Mony bisa bantu? \n" +
                "Berikut chat command Mony yang bisa kamu pakai: \n\n" +
                "*- Dari gambar menjadi stiker (ketiknya di caption gambar ya!)* \n" +
                "!mony/{nama pack stickernya}/{nama pembuatnya}\n\n" +
                "*- Pengecekan status bidikmisi* \n" +
                "/bidikmisi \n\n" +
                "*- Pengecekan status KIPK* \n" +
                "/kipk/{nomor pendaftaran}/{kode akses} \n\n" +
                "Tunggu fitur yang lainnya ya kak!";
            return payload.bot.sendMessage(id, { text: msg })
        }
    },
    {
        state: '!imageSticker',
        callback: async (id: string, payload: Payload) => {
            let buffer = Buffer.from([])
            for await (const chunk of payload.other.stream) {
                buffer = Buffer.concat([buffer, chunk])
            }
            let capt = imageCaption(payload.other.caption)
            const stickerMetadata = {
                type: StickerTypes.FULL, //can be full or crop
                pack: capt.pack,
                author: capt.author,
            };
            const sticker = await createSticker(buffer, stickerMetadata)
            return payload.bot.sendMessage(id, { sticker: sticker })
        }
    },
]