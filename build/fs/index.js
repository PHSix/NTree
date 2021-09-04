"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystem = void 0;
const promises_1 = require("fs/promises");
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const file_1 = require("../dom/file");
const folder_1 = require("../dom/folder");
class FileSystem {
    static renameFile(oldpath, newpath) {
        try {
            (0, fs_1.renameSync)(oldpath, newpath);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    static createRoot(pwd) {
        const splitArr = pwd.split('/');
        const filename = splitArr.pop();
        const path = `${splitArr.join('/')}`;
        const root = new folder_1.FolderElement(filename, path);
        return root;
    }
    /*
     * @return [folderArray: FolderElement[], fileArray: FileElement[]]
     * */
    static async findChildren(fullpath, parent) {
        const baseArr = await (0, promises_1.readdir)(fullpath);
        const files = [];
        const folders = [];
        if (baseArr.length === 0) {
            return [folders, files];
        }
        const stat_queue = [];
        baseArr.forEach((filename) => {
            stat_queue.push((0, promises_1.stat)(`${fullpath}/${filename}`));
        });
        await Promise.all(stat_queue).then((result) => {
            result.forEach((item, index) => {
                if (item.isDirectory() === true) {
                    folders.push(new folder_1.FolderElement(baseArr[index], fullpath, parent));
                }
                else {
                    files.push(new file_1.FileElement(baseArr[index], fullpath, parent));
                }
            });
        });
        return [folders, files];
    }
    static touchFile(path) {
        try {
            (0, fs_1.statSync)(path);
            return false;
        }
        catch (err) {
            (0, fs_1.closeSync)((0, fs_1.openSync)(path, 'w'));
            return true;
        }
    }
    static createDir(path) {
        try {
            (0, fs_1.mkdirSync)(path);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    static delete(path) {
        try {
            (0, child_process_1.execSync)(`rm -rf ${path}`);
            return true;
        }
        catch (err) {
            return false;
        }
    }
}
exports.FileSystem = FileSystem;
