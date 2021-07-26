import { InterfaceOption, KeyMap } from './TreeType';

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

