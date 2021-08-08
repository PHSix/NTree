import { Neovim, Buffer } from 'neovim';
import { BaseElement } from '../dom/BaseElement';
import { FolderElement } from '../dom/folder';
import { FileSystem } from '../fs/index';
import { HighlightRule } from '../hl';
import { createBuffer } from '../window/buffer';
import { VimHighlight } from '../hl';

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
  hl: VimHighlight;
  context: string[];
  namespace: number;
  async render() {
    var point: BaseElement;
    var stack: BaseElement[] = [this.root];

    await this.buffer.setOption('modifiable', true);
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
      // WARNING: has bug is this place.  the 'TRUN' char will occpuy more two space.
      var prefix_len = prefix.length;
      if (prefix[prefix.length - 2] == ' ') {
        prefix_len += 2;
      }
      this.hl_queue.push({
        hlGroup: point.attribute.hlGroup,
        line: this.context.length - 1,
        colStart: prefix_len,
        colEnd: prefix_len + 4,
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
    // set highlight rules
    const queue: Promise<number>[] = [];
    for (let hl of this.hl_queue) {
      queue.push(
        this.buffer.addHighlight({
          hlGroup: hl.hlGroup,
          line: hl.line,
          colStart: hl.colStart,
          colEnd: hl.colEnd,
          srcId: this.namespace,
        })
      );
    }
    await Promise.all(queue);
    this.buffer.setOption('modifiable', false);
  }
  constructor(nvim: Neovim) {
    this.nvim = nvim;
  }
  async init() {
    const pwd = await this.nvim.commandOutput('pwd');
    this.root = FileSystem.createRoot(pwd);
    await this.root.generateChildren();
    this.buffer = await createBuffer(this.nvim);
    this.hl = new VimHighlight();
    this.namespace = await this.hl.init(this.nvim);
  }
}
