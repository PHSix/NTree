import { Neovim, Buffer } from 'neovim';

export async function CreateBuffer(nvim: Neovim): Promise<Buffer> {
  const buffer = (await nvim.createBuffer(false, true)) as Buffer;
  setBufferOptions(buffer);
  return buffer;
}

async function setBufferOptions(buffer: Buffer): Promise<Buffer> {
  await Promise.all([
    buffer.setOption('filetype', 'NodeTree'),
    buffer.setOption('modifiable', false),
    buffer.setOption('buflisted', false),
  ]);
  return buffer;
}

