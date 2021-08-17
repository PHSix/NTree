"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
const folder_1 = require("../dom/folder");
const file_1 = require("../dom/file");
const fs_1 = require("../fs");
class Action {
    constructor(nvim) {
        this.client = nvim;
    }
    async handle(element, to, store) {
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
    async opearte(f, v) {
        if (f instanceof file_1.FileElement) {
            await this.edit(f, v);
        }
        else {
            await this.toggle(f);
        }
    }
    async edit(f, v) {
        if (await v.win.valid) {
            this.client.setWindow(v.win);
            this.client.command(`e ${f.fullpath}`);
        }
        else {
            // TODO:
        }
    }
    async hide(store) {
        store.hidden = !store.hidden;
        this.client.setVar('node_tree_hide_files', store.hidden);
    }
    async toggle(f) {
        f.unfold = !f.unfold;
        if (f.unfold && f.firstChild === undefined) {
            await f.generateChildren();
        }
    }
    async rename(f) {
        const reFilename = (await this.client.callFunction('input', [
            `Do you want to rename to: ${f.path}/`,
            f.filename,
        ]));
        fs_1.FileSystem.renameFile(f.fullpath, `${f.path}/${reFilename}`);
        await this.update(f.parent);
    }
    async dirup(store) {
        const root = store.root;
        const newRoot = fs_1.FileSystem.createRoot(root.path);
        await newRoot.generateChildren();
        var point = newRoot.firstChild;
        await this.client.outWriteLine(`${point.filename}  ${root.filename}`);
        while (true) {
            if (point.filename === root.filename && point instanceof folder_1.FolderElement) {
                point.unfold = true;
                point.firstChild = root.firstChild;
                point.lastChild = root.lastChild;
                break;
            }
            point = point.after;
            if (!point.after)
                break;
        }
        store.root = newRoot;
    }
    async touch(f) {
        const file = (await this.client.callFunction('input', [
            `Touch a file in : ${f.path}/`,
        ]));
        const status = fs_1.FileSystem.touchFile(`${f.path}/${file}`);
        if (status === false) {
            this.client.errWriteLine(`[NodeTree] ${file} has exist.`);
            return;
        }
        else {
            this.client.outWriteLine(`[NodeTree] You has touch file: "${file}"`);
        }
        await this.update(f.parent);
    }
    async mkdir(f) {
        const folder = (await this.client.callFunction('input', [
            `Create a directory in : ${f.path}/`,
        ]));
        if (!folder || folder.length === 0) {
            return;
        }
        const status = fs_1.FileSystem.createDir(`${f.path}/${folder}`);
        if (status === false) {
            this.client.errWriteLine(`[NodeTree] ${folder} has exist.`);
            return;
        }
        else {
            this.client.outWriteLine(`[NodeTree] You has made directory "${folder}"`);
        }
        await this.update(f.parent);
    }
    async remove(f) {
        const res = (await this.client.callFunction('input', [
            `Do your want to delete :${f.fullpath}  | [y/N] `,
        ]));
        if (res.length === 0) {
            return;
        }
        else if (res === 'y' || res === 'yes') {
            const after = f.after;
            const before = f.before;
            if (before) {
                before.after = after;
            }
            if (after) {
                after.before = before;
            }
            fs_1.FileSystem.delete(f.fullpath);
        }
        else {
            return;
        }
    }
    /*
     * update folder children
     * will use in mkdir, touch, rename
     * */
    async update(f) {
        var op = f.firstChild;
        f.firstChild = null;
        f.lastChild = null;
        await f.generateChildren();
        var np = f.firstChild;
        while (true) {
            if (op &&
                np &&
                op instanceof folder_1.FolderElement &&
                np instanceof folder_1.FolderElement) {
                if (op.filename > np.filename) {
                    np = np.after;
                }
                else if (op.filename > np.filename) {
                    op = op.after;
                }
                else {
                    if (op.unfold) {
                        np.unfold = true;
                        np.applyChildren(op.firstChild, op.lastChild);
                    }
                    op = op.after;
                    np = np.after;
                }
            }
            else {
                break;
            }
        }
    }
}
exports.Action = Action;
