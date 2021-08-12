import { BaseElement } from '../dom/BaseElement';
import { FolderElement } from '../dom/folder';
import { Neovim } from 'neovim';
import { FileElement } from '../dom/file';
import { FileSystem } from '../fs';
import { Vim } from '../vim';

export class Action {
  nvim: Neovim;
  constructor(nvim: Neovim) {
    this.nvim = nvim;
  }
  async handle(element: BaseElement, to: string, store: Vim) {
    switch (to) {
      case 'operate':
        await this.opearte(element);
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
  async opearte(f: BaseElement) {
    if (f instanceof FileElement) {
      this.nvim.command(`e ${f.fullpath}`);
    } else {
      await this.toggle(f as FolderElement);
    }
  }
  async hide(store: Vim) {
    store.hidden = !store.hidden;
    this.nvim.setVar('node_tree_hide_files', store.hidden);
  }
  async toggle(f: FolderElement) {
    f.unfold = !f.unfold;
    if (f.unfold && f.firstChild === undefined) {
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
    const status = FileSystem.touchFile(`${f.path}/${file}`);
    if (status === false) {
      this.nvim.errWriteLine(`[NodeTree] ${file} has exist.`);
      return;
    } else {
      this.nvim.outWriteLine(`[NodeTree] You has touch file: "${file}"`);
    }
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
      this.nvim.errWriteLine(`[NodeTree] ${folder} has exist.`);
      return;
    } else {
      this.nvim.outWriteLine(`[NodeTree] You has made directory "${folder}"`);
    }
    await this.update(f.parent);
  }
  async remove(f: BaseElement) {
    const res = (await this.nvim.callFunction('input', [
      `Do your want to delete :${f.fullpath}  | [y/N] `,
    ])) as string;
    if (res.length === 0) {
      return;
    } else if (res === 'y' || res === 'yes') {
      const after = f.after;
      const before = f.before;
      if (before) {
        before.after = after;
      }
      if (after) {
        after.before = before;
      }
      FileSystem.delete(f.fullpath);
    } else {
      return;
    }
  }

  /*
   * update folder children
   * will use in mkdir, touch, rename
   * */
  private async update(f: FolderElement) {
    var op = f.firstChild;
    f.firstChild = null;
    f.lastChild = null;
    await f.generateChildren();
    var np = f.firstChild;

    while (true) {
      if (
        op &&
        np &&
        op instanceof FolderElement &&
        np instanceof FolderElement
      ) {
        if (op.filename > np.filename) {
          np = np.after;
        } else if (op.filename > np.filename) {
          op = op.after;
        } else {
          if (op.unfold) {
            np.unfold = true;
            np.applyChildren(op.firstChild, op.lastChild);
          }
          op = op.after;
          np = np.after;
        }
      } else {
        break;
      }
    }
  }
}
