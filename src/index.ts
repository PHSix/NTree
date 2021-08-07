import { attach } from 'neovim';

const nvim = attach({
  socket: process.env.NVIM_LISTEN_ADDRESS,
});

nvim.on('notification', async (method: string, args: string[]) => {
  if (method === 'open'){
  }else if (method === 'action'){
  }
});

nvim.channelId.then((channelId) => {
  nvim.setVar('node_tree_channel_id', channelId);
});


