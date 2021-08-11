import { BaseElement } from './BaseElement';
import icons, { IconModel } from '../icons';
import { FileSystem } from '../fs/index';

export class FolderElement extends BaseElement {
  private _unfold: boolean;
  set unfold(value: boolean) {
    this._unfold = value;
    const { icon, name } = getIcon(this.filename, this._unfold);
    const hlGroup = getHiGroup(name);
    this.attribute = {
      icon,
      hlGroup,
    };
  }
  get unfold() {
    return this._unfold;
  }
  firstChild: BaseElement;
  lastChild: BaseElement;
  public appendChild(c: BaseElement) {
    if (!this.firstChild) {
      this.firstChild = this.lastChild = c;
    } else {
      this.lastChild.after = c;
      c.before = this.lastChild;
      this.lastChild = c;
    }
  }
  constructor(filename: string, path: string, parent: FolderElement = null) {
    super(filename, path, parent);
    this._unfold = false;
    const { icon, name } = getIcon(filename, this._unfold);
    const hlGroup = getHiGroup(name);
    this.attribute = {
      icon,
      hlGroup,
    };
  }
  public async generateChildren(): Promise<void> {
    const [folders, files] = await FileSystem.findChildren(this.fullpath, this);
    this.unfold = true;
    if (folders.length !== 0) {
      folders.forEach((item) => {
        this.appendChild(item);
      });
    }
    if (files.length !== 0) {
      files.forEach((item) => {
        this.appendChild(item);
      });
    }
    if (this.firstChild === undefined) {
      this.firstChild = this.lastChild = null;
    }
    return;
  }
}

function getHiGroup(hlGroup: string): string {
  return `NodeTreeIcon${hlGroup}`;
}
/*
 * to get folder element icon
 * */
function getIcon(filename: string, unfold: boolean): IconModel {
  if (icons[filename]) {
    return icons[filename];
  } else {
    if (unfold) {
      return icons['default_folder_open'];
    }
    return icons['default_folder'];
  }
}
