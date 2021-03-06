"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWindow = exports.setWindowOptions = void 0;
async function setWindowOptions(window) {
    Promise.all([
        window.setOption('number', false),
        window.setOption('relativenumber', false),
        window.setOption('signcolumn', 'no'),
        window.setOption('cursorline', true),
        window.setOption('wrap', false),
    ]);
    return window;
}
exports.setWindowOptions = setWindowOptions;
async function createWindow(nvim) {
    const wins = await nvim.windows;
    for (let win of wins) {
        const [, col] = await win.position;
        if (col === 0) {
            nvim.setWindow(win);
            break;
        }
    }
    nvim.setOption('splitright', false);
    nvim.command(`30vsplit`);
    let window = await nvim.window;
    window.request(`${window.prefix}set_width`, [window, 30]);
    setWindowOptions(window);
    return window;
}
exports.createWindow = createWindow;
