"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
const folder_1 = require("../dom/folder");
const file_1 = require("../dom/file");
const fs_1 = require("../fs");
function calcLen(p) {
    var counter = 1;
    var point = p;
    while (point) {
        point = point.after;
        counter++;
    }
    return counter;
}
class Action {
    constructor(nvim) {
        this.nvim = nvim;
    }
    async handle(element, to) {
        if (to === 'operate') {
            if (element instanceof file_1.FileElement) {
                this.nvim.command(`e ${element.fullpath}`);
            }
            else {
                await this.toggle(element);
            }
        }
        else {
            switch (to) {
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
            }
        }
    }
    async toggle(f) {
        f.unfold = !f.unfold;
        if (f.unfold && f.lastChild === undefined) {
            await f.generateChildren();
        }
    }
    async rename(f) {
        const reFilename = (await this.nvim.callFunction('input', [
            `Do you want to rename to: ${f.path}/`,
            f.filename,
        ]));
        fs_1.FileSystem.renameFile(f.fullpath, `${f.path}/${reFilename}`);
        await this.update(f.parent);
    }
    async dirup(f) {
        const newRoot = fs_1.FileSystem.createRoot(f.path);
        await newRoot.generateChildren();
        var point = newRoot.firstChild;
        this.nvim.outWriteLine(`${point.after.filename}  ${f.filename}`);
        while (true) {
            await this.nvim.outWriteLine(point.filename);
            if (point.filename === f.filename && point instanceof folder_1.FolderElement) {
                point.unfold = true;
                point.firstChild = f.firstChild;
                point.lastChild = f.lastChild;
                break;
            }
            point = point.after;
            if (!point.after)
                break;
        }
        return newRoot;
    }
    async touch(f) {
        const file = (await this.nvim.callFunction('input', [
            `Touch a file in : ${f.path}/`,
        ]));
        fs_1.FileSystem.touchFile(`${f.path}/${file}`);
        await this.update(f.parent);
    }
    async mkdir(f) {
        const folder = (await this.nvim.callFunction('input', [
            `Create a directory in : ${f.path}/`,
        ]));
        if (!folder || folder.length === 0) {
            return;
        }
        const status = fs_1.FileSystem.createDir(`${f.path}/${folder}`);
        if (status === false) {
        }
        await this.update(f.parent);
    }
    async remove(f) {
        const before = f.before;
        const after = f.after;
        before.after = after;
        after.before = before;
        fs_1.FileSystem.delete(f.fullpath);
    }
    /*
     * update folder children
     * will use in mkdir, touch, rename
     * */
    async update(f) {
        const nf = fs_1.FileSystem.createRoot(f.fullpath);
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
exports.Action = Action;
