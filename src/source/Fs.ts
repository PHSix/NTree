import { readdirSync, Stats } from 'fs';
import { stat } from 'fs/promises';
import { Log } from './Tools';
import { FileNode, FolderNode, VNode } from './Node';

type FileName = string;
type Path = string;
type Folders = string[];
type Files = string[];

// Folder constructor
function newFolder(
  path: string,
  filename: string,
  isUnfold: boolean,
  key: symbol = Symbol()
): FolderNode {
  const f = new FolderNode(filename, path, isUnfold, [], key);
  return f;
}

// File constructor
function newFile(
  path: string,
  filename: string,
  key: symbol = Symbol()
): FileNode {
  const f = new FileNode(filename, path, key);
  return f;
}

// Parse a path to a VDom tree and return
// @param path
// @param key
// @return Promise<VNode>
export async function ParseVNode(
  pwd: string,
  key: symbol = Symbol()
): Promise<VNode> {
  const [dirpath, dirname] = ParsePwd(pwd);
  const vDom = newFolder(dirpath, dirname, true, key);

  const path = `${vDom.path}/${vDom.filename}`;
  const files = readdirSync(path);

  const [sortfolders, sortfiles] = await sortFiles(path, files);

  // push folder node at first
  vDom.children.push(
    ...sortfolders.map((filename) => {
      return newFolder(path, filename, false);
    })
  );
  // then push file node
  vDom.children.push(
    ...sortfiles.map((filename) => {
      return newFile(path, filename);
    })
  );

  return vDom;
}

// To sorting file and folder.
// @return [Folders, Files]
// TODO: Performance optimization
async function sortFiles(
  pwd: string,
  files: string[]
): Promise<[Folders, Files]> {
  const resFolders = [];
  const resFiles = [];
  const file_queue: Promise<Stats>[] = [];
  files.forEach((file) => {
    file_queue.push(stat(`${pwd}/${file}`));
  });
  await Promise.all<Stats>(file_queue).then((result) => {
    result.forEach((s, index) => {
      if (s.isDirectory()) {
        resFolders.push(files[index]);
      } else {
        resFiles.push(files[index]);
      }
    });
  });
  return [resFolders, resFiles];
}

// To parse a full path.
// example:
//  input:
//    pwd = '/home/ph/Desktop/english.md'
//  result:
//    filename = english.md
//    path = /home/ph/Desktop
function ParsePwd(pwd: string): [Path, FileName] {
  let res = pwd.split('/');
  let filename = res[res.length - 1];
  let path = pwd.slice(0, pwd.length - filename.length - 1);
  return [path, filename];
}
