import { BaseElement } from '../dom/BaseElement';
import { FolderElement } from '../dom/folder';
import { Neovim } from 'neovim';
import { FileElement } from '../dom/file';
import { FileSystem } from '../fs';
import { Vim } from '../vim';

function calcLen(p: BaseElement): number {
  var counter = 1;
  var point = p;
  while (point) {
    point = point.after;
    counter++;
  }
  return counter;
}

export class Action {
  nvim: Neovim;
  constructor(nvim: Neovim) {
    this.nvim = nvim;
  }
  async handle(element: BaseElement, to: string, store: Vim) {
    switch (to) {
      case 'operate':
        await this.operta(element);
        break;
      case 'rename':
        await this.rename(element);
        break;
      case 'remove':
        await this.remove(element);
        break;
      case 'touch':
        await this.touch(element);
        break;
      case 'mkdir':
        await this.mkdir(element);
        break;
      case 'dirup':
        await this.dirup(store);
        break;
      case 'hide':
        await this.hide(store);
        break;
    }
  }
  async operta(f: BaseElement) {
    if (f instanceof FileElement) this.nvim.command(`e ${f.fullpath}`);
    else await this.toggle(f as FolderElement);
  }
  async hide(store: Vim) {
    store.hidden = !store.hidden;
    this.nvim.setVar('node_tree_hide_files', store.hidden);
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
    await this.update(f.parent);
  }
  async dirup(store: Vim) {
    const root = store.root;
    const newRoot = FileSystem.createRoot(root.path);
    await newRoot.generateChildren();
    var point = newRoot.firstChild;
    await this.nvim.outWriteLine(`${point.filename}  ${root.filename}`);
    while (true) {
      await this.nvim.outWriteLine(point.filename);
      if (point.filename === root.filename && point instanceof FolderElement) {
        point.unfold = true;
        point.firstChild = root.firstChild;
        point.lastChild = root.lastChild;
        break;
      }
      point = point.after;
      if (!point.after) break;
    }
    store.root = newRoot;
  }
  async touch(f: BaseElement) {
    const file = (await this.nvim.callFunction('input', [
      `Touch a file in : ${f.path}/`,
    ])) as string;
    FileSystem.touchFile(`${f.path}/${file}`);
    await this.update(f.parent);
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
    await this.update(f.parent);
  }
  async remove(f: BaseElement) {
    const before = f.before;
    const after = f.after;
    before.after = after;
    after.before = before;
    FileSystem.delete(f.fullpath);
  }

  /*
   * update folder children
   * will use in mkdir, touch, rename
   * */
  private async update(f: FolderElement) {
    const nf = FileSystem.createRoot(f.fullpath);
    await nf.generateChildren();
    // var op = f.firstChild;
    // var dp = op;
    // var np = nf.firstChild;
    // while (np) {
    //   dp = op;
    //   while (dp) {
    //     if (
    //       dp.filename === np.filename &&
    //       dp instanceof FolderElement &&
    //       np instanceof FolderElement
    //     ) {
    //       op = dp;
    //       np.firstChild = dp.firstChild;
    //       np.lastChild = dp.lastChild;
    //       break;
    //     }
    //     dp = dp.after;
    //   }
    //   if (!dp) {
    //     break;
    //   }
    //   np = np.after;
    // }
    f.firstChild = nf.firstChild;
    f.lastChild = nf.lastChild;
  }
}
