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
import { CreateHighlight, setFlag } from './source/Highlight';
import { Store } from './source/Store';
import { Toggle } from './source/Toggle';

export default function myplugin(plugin: NvimPlugin) {
  plugin.registerCommand(
    'NToggle',
    async () => {
      if (!Store.nvim) {
        Store.nvim = plugin.nvim;
      }
      if (setFlag == false) {
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
      }
    },
    {
      sync: false,
    }
  );
}
