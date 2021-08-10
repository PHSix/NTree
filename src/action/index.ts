import { BaseElement } from '../dom/BaseElement';
import { FolderElement } from '../dom/folder';
import { Neovim } from 'neovim';
import { FileElement } from '../dom/file';
import { FileSystem } from '../fs';
export class Action {
  nvim: Neovim;
  constructor(nvim: Neovim) {
    this.nvim = nvim;
  }
  async handle(element: BaseElement, to: string) {
    if (to === 'operate') {
      if (element instanceof FileElement) {
        this.nvim.command(`e ${element.fullpath}`);
      } else {
        await this.toggle(element as FolderElement);
      }
    } else {
      switch (to) {
        case 'rename':
          this.rename(element);
          break;
        case 'remove':
          this.remove(element);
          break;
        case 'touch':
          this.touch(element);
          break;
        case 'mkdir':
          this.mkdir(element);
          break;
      }
    }
  }
  async toggle(f: FolderElement) {
    f.unfold = !f.unfold;
    if (f.unfold && f.lastChild === undefined) {
      await f.generateChildren();
    }
  }
  async rename(f: BaseElement) {
    const reFilename = (await this.nvim.callFunction('input', [
      `Do you want to rename to: ${f.path}/`,
      f.filename,
    ])) as string;
    FileSystem.renameFile(f.fullpath, `${f.path}/${reFilename}`);
  }
  async dirup(f: FolderElement) {
    const newRoot = FileSystem.createRoot(f.path);
    await newRoot.generateChildren();
    var point = newRoot.firstChild;
    this.nvim.outWriteLine(`${point.after.filename}  ${f.filename}`);
    while (true) {
      await this.nvim.outWriteLine(point.filename);
      if (point.filename === f.filename && point instanceof FolderElement) {
        point.unfold = true;
        point.firstChild = f.firstChild;
        point.lastChild = f.lastChild;
        break;
      }
      point = point.after;
      if (!point.after) break;
    }
    return newRoot;
  }
  async touch(f: BaseElement) {
    const file = (await this.nvim.callFunction('input', [
      `Touch a file in : ${f.path}/`,
    ])) as string;
    FileSystem.touchFile(`${f.path}/${file}`);
    this.update(f.parent);
  }
  async mkdir(f: BaseElement) {
    const folder = (await this.nvim.callFunction('input', [
      `Create a directory in : ${f.path}/`,
    ])) as string;
    if (!folder || folder.length === 0) {
      return;
    }
    const status = FileSystem.createDir(`${f.path}/${folder}`);
    if (status === false) {
    }
    this.update(f.parent);
  }
  async remove(f: BaseElement) {
    const before = f.before;
    const after = f.after;
    before.after = after;
    after.before = before;
  }

  /*
   * update folder children
   * will use in mkdir, touch, rename
   * */
  private async update(f: FolderElement) {
    const nf = FileSystem.createRoot(f.fullpath);
    var op = f.firstChild;
    var np = nf.firstChild;
  }
}
