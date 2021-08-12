import { BaseElement } from './BaseElement';
import { IconModel, folderIcons } from '../icons';
import { FileSystem } from '../fs/index';

export class FolderElement extends BaseElement {
  firstChild: BaseElement;
  lastChild: BaseElement;
  private _unfold: boolean;
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
  public appendChild(c: BaseElement) {
    if (!this.firstChild) {
      this.firstChild = this.lastChild = c;
    } else {
      this.lastChild.after = c;
      c.before = this.lastChild;
      this.lastChild = c;
    }
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
  public applyChildren(first: BaseElement, last: BaseElement) {
    this.firstChild = first;
    this.lastChild = last;
    var point = first;
    while (point) {
      point.parent = this;
      point = point.after;
    }
  }
}

function getHiGroup(hlGroup: string): string {
  return `NodeTreeIcon${hlGroup}`;
}
/*
 * to get folder element icon
 * */
function getIcon(filename: string, unfold: boolean): IconModel {
  if (folderIcons[filename]) {
    return folderIcons[filename];
  } else {
    if (unfold) {
      return folderIcons['default_folder_open'];
    }
    return folderIcons['default_folder'];
  }
}
