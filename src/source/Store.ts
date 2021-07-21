import { InterfaceStore } from './TreeType';
import { VNode, FolderNode, FileNode } from './Node';
import { ParseVNode } from './Fs';
import { error } from 'console';
import { Log } from './Tools';

export let Store: InterfaceStore = {};

//
// query node in files tree.
// @return {[vnode,number]} When 1 is represented node is a file, 0 is represented node is a fold.
//                  Need update files tree views.
//
export async function InquireNode(pos: number): Promise<[VNode, number]> {
  const condition = (vnode: VNode, counter: number, pos: number): boolean => {
    if (counter === pos) {
      return true;
    }
    return false;
  };
  const callback = async (vnode: VNode): Promise<VNode> => {
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
    return v;
  };

  const vNode = await DFS(Store.root, pos, condition, callback);
  if (vNode.key !== Store.root.key) {
    return [vNode, 1];
  } else {
    return [null, 0];
  }
}

export async function DFS(
  vnode: VNode,
  pos: number,
  condition: (vnode: VNode, counter: number, pos: number) => boolean,
  callback: (vnode: VNode) => Promise<VNode>
): Promise<VNode> {
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
    if (condition(vnode, counter, pos)) {
      vnode = await callback(vnode);
      break;
    }
    if (vnodeArr.length === 0) {
      throw error('DFS queue error!');
    }
    vnode = vnodeArr.shift();
  }
  return VDom;
}

//
// Used in delete, touch, mkdir, dirup, rename actions
//
export function MergeVNode(
  newVNode: FolderNode,
  oldVNode: FolderNode
  // callback: (item: VNode, index: number) => VNode
): VNode {
  // add
  if (newVNode.children.length > oldVNode.children.length) {
    newVNode.children.forEach((vnode, index) => {
      if (vnode.filename !== oldVNode[index]) {
        oldVNode.children.splice(index, 0, vnode);
        return oldVNode;
      }
    });
  }
  // delete

  // if (newVNode.key !== oldVNode.key) {
  //   if (newVNode.path.split('/').length < oldVNode.path.split('/').length) {
  //     // dir up
  //   } else {
  //     // etc
  //   }
  // } else {
  //   // newVNode and oldVNode are in same level directory.
  //   if (newVNode.children.length === oldVNode.children.length) {
  //     // rename
  //     newVNode.children.forEach((vnode, index) => {
  //       if (vnode.filename !== oldVNode.children[index].filename) {
  //         oldVNode.filename = vnode.filename;
  //         return oldVNode;
  //       }
  //     });
  //   } else if (newVNode.children.length > oldVNode.children.length) {
  //     // mkdir or touch
  //     newVNode.children.forEach((vnode, index) => {
  //       if (vnode.filename !== oldVNode.children[index].filename) {
  //         oldVNode.children.splice(index, 0, vnode);
  //         return oldVNode;
  //       }
  //     });
  //   } else {
  //     // delete
  //     newVNode.children.forEach((vnode, index) => {
  //       if (
  //         oldVNode.children[index] instanceof FileNode ===
  //           vnode instanceof FileNode &&
  //         oldVNode.children[index].filename === vnode.filename
  //       ) {
  //         return oldVNode;
  //       }
  //     });
  //   }
  // }
  return oldVNode;
}
