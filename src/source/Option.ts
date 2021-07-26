import { Neovim } from 'neovim';
import { InterfaceOption } from './TreeType';

function RegisterKeyMap(key: string, value: string) {}

export let Option: InterfaceOption = {
  hidden_file: true,
  keymaps: [],
  defaultKeyMaps: [
    { key: 'cn', value: 'touch' },
    { key: 'rn', value: 'rename' },
    { key: 'mk', value: 'mkdir' },
    { key: 'dd', value: 'delete' },
    { key: 'zh', value: 'hide' },
    { key: 'q', value: 'quit' },
    { key: 'o', value: 'edit' },
    { key: '<CR>', value: 'edit' },
    { key: 'u', value: 'dirUp' },
  ],
};

export function Register(nvim: Neovim){
  if (nvim.getVar("node_tree_option_hide_file")){
  }
}
