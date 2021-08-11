import { Neovim, Buffer } from 'neovim';
import { BaseElement } from '../dom/BaseElement';
import { FolderElement } from '../dom/folder';
import { FileSystem } from '../fs/index';
import { HighlightRule } from '../hl';
import { createBuffer } from '../window/buffer';
import { VimHighlight } from '../hl';
import { Action } from '../action';
import { logmsg } from '../log';

// const TRUN = '└';
// const LINE = '|';
const TRUN = ' ';
const LINE = ' ';

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
  ac: Action;
  hidden: boolean;
  async render() {
    var point: BaseElement;
    var stack: BaseElement[] = [this.root];
    await this.buffer.setOption('modifiable', true);
    let prefix = ' ';
    this.hl_queue = [];
    this.context = [];
    while (true) {
      point = stack.pop();
      if (point.after) stack.push(point.after);
      if (this.hidden === true && point.key !== this.root.key) {
        if (point.filename[0] !== '.') {
          this.context.push(
            `${prefix}${point.attribute.icon} ${point.filename}`
          );
          this.hl_queue.push({
            hlGroup: point.attribute.hlGroup,
            line: this.context.length - 1,
            colStart: prefix.length,
            colEnd: prefix.length + 4,
          });
        }
      } else {
        this.context.push(`${prefix}${point.attribute.icon} ${point.filename}`);
        this.hl_queue.push({
          hlGroup: point.attribute.hlGroup,
          line: this.context.length - 1,
          colStart: prefix.length,
          colEnd: prefix.length + 4,
        });
      }
      if (
        point instanceof FolderElement &&
        point.unfold === true &&
        point.firstChild
      ) {
        if (this.hidden === true && point.key !== this.root.key) {
          if (point.filename[0] !== '.') {
            prefix = `${prefix}  `;
            stack.push(point.firstChild);
          }
        } else {
          prefix = `${prefix}  `;
          stack.push(point.firstChild);
        }
      }
      if (point.key !== this.root.key && !point.after) {
        prefix = prefix.substring(0, prefix.length - 2);
      }
      if (stack.length === 0) {
        break;
      }
    }
    // render text
    this.buffer.setLines(this.context, {
      start: 0,
      end: -1,
      strictIndexing: false,
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
    await this.buffer.setOption('modifiable', false);
    await this.nvim.setVar('_node_tree_rendered', 1);
  }
  constructor(nvim: Neovim) {
    this.nvim = nvim;
    this.ac = new Action(nvim);
  }
  async init() {
    const pwd = await this.nvim.commandOutput('pwd');
    this.root = FileSystem.createRoot(pwd);
    await this.root.generateChildren();
    this.buffer = await createBuffer(this.nvim);
    this.hl = new VimHighlight();
    this.namespace = await this.hl.init(this.nvim);
    this.hidden = (await this.nvim.getVar('node_tree_hide_files')) as boolean;
  }
  async open() {
    const pwd = await this.nvim.commandOutput('pwd');
    if (this.root.path !== pwd) {
      this.root = FileSystem.createRoot(pwd);
      await this.root.generateChildren();
      await this.render();
    }
  }
  async action(to: string) {
    const [col] = await this.nvim.window.cursor;
    const element = this.findElement(col);
    await this.ac.handle(element, to, this);
    await this.render();
  }
  findElement(pos: number): BaseElement {
    var point: BaseElement;
    var stack: BaseElement[] = [this.root];
    var counter = 0;
    while (true) {
      point = stack.pop();
      if (point.after) {
        stack.push(point.after);
      }
      if (
        point instanceof FolderElement &&
        point.unfold === true &&
        point.firstChild
      ) {
        // hide file
        if (this.hidden === true && point.key !== this.root.key) {
          if (point.filename[0] !== '.') stack.push(point.firstChild);
        } else {
          // dont hide file
          stack.push(point.firstChild);
        }
      }
      if (this.hidden === true && point.key !== this.root.key) {
        if (point.filename[0] !== '.') counter++;
      } else {
        counter++;
      }
      if (counter === pos) {
        return point;
      }
    }
  }
}
