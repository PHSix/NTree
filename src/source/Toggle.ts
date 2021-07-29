import { Neovim } from 'neovim';
import { CreateBuffer } from './Buffer';
import {Render} from './Render';
import { Store } from './Store';
import { CreateWindow } from './Window';
export async function Toggle(nvim: Neovim) {
  if (!Store.buffer) {
    const buf = await CreateBuffer(nvim);
    Store.buffer = buf;
  }
  const pwd = await nvim.commandOutput('pwd');
  if (!Store.pwd || pwd.match(Store.pwd) === null) {
    Store.pwd = pwd;
    Render();
  }
  // NOTE: Achieved close window and open window;
  if ((await existWindow(nvim)) === false) {
    Store.window = await nvim.window;
    CreateWindow(nvim);
  } else {
    return;
  }
}

async function existWindow(nvim: Neovim): Promise<boolean> {
  const wins = await nvim.getWindows();
  for (let win of wins) {
    if ((await win.buffer).id === Store.buffer.id) {
      win.close();
      return true;
    }
  }
  return false;
}
