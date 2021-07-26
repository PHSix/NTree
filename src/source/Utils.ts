import { Store } from './Store';
import { VNode, FolderNode } from './Node';
import { error } from 'console';
import { Option } from './Option';
/*
 * query node in files tree.
 *@return {[vnode,number]} When 1 is represented node is a file, 0 is represented node is a fold. Need update files tree views.
 * */

export async function UpdateNodeByPos(
  pos: number,
  callback: (vnode: VNode) => Promise<VNode>
): Promise<[VNode, VNode]> {
  const condition = (_: VNode, counter: number, pos: number): boolean => {
    if (counter === pos) {
      return true;
    }
    return false;
  };

  return await DFS(Store.root, pos, condition, callback);
}

export async function UpdateNodeByFullPath(
  ivnode: VNode,
  callback: (vnode: VNode) => Promise<VNode>
): Promise<[VNode, VNode]> {
  const condition = (vnode: VNode, couter: number, pos: number): boolean => {
    if (ivnode.filename === vnode.filename && ivnode.path === vnode.path) {
      return true;
    }
    return false;
  };
  return await DFS(Store.root, 0, condition, callback);
}

export async function DFS(
  vnode: VNode,
  pos: number,
  condition: (vnode: VNode, counter: number, pos: number) => boolean,
  callback: (vnode: VNode) => Promise<VNode>
): Promise<[VNode, VNode]> {
  let VDom = vnode;
  let counter = 0;
  const vnodeArr: VNode[] = [];
  while (true) {
    if (vnode instanceof FolderNode && vnode.isUnfold === true) {
      vnodeArr.splice(0, 0, ...vnode.children);
    }
    if (Option.hide_file === false) {
      counter += 1;
    } else if (Option.hide_file === true && vnode.filename[0] !== '.') {
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
  return [VDom, vnode];
}

/*
 * Used in delete, touch, mkdir, dirup, rename actions
 * */

export function MergeVNode(
  oldChildren: VNode[],
  newChildren: VNode[]
): VNode[] {
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
