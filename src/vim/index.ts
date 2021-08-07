import { Neovim, Buffer } from 'neovim';
import { BaseElement } from '../dom/BaseElement';
import { FolderElement } from '../dom/folder';
import { FileSystem } from '../fs/index';
import { HighlightRule } from '../hl';
import { createBuffer } from '../window/buffer';
import { namespace_id } from '../hl';

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
  hl_queue: HighlightRule[];
  context: string[];
  async render() {
    var point: BaseElement;
    var stack: BaseElement[] = [this.root];
    let prefix = ' ';
    this.hl_queue = [];
    this.context = [];
    while (true) {
      point = stack.pop();
      if (point.key !== this.root.key && !point.after) {
        prefix = `${prefix.substring(0, prefix.length - 2)}${TRUN} `;
        this.context.push(`${prefix}${point.attribute.icon} ${point.filename}`);
        prefix = `${prefix.substring(0, prefix.length - 2)}  `;
      } else if (point.key === this.root.key) {
        this.context.push(`${prefix}${point.attribute.icon} ${point.filename}`);
      } else {
        this.context.push(`${prefix}${point.attribute.icon} ${point.filename}`);
        stack.push(point.after);
      }
      this.hl_queue.push({
        hlGroup: point.attribute.hlGroup,
        line: this.context.length - 1,
        colStart: prefix.length,
        colEnd: prefix.length + 2,
      });
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
    await this.buffer.setLines(this.context, {
      start: 0,
      end: -1,
      strictIndexing: true,
    });
    const queue: Promise<number>[] = [];
    for (let hl of this.hl_queue) {
      this.nvim.outWriteLine(
        `${hl.hlGroup}, ${hl.colEnd}, ${hl.colStart}, ${hl.line}`
      );
      // queue.push(
      //   this.buffer.addHighlight({
      //     hlGroup: hl.hlGroup,
      //     colStart: hl.colStart,
      //     colEnd: hl.colEnd,
      //     srcId: namespace_id,
      //   })
      // );
    }
    await Promise.all(queue);
  }
  constructor(nvim: Neovim) {
    this.nvim = nvim;
  }
  async init() {
    const pwd = await this.nvim.commandOutput('pwd');
    this.root = FileSystem.createRoot(pwd);
    await this.root.generateChildren();
    this.buffer = await createBuffer(this.nvim);
    this.context = [];
  }
}
