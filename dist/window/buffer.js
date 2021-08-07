"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function createBuffer(nvim) {
    const buffer = (await nvim.createBuffer(false, true));
    setBufferOption(buffer);
    return buffer;
}
async function setBufferOption(buffer) {
    buffer.setOption('filetype', 'NodeTree');
    buffer.setOption('buflisted', false);
}
