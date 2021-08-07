"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystem = void 0;
const promises_1 = require("fs/promises");
const file_1 = require("../dom/file");
const folder_1 = require("../dom/folder");
/*
 * TODO: 4 tasks
 *
 * */
class FileSystem {
    static createRoot(pwd) {
        const splitArr = pwd.split('/');
        const filename = splitArr.pop();
        const path = `/${splitArr.join('/')}`;
        const root = new folder_1.FolderElement(filename, path);
        return root;
    }
    /*
     * @return [folderArray: FolderElement[], fileArray: FileElement[]]
     * */
    static async findChildren(fullpath, parent) {
        const baseArr = await promises_1.readdir(fullpath);
        if (baseArr.length === 0) {
            return [null, null];
        }
        const stat_queue = [];
        const files = [];
        const folders = [];
        baseArr.forEach((filename) => {
            stat_queue.push(promises_1.stat(`${fullpath}/${filename}`));
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
    static createFile() { }
    static createFolder() { }
}
exports.FileSystem = FileSystem;
