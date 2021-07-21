import { InterfaceStore } from './TreeType';
import { VNode, FolderNode, FileNode } from './Node';
import { ParseVNode } from './Fs';

export let Store: InterfaceStore = {};

//
// query node in files tree.
// @return {[vnode,number]} When 1 is represented node is a file, 0 is represented node is a fold.
//                  Need update files tree views.
//
export async function InquireNode(pos: number): Promise<[VNode, number]> {
  const vNode = await DFS(Store.root, pos);
  if (vNode.key !== Store.root.key) {
    return [vNode, 1];
  } else {
    Store.root = vNode;
    return [null, 0];
  }
}

async function DFS(vnode: VNode, pos: number): Promise<VNode> {
  let VDom = vnode;
  let counter = 0;
  const vnodeArr: VNode[] = [];
  while (true) {
    if (vnode instanceof FolderNode && vnode.isUnfold === true) {
      vnodeArr.splice(0, 0, ...vnode.children);
    }
    if (vnode.filename[0] !== '.') {
      counter += 1;
    }
    if (counter === pos) {
      if (vnode instanceof FileNode) {
        return vnode;
      }
      let v = vnode as FolderNode;
      v.isUnfold = !v.isUnfold;
      if (v.children.length === 0) {
        const f = (await ParseVNode(
          `${v.path}/${v.filename}`,
          v.key
        )) as FolderNode;
        v.children = f.children;
      }
      break;
    }
    vnode = vnodeArr.shift();
  }
  return VDom;
}

export async function MergeVNode() {}
