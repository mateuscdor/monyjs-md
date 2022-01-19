"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.botContext = void 0;
const dist_1 = require("wa-sticker-formatter/dist");
const mony_1 = require("./mony");
exports.botContext = [
    {
        state: 'base',
        callback: (id, payload) => {
            return "a";
        }
    },
    {
        state: '!getid',
        callback: (id, payload) => {
            try {
                return payload.bot.sendMessage(id, { text: payload.bot_id });
            }
            catch (e) {
                console.log(e);
            }
        }
    },
    {
        state: '!mony',
        callback: (id, payload) => {
            const msg = "Halo kak! kenalin aku Mony, ada yang Mony bisa bantu? \n" +
                "Berikut chat command Mony yang bisa kamu pakai: \n\n" +
                "*- Dari gambar menjadi stiker (ketiknya di caption gambar ya!)* \n" +
                "!mony/{nama pack stickernya}/{nama pembuatnya}\n\n" +
                "*- Pengecekan status bidikmisi* \n" +
                "/bidikmisi \n\n" +
                "*- Pengecekan status KIPK* \n" +
                "/kipk/{nomor pendaftaran}/{kode akses} \n\n" +
                "Tunggu fitur yang lainnya ya kak!";
            try {
                return payload.bot.sendMessage(id, { text: msg });
            }
            catch (error) {
                console.log(error);
            }
        }
    },
    {
        state: '!imageSticker',
        callback: async (id, payload) => {
            let buffer = Buffer.from([]);
            for await (const chunk of payload.other.stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            let capt = (0, mony_1.imageCaption)(payload.other.caption);
            const stickerMetadata = {
                type: dist_1.StickerTypes.FULL,
                pack: capt.pack,
                author: capt.author,
            };
            const sticker = await (0, dist_1.createSticker)(buffer, stickerMetadata);
            try {
                return payload.bot.sendMessage(id, { sticker: sticker });
            }
            catch (error) {
                console.log(error);
            }
        }
    },
];
