"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toggle = void 0;
const Buffer_1 = require("./Buffer");
const Render_1 = require("./Render");
const Store_1 = require("./Store");
const Window_1 = require("./Window");
async function Toggle(nvim) {
    if (!Store_1.Store.buffer) {
        const buf = await Buffer_1.CreateBuffer(nvim);
        Store_1.Store.buffer = buf;
    }
    const pwd = await nvim.commandOutput('pwd');
    if (!Store_1.Store.pwd || pwd.match(Store_1.Store.pwd) === null) {
        Store_1.Store.pwd = pwd;
        Render_1.Render();
    }
    // NOTE: Achieved close window and open window;
    if ((await existWindow(nvim)) === false) {
        Store_1.Store.window = await nvim.window;
        Window_1.CreateWindow(nvim);
    }
    else {
        return;
    }
}
exports.Toggle = Toggle;
async function existWindow(nvim) {
    const wins = await nvim.getWindows();
    for (let win of wins) {
        if ((await win.buffer).id === Store_1.Store.buffer.id) {
            win.close();
            return true;
        }
    }
    return false;
}
