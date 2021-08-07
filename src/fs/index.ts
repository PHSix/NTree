import { Stats } from 'fs';
import { readdir, stat } from 'fs/promises';
import { BaseElement } from '../dom/BaseElement';
import { FileElement } from '../dom/file';
import { FolderElement } from '../dom/folder';

/*
 * TODO: 4 tasks
 *
 * */
export class FileSystem {
  public static createRoot(pwd: string): FolderElement {
    const splitArr = pwd.split('/');
    const filename = splitArr.pop();
    const path = `/${splitArr.join('/')}`;
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
    if (baseArr.length === 0) {
      return [null, null];
    }
    const stat_queue: Promise<Stats>[] = [];
    const files: FileElement[] = [];
    const folders: FolderElement[] = [];
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
  public static createFile() {}
  public static createFolder() {}
}
