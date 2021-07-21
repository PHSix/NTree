import { Neovim } from 'neovim';
import { Option } from './Option';
export async function CreateHighlight(nvim: Neovim) {
  Option.namespace_id = await nvim.createNamespace('NodeTreeHighlights');
  await Promise.all<any>([
    nvim.command('highlight default link NodeTreeFolder BufferLineError'),
    nvim.command('highlight default link NodeTreeFile Normal'),
  ]);
}
