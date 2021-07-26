import { Icon } from './TreeType';
import { readFileSync } from 'fs';
import { ParseHiName } from './Highlight';

type IconColor = string;
type IconGroup = string;

export let Icons = {
  cursorToRight: '►',
  cursorToDown: '▼',
  foldOpen: '',
  foldClose: '',
};

const iconsMap: Map<string, Icon> = new Map();

const data = JSON.parse(readFileSync('./Icons.json').toString());
for (let item in data) {
  iconsMap.set(item, data[item]);
}

export function ParseFileIcon(ext: string): [IconGroup, IconColor] {
  if (iconsMap.has(ext)) {
    const item = iconsMap.get(ext);
    return [item.value, ParseHiName(ext)];
  }
  return ['', 'Normal'];
}

export function ParseFolderIcon(filename: string, isUnfold: boolean) {
  switch (filename) {
    case '.git':
      return '';
    case 'node_modules':
      return '';
    case '.vscode':
      return '';
    case '.Trash':
      return '';
    case '.github':
      return '';
    case 'config':
      return '';
    case 'hidden':
      return '';
    default:
      if (isUnfold) {
        return '';
      } else {
        return '';
      }
  }
}
