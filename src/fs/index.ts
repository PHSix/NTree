import { Stats } from 'fs';
import { readdir, stat } from 'fs/promises';
import { renameSync, openSync, closeSync, statSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { FileElement } from '../dom/file';
import { FolderElement } from '../dom/folder';

export class FileSystem {
  public static renameFile(oldpath: string, newpath: string) {
    try {
      renameSync(oldpath, newpath);
      return true;
    } catch (err) {
      return false;
    }
  }
  public static createRoot(pwd: string): FolderElement {
    const splitArr = pwd.split('/');
    const filename = splitArr.pop();
    const path = `${splitArr.join('/')}`;
    const root = new FolderElement(filename, path);
    return root;
  }
  /*
   * @return [folderArray: FolderElement[], fileArray: FileElement[]]
   * */
  public static async findChildren(
    fullpath: string,
    parent: FolderElement
  ): Promise<[FolderElement[], FileElement[]]> {
    const baseArr = await readdir(fullpath);
    const files: FileElement[] = [];
    const folders: FolderElement[] = [];
    if (baseArr.length === 0) {
      return [folders, files];
    }
    const stat_queue: Promise<Stats>[] = [];
    baseArr.forEach((filename) => {
      stat_queue.push(stat(`${fullpath}/${filename}`));
    });
    await Promise.all(stat_queue).then((result) => {
      result.forEach((item, index) => {
        if (item.isDirectory() === true) {
          folders.push(new FolderElement(baseArr[index], fullpath, parent));
        } else {
          files.push(new FileElement(baseArr[index], fullpath, parent));
        }
      });
    });
    return [folders, files];
  }
  public static touchFile(path: string): boolean {
    try {
      statSync(path);
      return false;
    } catch (err) {
      closeSync(openSync(path, 'w'));
      return true;
    }
  }
  public static createDir(path: string): boolean {
    try {
      mkdirSync(path);
      return true;
    } catch (err) {
      return false;
    }
  }
  public static delete(path: string) {
    try {
      execSync(`rm -rf ${path}`);
      return true;
    } catch (err) {
      return false;
    }
  }
}
