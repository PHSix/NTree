import { BaseElement } from '../dom/BaseElement';
import { FolderElement } from '../dom/folder';
import { Neovim } from 'neovim';
import { FileElement } from '../dom/file';
import { FileSystem } from '../fs';
import { Vim } from '../vim';

export class Action {
  client: Neovim;
  constructor(nvim: Neovim) {
    this.client = nvim;
  }
  async handle(element: BaseElement, to: string, store: Vim) {
    switch (to) {
      case 'operate':
        await this.opearte(element, store);
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
  async opearte(f: BaseElement, v: Vim) {
    if (f instanceof FileElement) {
      await this.edit(f, v);
    } else {
      await this.toggle(f as FolderElement);
    }
  }

  /*
   * edit file action
   */
  async edit(f: BaseElement, v: Vim) {
    if (await v.win.valid) {
      this.client.setWindow(v.win);
      this.client.command(`e ${f.fullpath}`);
    } else {
      // TODO:
    }
  }
  /*
   * action for change hide file status
   * */
  async hide(store: Vim) {
    store.hidden = !store.hidden;
    this.client.setVar('node_tree_hide_files', store.hidden);
  }

  /*
   * action for toggle folder
   * */
  async toggle(f: FolderElement) {
    f.unfold = !f.unfold;
    if (f.unfold && f.firstChild === undefined) {
      await f.generateChildren();
    }
  }
  async rename(f: BaseElement) {
    const reFilename = (await this.client.callFunction('input', [
      `Do you want to rename to: ${f.path}/`,
      f.filename,
    ])) as string;
    if (FileSystem.renameFile(f.fullpath, `${f.path}/${reFilename}`)) {
      await this.update(f.parent);
    } else {
      this.client.errWriteLine('[NodeTree] Rename failed');
    }
  }
  async dirup(store: Vim) {
    const root = store.root;
    const newRoot = FileSystem.createRoot(root.path);
    await newRoot.generateChildren();
    var point = newRoot.firstChild;
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
  /*
   * action for create a new file
   * */
  async touch(f: BaseElement) {
    var path = f.path;
    var refreshNode = f.parent;
    if (f instanceof FolderElement && f.unfold && !f.firstChild) {
      path = f.fullpath;
      refreshNode = f;
    }
    const file = (await this.client.callFunction('input', [
      `Touch a file in : ${path}/`,
    ])) as string;
    const status = FileSystem.touchFile(`${path}/${file}`);
    if (status === false) {
      this.client.errWriteLine(`[NodeTree] ${file} has exist.`);
      return;
    } else {
      this.client.outWriteLine(`[NodeTree] You has touch file: "${file}"`);
    }
    await this.update(refreshNode);
  }
  /*
   * action for make a new directory
   * */
  async mkdir(f: BaseElement) {
    var path = f.path;
    var refreshNode = f.parent;
    if (f instanceof FolderElement && f.unfold && !f.firstChild) {
      path = f.fullpath;
      refreshNode = f;
    }
    const folder = (await this.client.callFunction('input', [
      `Create a directory in : ${path}/`,
    ])) as string;
    if (!folder || folder.length === 0) {
      return;
    }
    const status = FileSystem.createDir(`${path}/${folder}`);
    if (status === false) {
      this.client.errWriteLine(`[NodeTree] ${folder} has exist.`);
      return;
    } else {
      this.client.outWriteLine(`[NodeTree] You has made directory "${folder}"`);
    }
    await this.update(refreshNode);
  }
  /*
   * action for remove a file or folder
   * */
  async remove(f: BaseElement) {
    const res = (await this.client.callFunction('input', [
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
