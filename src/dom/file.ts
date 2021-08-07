import { BaseElement, BaseAttribute } from './BaseElement';
import icons from '../icons';
import { FolderElement } from './folder';

export class FileElement extends BaseElement {
  ext: string;
  constructor(filename: string, path: string, parent: FolderElement) {
    super(filename, path, parent);
    const ext = parseEXT(filename);
    const { icon, name } = getIcon(filename, ext);
    const hlGroup = getHiGroup(name);
    this.ext = ext || '';

    this.attribute = {
      hlGroup,
      icon,
    };
  }
}

function getHiGroup(hlGroup: string) {
  return `NodeTreeIcons${hlGroup}`;
}

function parseEXT(filename: string) {
  return filename.split('.').pop();
}

function getIcon(filename: string, ext: string) {
  if (icons[filename]) {
    return icons[filename];
  } else if (icons[ext]) {
    return icons[ext];
  } else {
    return icons['default_icon'];
  }
}
