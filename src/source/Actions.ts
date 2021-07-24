import { ParseVNode } from './Fs';
import { FileNode, FolderNode, VNode } from './Node';
import { Option } from './Option';
import { UpdateRender } from './Render';
import { Store } from './Store';
import {
  DFS,
  UpdateNodeByPos,
  UpdateNodeByFullPath,
  MergeVNode,
} from './Utils';
import { closeSync, mkdirSync, openSync, renameSync, statSync } from 'fs';
import { Log, Logm } from './Tools';
export async function HiddenAction() {
  Option.hidden_file = !Option.hidden_file;
  UpdateRender();
}

//
// edit a node.
// if file to edit in current window.
// if fold node will unfold or fold.
export async function EditAction(pos: number) {
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

  const [, vnode] = await UpdateNodeByPos(pos, callback);
  if (vnode instanceof FileNode) {
    Store.nvim.setWindow(Store.window);
    Store.nvim.command(`:e ${vnode.path}/${vnode.filename}`);
  } else {
    UpdateRender();
  }
}

//
// set the pwd to higher level root
//
export async function DirUpAction(_: number) {
  Store.pwd = Store.pwd.slice(
    0,
    Store.pwd.length - Store.pwd.split('/').pop().length - 1
  );
  const newNode = (await ParseVNode(Store.pwd)) as FolderNode;

  newNode.children = MergeVNode([Store.root], newNode.children);

  Store.root = newNode;
  UpdateRender();
}

//
// make a directory
//
export async function MkdirAction(pos: number) {
  const callback = async (vnode: VNode): Promise<VNode> => {
    const newDir = (await Store.nvim.callFunction(
      'input',
      `Make a directory: ${vnode.path}/`
    )) as string;
    if (newDir.length === 0) {
      return;
    }
    mkdirSync(`${vnode.path}/${newDir}`);

    return vnode;
  };
  const [, vnode] = await UpdateNodeByPos(pos, callback);
  const updeteNodePath = `${vnode.path}`;
  const newNode = await ParseVNode(updeteNodePath);
  const callback2 = async (vnode: VNode): Promise<VNode> => {
    (vnode as FolderNode).children = MergeVNode(
      (vnode as FolderNode).children,
      (newNode as FolderNode).children
    );
    return vnode;
  };
  await UpdateNodeByFullPath(newNode, callback2);
  UpdateRender();
}

//
// touch a file
//
export async function TouchAction(pos: number) {
  const callback = async (vnode: VNode): Promise<VNode> => {
    const newFileName = (await Store.nvim.callFunction(
      'input',
      `Touch a file: ${vnode.path}/`
    )) as string;
    if (newFileName.length === 0) {
      return;
    }
    try {
      statSync(`${vnode.path}/${newFileName}`);
    } catch (err) {
      closeSync(openSync(`${vnode.path}/${newFileName}`, 'w'));
    }
    return vnode;
  };
  const [, vnode] = await UpdateNodeByPos(pos, callback);
  const updeteNodePath = `${vnode.path}`;
  const newNode = await ParseVNode(updeteNodePath);
  const callback2 = async (vnode: VNode): Promise<VNode> => {
    (vnode as FolderNode).children = MergeVNode(
      (vnode as FolderNode).children,
      (newNode as FolderNode).children
    );
    return vnode;
  };
  await UpdateNodeByFullPath(newNode, callback2);
  UpdateRender();
}

export async function RenameAction(pos: number) {
  const callback = async (vnode: VNode): Promise<VNode> => {
    const newFileName = (await Store.nvim.callFunction('input', [
      `Rename to: ${vnode.path}/`,
      vnode.filename,
    ])) as string;
    if (newFileName.length === 0) {
      return;
    }
    renameSync(
      `${vnode.path}/${vnode.filename}`,
      `${vnode.path}/${newFileName}`
    );
    return vnode;
  };
  const [, vnode] = await UpdateNodeByPos(pos, callback);
  const updeteNodePath = `${vnode.path}`;
  const newNode = await ParseVNode(updeteNodePath);
  const callback2 = async (vnode: VNode): Promise<VNode> => {
    (vnode as FolderNode).children = MergeVNode(
      (vnode as FolderNode).children,
      (newNode as FolderNode).children
    );
    return vnode;
  };
  await UpdateNodeByFullPath(newNode, callback2);
  UpdateRender();
}
