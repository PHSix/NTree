"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBuffer = void 0;
async function createBuffer(nvim) {
    const buffer = (await nvim.createBuffer(false, true));
    setBufferOption(buffer);
    return buffer;
}
exports.createBuffer = createBuffer;
async function setBufferOption(buffer) {
    buffer.setOption('filetype', 'NodeTree');
    buffer.setOption('buflisted', false);
}
