"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeVNode = exports.DFS = exports.UpdateNodeByFullPath = exports.UpdateNodeByPos = void 0;
const Store_1 = require("./Store");
const Node_1 = require("./Node");
const console_1 = require("console");
const Option_1 = require("./Option");
/*
 * query node in files tree.
 *@return {[vnode,number]} When 1 is represented node is a file, 0 is represented node is a fold. Need update files tree views.
 * */
async function UpdateNodeByPos(pos, callback) {
    const condition = (_, counter, pos) => {
        if (counter === pos) {
            return true;
        }
        return false;
    };
    return await DFS(Store_1.Store.root, pos, condition, callback);
}
exports.UpdateNodeByPos = UpdateNodeByPos;
async function UpdateNodeByFullPath(ivnode, callback) {
    const condition = (vnode, couter, pos) => {
        if (ivnode.filename === vnode.filename && ivnode.path === vnode.path) {
            return true;
        }
        return false;
    };
    return await DFS(Store_1.Store.root, 0, condition, callback);
}
exports.UpdateNodeByFullPath = UpdateNodeByFullPath;
async function DFS(vnode, pos, condition, callback) {
    let VDom = vnode;
    let counter = 0;
    const vnodeArr = [];
    while (true) {
        if (vnode instanceof Node_1.FolderNode && vnode.isUnfold === true) {
            vnodeArr.splice(0, 0, ...vnode.children);
        }
        if (Option_1.Option.hide_file === false) {
            counter += 1;
        }
        else if (Option_1.Option.hide_file === true && vnode.filename[0] !== '.') {
            counter += 1;
        }
        if (condition(vnode, counter, pos)) {
            vnode = await callback(vnode);
            break;
        }
        if (vnodeArr.length === 0) {
            throw console_1.error('DFS queue error!');
        }
        vnode = vnodeArr.shift();
    }
    return [VDom, vnode];
}
exports.DFS = DFS;
/*
 * Used in delete, touch, mkdir, dirup, rename actions
 * */
function MergeVNode(oldChildren, newChildren) {
    for (let i = 0; i < newChildren.length; i++) {
        const n = newChildren[i];
        newChildren[i] = oldChildren.find((vnode) => {
            return vnode.filename === newChildren[i].filename;
        });
        if (newChildren[i] === undefined) {
            newChildren[i] = n;
        }
    }
    return newChildren;
}
exports.MergeVNode = MergeVNode;
