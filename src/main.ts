import { NvimPlugin } from 'neovim';
import {
  DirUpAction,
  EditAction,
  HiddenAction,
  MkdirAction,
  RenameAction,
  TouchAction,
} from './source/Actions';
import { CreateHighlight } from './source/Highlight';
import { Store } from './source/Store';
import { Toggle } from './source/Toggle';
import { Log } from './source/Tools';

export default function myplugin(plugin: NvimPlugin) {
  plugin.registerCommand(
    'NToggle',
    async () => {
      const d = Date.now();
      Store.nvim = plugin.nvim;
      await CreateHighlight(plugin.nvim);
      await Toggle(plugin.nvim);
      await Log(`${Date.now() - d} ms`);
    },
    { sync: false }
  );
  plugin.registerCommand('TestCommand', async () => {}, { sync: false });
  plugin.registerFunction(
    'NodeTreeAction',
    async (args: object) => {
      const [cursorPos, _] = await plugin.nvim.window.cursor;
      switch (args.toString()) {
        case 'edit':
          EditAction(cursorPos);
          break;
        case 'dirUp':
          DirUpAction(cursorPos);
          break;
        case 'touch':
          TouchAction(cursorPos);
          break;
        case 'mkdir':
          MkdirAction(cursorPos);
          break;
        case 'rename':
          RenameAction(cursorPos);
          break;
        case 'hide':
          HiddenAction();
          break;
      }
    },
    {
      sync: false,
    }
  );
  plugin.registerFunction('RegisterNodeTree', async (args: object) => {}, {
    sync: false,
  });
}
