"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const neovim_1 = require("neovim");
const window_1 = require("./window");
const index_1 = require("./vim/index");
var store;
const nvim = neovim_1.attach({
    socket: process.env.NVIM_LISTEN_ADDRESS,
});
nvim.on('notification', async (method, args) => {
    if (method === 'open') {
        await nvim.window;
        await store.open();
        const win = await window_1.createWindow(nvim);
        win.setOption('winhl', 'Normal:NodeTreeNormal');
        win.request(`${win.prefix}set_buf`, [win, store.buffer]);
    }
    else if (method === 'action') {
        store.action(args[0].toString());
    }
});
nvim.channelId.then(async (channelId) => {
    await nvim.setVar('node_tree_channel_id', channelId);
    store = new index_1.Vim(nvim);
    await store.init();
});
