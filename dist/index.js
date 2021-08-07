"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const neovim_1 = require("neovim");
const nvim = neovim_1.attach({
    socket: process.env.NVIM_LISTEN_ADDRESS,
});
nvim.on('notification', async (method, args) => {
    if (method === 'open') {
    }
    else if (method === 'action') {
    }
});
nvim.channelId.then((channelId) => {
    nvim.setVar('node_tree_channel_id', channelId);
});
