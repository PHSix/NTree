"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBuffer = void 0;
async function CreateBuffer(nvim) {
    const buffer = (await nvim.createBuffer(false, true));
    setBufferOptions(buffer);
    return buffer;
}
exports.CreateBuffer = CreateBuffer;
async function setBufferOptions(buffer) {
    await Promise.all([
        buffer.setOption('filetype', 'NodeTree'),
        buffer.setOption('modifiable', false),
        buffer.setOption('buflisted', false),
    ]);
    return buffer;
}
