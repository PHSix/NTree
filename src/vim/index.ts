import { Neovim, Buffer } from 'neovim';
import { BaseElement } from '../dom/BaseElement';
import { FolderElement } from '../dom/folder';
import { FileSystem } from '../fs/index';

const TRUN = '└';
const LINE = '|';

/*
 * There has 4 tasks in this function.
 * 1. rendered text.
 * 2. read all highlight rules and await in a promise.all queue.
 * 3.
 * */
export class Vim {
  buffer: Buffer;
  root: FolderElement;
  nvim: Neovim;
  async render() {
    var point: BaseElement;
    var renderText: string[];
    var stack: BaseElement[] = [this.root];
    const hl_queue: Promise<number>[] = [];
    let prefix = ' ';
    while (true) {
      point = stack.pop();
      if (point.key !== this.root.key && !point.after) {
        prefix = `${prefix.substring(0, prefix.length - 2)}${TRUN} `;
        renderText.push(`${prefix}${point.attribute.icon} ${point.filename}`);
        prefix = `${prefix.substring(0, prefix.length - 2)}  `;
      } else if (point.key === this.root.key) {
        renderText.push(`${prefix}${point.attribute.icon} ${point.filename}`);
      } else {
        renderText.push(`${prefix}${point.attribute.icon} ${point.filename}`);
        stack.push(point.after);
      }
      hl_queue.push(
        this.buffer.addHighlight({
          hlGroup: point.attribute.hlGroup,
          colStart: prefix.length,
          colEnd: prefix.length + 2,
        })
      );
      if (
        point instanceof FolderElement &&
        point.unfold === true &&
        point.firstChild
      ) {
        prefix = `${prefix}${LINE} `;
        stack.push(point.firstChild);
      }
      if (point.key !== this.root.key && !point.after) {
        prefix = prefix.substring(0, prefix.length - 2);
      }
      if (stack.length === 0) {
        break;
      }
    }
    // render text
    await this.buffer.setLines(renderText, {
      start: 0,
      end: -1,
      strictIndexing: true,
    });
    await Promise.all<number>(hl_queue);
  }
  constructor(nvim: Neovim) {
    this.nvim = nvim;
  }
  async init() {
    const pwd = await this.nvim.commandOutput('pwd');
    this.root = FileSystem.createRoot(pwd);
  }
}
