import { attach } from 'neovim';
import { createWindow } from './window';
import { Vim } from './vim/index';

var store: Vim;

const nvim = attach({
  socket: process.env.NVIM_LISTEN_ADDRESS,
});

nvim.on('notification', async (method: string, args: string[]) => {
  if (method === 'open') {
    if (!store.context) {
      await store.render();
    }
    const win = await createWindow(nvim);
    win.setOption('winhl', 'Normal:NodeTreeNormal');
    win.request(`${win.prefix}set_buf`, [win, store.buffer]);
  } else if (method === 'action') {
  }
});

nvim.channelId.then(async (channelId) => {
  await nvim.setVar('node_tree_channel_id', channelId);
  store = new Vim(nvim);
  await store.init();
});
