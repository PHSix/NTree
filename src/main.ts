import { NvimPlugin } from 'neovim';
import { EditAction, HiddenAction } from './source/Actions';
import { CreateHighlight } from './source/Highlight';
import { Store } from './source/Store';
import { Toggle } from './source/Toggle';

export default function myplugin(plugin: NvimPlugin) {
  plugin.registerCommand(
    'NToggle',
    async () => {
      Store.nvim = plugin.nvim;
      await CreateHighlight(plugin.nvim);
      Toggle(plugin.nvim);
    },
    { sync: false }
  );
  plugin.registerCommand('TestCommand', async () => {}, { sync: false });
  plugin.registerFunction(
    'NodeTreeAction',
    async (args: object) => {
      switch (args.toString()) {
        case 'edit':
          const [cursorPos, _] = await plugin.nvim.window.cursor;
          EditAction(cursorPos);
          break;
        case 'dirUp':
          break;
        case 'touch':
          break;
        case 'mkdir':
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
