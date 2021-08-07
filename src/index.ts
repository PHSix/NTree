import { attach } from 'neovim';
import { createWindow } from './window';
import { Vim } from './vim/index';
import { init } from './hl';

var store: Vim;

const nvim = attach({
  socket: process.env.NVIM_LISTEN_ADDRESS,
});

nvim.on('notification', async (method: string, args: string[]) => {
  if (method === 'open') {
    await store.render();
    const win = await createWindow(nvim);
    win.request(`${win.prefix}set_buf`, [win, store.buffer]);
  } else if (method === 'action') {
  }
});

nvim.channelId.then(async (channelId) => {
  await nvim.setVar('node_tree_channel_id', channelId);
  await init(nvim);
  store = new Vim(nvim);
  await store.init();
});
