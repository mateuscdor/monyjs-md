"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageCaption = void 0;
const imageCaption = (textline) => {
    let arr = [];
    arr = textline.split('/');
    let pack = arr[1] != undefined ? arr[1] : 'Mony Sticker';
    let author = arr[2] != undefined ? arr[2] : 'Created by Mony Bot!';
    return {
        pack,
        author
    };
};
exports.imageCaption = imageCaption;
