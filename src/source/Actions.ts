import { ParseVNode } from './Fs';
import { Neovim } from 'neovim';
import { FolderNode, VNode } from './Node';
import { Option } from './Option';
import { UpdateRender } from './Render';
import { DFS, InquireNode, MergeVNode, Store } from './Store';
import { closeSync, openSync, statSync } from 'fs';
import { Log } from './Tools';
export async function HiddenAction() {
  Option.hidden_file = !Option.hidden_file;
  UpdateRender();
}

//
// edit a node.
// if file to edit in current window.
// if fold node will unfold or fold.
// WARN: Can not be used now.
export async function EditAction(pos: number) {
  const [vnode, status] = await InquireNode(pos);
  if (status === 1) {
    Store.nvim.setWindow(Store.window);
    Store.nvim.command(`:e ${vnode.path}/${vnode.filename}`);
  } else {
    Store.root = vnode;
    UpdateRender();
  }
}

//
// set the pwd to higher level root
//
// WARN: Have error before callback;(In condition)
export async function DirUpAction(pos: number) {
  Store.pwd = Store.pwd.slice(
    0,
    Store.pwd.length - Store.pwd.split('/').pop().length - 1
  );
  Store.root = await ParseVNode(Store.pwd);
  UpdateRender();
}

export async function TouchAction(pos: number) {
  let v: VNode = null;
  const condition = (vnode: VNode, counter: number, pos: number) => {
    if (
      counter < pos &&
      vnode instanceof FolderNode &&
      (vnode as FolderNode).children.length + counter >= pos
    ) {
      v = vnode;
      return false;
    } else if (counter >= pos && `${vnode.path}/${vnode.filename}` === v.path) {
      return true;
    } else {
      return false;
    }
  };
  const callback = async (vnode: VNode): Promise<VNode> => {
    const res = await RKInput(Store.nvim, `Touch a file: ${v.path}/`);
    if (res.length === 0) {
      return;
    }
    try {
      statSync(`${v.path}/${res}`);
    } catch (err) {
      closeSync(openSync(`${v.path}/${res}`, 'w'));
    }

    const newVNode = await ParseVNode(v.path);
    return MergeVNode(newVNode as FolderNode, vnode as FolderNode);
  };
  await DFS(Store.root, pos, condition, callback);
  Log('error');
}

export async function RKInput(nvim: Neovim, tips: string): Promise<string> {
  const res = (await nvim.callFunction('input', tips)) as string;
  return res;
}
