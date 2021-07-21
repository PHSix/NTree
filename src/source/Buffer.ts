import { Neovim, Buffer } from 'neovim';
import { Option } from './Option';

export async function CreateBuffer(nvim: Neovim): Promise<Buffer> {
  const buffer = (await nvim.createBuffer(false, true)) as Buffer;
  setBufferOptions(buffer);
  // DefineHi(nvim);
  mapKeys(buffer);
  if (!Option.namespace_id) {
    //   await CreateNameSpace(nvim);
  }
  return buffer;
}

async function setBufferOptions(buffer: Buffer): Promise<Buffer> {
  await Promise.all([
    buffer.setOption('filetype', 'LightTree'),
    buffer.setOption('modifiable', false),
    buffer.setOption('buflisted', false),
  ]);
  return buffer;
}

//
// map tree buffer
//
async function mapKeys(buffer: Buffer) {
  let mapQueue: Promise<void>[] = [];
  let map = async (key: string, value: string) => {
    await buffer.request(`${buffer.prefix}set_keymap`, [
      buffer,
      'n',
      key,
      value,
      { silent: true },
    ]);
  };
  mapQueue.push(map('o', ":call NodeTreeAction('edit')<CR>"));
  mapQueue.push(map('<CR>', ":call NodeTreeAction('edit')<CR>"));
  mapQueue.push(map('u', ":call NodeTreeAction('dirUp')<CR>"));
  mapQueue.push(map('cn', ":call NodeTreeAction('touch')<CR>"));
  mapQueue.push(map('mk', ":call NodeTreeAction('mkdir')<CR>"));
  mapQueue.push(map('q', ':q<CR>'));
  mapQueue.push(map('r', ":call NodeTreeAction('refresh')<CR>"));
  mapQueue.push(map('zh', ":call NodeTreeAction('hide')<CR>"));
  await Promise.all<void>(mapQueue);
}
