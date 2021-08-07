"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveAction = exports.RenameAction = exports.TouchAction = exports.MkdirAction = exports.DirUpAction = exports.EditAction = exports.HiddenAction = void 0;
const Fs_1 = require("./Fs");
const Node_1 = require("./Node");
const Option_1 = require("./Option");
const Render_1 = require("./Render");
const Store_1 = require("./Store");
const Utils_1 = require("./Utils");
const fs_1 = require("fs");
const child_process_1 = require("child_process");
async function HiddenAction() {
    Option_1.Option.hide_file = !Option_1.Option.hide_file;
    Render_1.Render();
}
exports.HiddenAction = HiddenAction;
/*
 * edit a node.
 * if file to edit in current window.
 * if fold node will unfold or fold.
 * */
async function EditAction(pos) {
    const callback = async (vnode) => {
        if (vnode instanceof Node_1.FileNode) {
            return vnode;
        }
        let v = vnode;
        v.isUnfold = !v.isUnfold;
        if (v.children.length === 0) {
            const f = (await Fs_1.ParseVNode(`${v.path}/${v.filename}`, v.key));
            v.children = f.children;
        }
        return v;
    };
    const [, vnode] = await Utils_1.UpdateNodeByPos(pos, callback);
    if (vnode instanceof Node_1.FileNode) {
        Store_1.Store.nvim.setWindow(Store_1.Store.window);
        Store_1.Store.nvim.command(`:e ${vnode.path}/${vnode.filename}`);
    }
    else {
        Render_1.Render();
    }
}
exports.EditAction = EditAction;
/*
 * set the pwd to higher level root
 * */
async function DirUpAction(_) {
    Store_1.Store.pwd = Store_1.Store.pwd.slice(0, Store_1.Store.pwd.length - Store_1.Store.pwd.split('/').pop().length - 1);
    const newNode = (await Fs_1.ParseVNode(Store_1.Store.pwd));
    newNode.children = Utils_1.MergeVNode([Store_1.Store.root], newNode.children);
    Store_1.Store.root = newNode;
    Render_1.Render();
}
exports.DirUpAction = DirUpAction;
/*
 * make a directory
 * */
async function MkdirAction(pos) {
    let createPath = '';
    const callback = async (vnode) => {
        createPath = `${vnode.path}`;
        if (vnode instanceof Node_1.FolderNode && vnode.isUnfold === true) {
            createPath = `${vnode.path}/${vnode.filename}`;
        }
        const newDir = (await Store_1.Store.nvim.callFunction('input', `Make a directory: ${createPath}/`));
        if (newDir.length === 0) {
            return;
        }
        fs_1.mkdirSync(`${createPath}/${newDir}`);
        return vnode;
    };
    await Utils_1.UpdateNodeByPos(pos, callback);
    const newNode = await Fs_1.ParseVNode(createPath);
    const callback2 = async (vnode) => {
        vnode.children = Utils_1.MergeVNode(vnode.children, newNode.children);
        return vnode;
    };
    await Utils_1.UpdateNodeByFullPath(newNode, callback2);
    Render_1.Render();
}
exports.MkdirAction = MkdirAction;
/*
 * touch a file
 * */
async function TouchAction(pos) {
    let createPath = '';
    const callback = async (vnode) => {
        createPath = `${vnode.path}`;
        if (vnode instanceof Node_1.FolderNode && vnode.isUnfold === true) {
            createPath = `${vnode.path}/${vnode.filename}`;
        }
        const touchFileName = (await Store_1.Store.nvim.callFunction('input', `Touch a file: ${createPath}/`));
        if (touchFileName.length === 0) {
            return;
        }
        try {
            fs_1.statSync(`${createPath}/${touchFileName}`);
        }
        catch (err) {
            fs_1.closeSync(fs_1.openSync(`${createPath}/${touchFileName}`, 'w'));
        }
        return vnode;
    };
    await Utils_1.UpdateNodeByPos(pos, callback);
    const newNode = await Fs_1.ParseVNode(createPath);
    Store_1.Store.nvim.outWrite(createPath + ' | ' + newNode.path + '\n');
    const callback2 = async (vnode) => {
        vnode.children = Utils_1.MergeVNode(vnode.children, newNode.children);
        return vnode;
    };
    await Utils_1.UpdateNodeByFullPath(newNode, callback2);
    Render_1.Render();
}
exports.TouchAction = TouchAction;
async function RenameAction(pos) {
    const callback = async (vnode) => {
        const newFileName = (await Store_1.Store.nvim.callFunction('input', [
            `Rename to: ${vnode.path}/`,
            vnode.filename,
        ]));
        if (newFileName.length === 0) {
            return;
        }
        fs_1.renameSync(`${vnode.path}/${vnode.filename}`, `${vnode.path}/${newFileName}`);
        return vnode;
    };
    const [, vnode] = await Utils_1.UpdateNodeByPos(pos, callback);
    const updeteNodePath = `${vnode.path}`;
    const newNode = await Fs_1.ParseVNode(updeteNodePath);
    const callback2 = async (vnode) => {
        vnode.children = Utils_1.MergeVNode(vnode.children, newNode.children);
        return vnode;
    };
    await Utils_1.UpdateNodeByFullPath(newNode, callback2);
    Render_1.Render();
}
exports.RenameAction = RenameAction;
async function RemoveAction(pos) {
    let ct = false;
    const callback = async (vnode) => {
        const isDelete = (await Store_1.Store.nvim.callFunction('input', `Do you want to delete: ${vnode.path}/${vnode.filename} ? [Y/n]`));
        if (isDelete.length === 0 || isDelete === 'y' || isDelete === 'Y') {
            child_process_1.execSync(`rm -rf ${vnode.path}/${vnode.filename}`);
            ct = true;
        }
        return vnode;
    };
    const [, vnode] = await Utils_1.UpdateNodeByPos(pos, callback);
    if (ct === false) {
        return;
    }
    const updeteNodePath = `${vnode.path}`;
    const newNode = await Fs_1.ParseVNode(updeteNodePath);
    const callback2 = async (vnode) => {
        vnode.children = Utils_1.MergeVNode(vnode.children, newNode.children);
        return vnode;
    };
    await Utils_1.UpdateNodeByFullPath(newNode, callback2);
    Render_1.Render();
}
exports.RemoveAction = RemoveAction;
