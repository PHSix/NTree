import { Neovim, Window, Buffer } from 'neovim';
import { Store } from './Store';

export async function setWindowOptions(window: Window): Promise<Window> {
  Promise.all([
    window.setOption('number', false),
    window.setOption('relativenumber', false),
    window.setOption('signcolumn', 'no'),
    window.setOption('cursorline', true),
    window.setOption('wrap', false),
  ]);
  return window;
}

export async function CreateWindow(nvim: Neovim): Promise<Window> {
  await nvim.command(`30vsplit`);
  let window = await nvim.window;
  setWindowOptions(window);
  await window.request(`${window.prefix}set_buf`, [window, Store.buffer]);
  return window;
}
