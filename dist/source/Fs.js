"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsePwd = exports.ParseVNode = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const Node_1 = require("./Node");
/*
 * Folder constructor
 * */
function newFolder(path, filename, isUnfold, key = Symbol()) {
    const f = new Node_1.FolderNode(filename, path, isUnfold, [], key);
    return f;
}
/*
 * File constructor
 * */
function newFile(path, filename, key = Symbol()) {
    const f = new Node_1.FileNode(filename, path, key);
    return f;
}
/*
  * Parse a path to a VDom tree and return
  * @param path
  * @param key
  * @return Promise<VNode>
  *
  * */
async function ParseVNode(pwd, key = Symbol()) {
    const [dirpath, dirname] = ParsePwd(pwd);
    const vDom = newFolder(dirpath, dirname, true, key);
    const path = `${vDom.path}/${vDom.filename}`;
    const files = fs_1.readdirSync(path);
    const [sortfolders, sortfiles] = await sortFiles(path, files);
    // push folder node at first
    vDom.children.push(...sortfolders.map((filename) => {
        return newFolder(path, filename, false);
    }));
    // then push file node
    vDom.children.push(...sortfiles.map((filename) => {
        return newFile(path, filename);
    }));
    return vDom;
}
exports.ParseVNode = ParseVNode;
/*
  * To sorting file and folder.
  * @return [Folders, Files]
  * */
async function sortFiles(pwd, files) {
    const resFolders = [];
    const resFiles = [];
    const file_queue = [];
    files.forEach((file) => {
        file_queue.push(promises_1.stat(`${pwd}/${file}`));
    });
    await Promise.all(file_queue).then((result) => {
        result.forEach((s, index) => {
            if (s.isDirectory()) {
                resFolders.push(files[index]);
            }
            else {
                resFiles.push(files[index]);
            }
        });
    });
    return [resFolders, resFiles];
}
/*
  * To parse a full path.
  * example:
  *  input:
  *    pwd = '/home/ph/Desktop/english.md'
  *  result:
  *    filename = english.md
  *    path = /home/ph/Desktop
  * */
function ParsePwd(pwd) {
    let res = pwd.split('/');
    let filename = res[res.length - 1];
    let path = pwd.slice(0, pwd.length - filename.length - 1);
    return [path, filename];
}
exports.ParsePwd = ParsePwd;
