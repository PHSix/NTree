import { Neovim, Buffer } from 'neovim';

export async function createBuffer(nvim: Neovim): Promise<Buffer> {
  const buffer = (await nvim.createBuffer(false, true)) as Buffer;
  setBufferOption(buffer);
  return buffer;
}

async function setBufferOption(buffer: Buffer) {
  buffer.setOption('filetype', 'NodeTree');
  buffer.setOption('buflisted', false);
}
