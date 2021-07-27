import { NvimPlugin } from 'neovim';
import {
  DirUpAction,
  EditAction,
  HiddenAction,
  MkdirAction,
  RemoveAction,
  RenameAction,
  TouchAction,
} from './source/Actions';
import { CreateHighlight } from './source/Highlight';
import { Option } from './source/Option';
import { Store } from './source/Store';
import { Toggle } from './source/Toggle';

let loaderFlag = false;

export default function myplugin(plugin: NvimPlugin) {
  plugin.registerCommand(
    'NToggle',
    async () => {
      if (!Store.cwd) {
        Store.cwd = process.cwd();
      }
      if (!Store.nvim) {
        Store.nvim = plugin.nvim;
      }
      if (loaderFlag === false) {
        Option.hide_file = (await plugin.nvim.getVar(
          'node_tree_hide_files'
        )) as boolean;
        await CreateHighlight(plugin.nvim);
      }
      Store.window = await plugin.nvim.window;
      await Toggle(plugin.nvim);
    },
    { sync: true }
  );
  plugin.registerFunction(
    'NodeTreeAction',
    async (args: object) => {
      const [cursorPos, _] = await plugin.nvim.window.cursor;
      switch (args.toString()) {
        case 'edit':
          await EditAction(cursorPos);
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
        case 'delete':
          RemoveAction(cursorPos);
          break;
        case 'quit':
          plugin.nvim.command('q');
          break;
      }
    },
    {
      sync: false,
    }
  );
}
