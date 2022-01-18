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
            return payload.bot.sendMessage(id, { text: payload.bot_id });
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
            return payload.bot.sendMessage(id, { text: msg });
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
            return payload.bot.sendMessage(id, { sticker: sticker });
        }
    },
];
