import { ParseVNode } from './Fs';
import { FileNode, FolderNode, VNode } from './Node';
import { Option } from './Option';
import { Render } from './Render';
import { Store } from './Store';
import { UpdateNodeByPos, UpdateNodeByFullPath, MergeVNode } from './Utils';
import { closeSync, mkdirSync, openSync, renameSync, statSync } from 'fs';
import { execSync } from 'child_process';
export async function HiddenAction() {
  Option.hide_file = !Option.hide_file;
  Render();
}

/*
 * edit a node.
 * if file to edit in current window.
 * if fold node will unfold or fold.
 * */
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
    Render();
  }
}

/*
 * set the pwd to higher level root
 * */

export async function DirUpAction(_: number) {
  Store.pwd = Store.pwd.slice(
    0,
    Store.pwd.length - Store.pwd.split('/').pop().length - 1
  );
  const newNode = (await ParseVNode(Store.pwd)) as FolderNode;

  newNode.children = MergeVNode([Store.root], newNode.children);

  Store.root = newNode;
  Render();
}

/*
 * make a directory
 * */
export async function MkdirAction(pos: number) {
  let createPath = '';
  const callback = async (vnode: VNode): Promise<VNode> => {
    createPath = `${vnode.path}`;
    if (vnode instanceof FolderNode && vnode.isUnfold === true) {
      createPath = `${vnode.path}/${vnode.filename}`;
    }
    const newDir = (await Store.nvim.callFunction(
      'input',
      `Make a directory: ${createPath}/`
    )) as string;
    if (newDir.length === 0) {
      return;
    }
    mkdirSync(`${createPath}/${newDir}`);

    return vnode;
  };
  await UpdateNodeByPos(pos, callback);
  const newNode = await ParseVNode(createPath);
  const callback2 = async (vnode: VNode): Promise<VNode> => {
    (vnode as FolderNode).children = MergeVNode(
      (vnode as FolderNode).children,
      (newNode as FolderNode).children
    );
    return vnode;
  };
  await UpdateNodeByFullPath(newNode, callback2);
  Render();
}

/*
 * touch a file
 * */
export async function TouchAction(pos: number) {
  let createPath = '';
  const callback = async (vnode: VNode): Promise<VNode> => {
    createPath = `${vnode.path}`;
    if (vnode instanceof FolderNode && vnode.isUnfold === true) {
      createPath = `${vnode.path}/${vnode.filename}`;
    }
    const touchFileName = (await Store.nvim.callFunction(
      'input',
      `Touch a file: ${createPath}/`
    )) as string;
    if (touchFileName.length === 0) {
      return;
    }
    try {
      statSync(`${createPath}/${touchFileName}`);
    } catch (err) {
      closeSync(openSync(`${createPath}/${touchFileName}`, 'w'));
    }
    return vnode;
  };
  await UpdateNodeByPos(pos, callback);
  const newNode = await ParseVNode(createPath);
  Store.nvim.outWrite(createPath + ' | ' + newNode.path + '\n');
  const callback2 = async (vnode: VNode): Promise<VNode> => {
    (vnode as FolderNode).children = MergeVNode(
      (vnode as FolderNode).children,
      (newNode as FolderNode).children
    );
    return vnode;
  };
  await UpdateNodeByFullPath(newNode, callback2);
  Render();
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
  Render();
}
export async function RemoveAction(pos: number) {
  let ct = false;
  const callback = async (vnode: VNode): Promise<VNode> => {
    const isDelete = (await Store.nvim.callFunction(
      'input',
      `Do you want to delete: ${vnode.path}/${vnode.filename} ? [Y/n]`
    )) as string;
    if (isDelete.length === 0 || isDelete === 'y' || isDelete === 'Y') {
      execSync(`rm -rf ${vnode.path}/${vnode.filename}`);
      ct = true;
    }
    return vnode;
  };

  const [, vnode] = await UpdateNodeByPos(pos, callback);
  if (ct === false) {
    return;
  }
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
  Render();
}
