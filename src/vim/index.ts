import { Neovim, Buffer, Window } from 'neovim';
import { BaseElement } from '../dom/BaseElement';
import { FolderElement } from '../dom/folder';
import { FileSystem } from '../fs/index';
import { HighlightRule } from '../hl';
import { createBuffer } from '../window/buffer';
import { VimHighlight } from '../hl';
import { Action } from '../action';

const LINE = '│ ';
const TURN = '└ ';
const SPACE = '  ';

function calcCol(prefix: string) {
  const indentRe = /\│|\└/g;
  const spaceRe = / /g;
  const indentLen = (prefix.match(indentRe) || []).length * 3;
  const spaceLen = (prefix.match(spaceRe) || []).length;
  return indentLen + spaceLen;
}

/*
 *  what is true? if true will do anything?
 *  if return true.
 *  will need to reredner nodetree
 *  if false nodetree dont need to do anything.
 *
 *  1. match root for pwd.
 *  2. check is hide file
 *     - hide:
 *     - no hide: true
 * */
function checkPath(root: string, pwd: string, hide: boolean) {
  // path dont match
  if (!pwd.match(root)) {
    return true;
  }
  // path match
  const rootArr = root.split('/');
  const pwdArr = pwd.split('/');
  var rootCounter = 0;
  var pwdCounter = 0;
  rootArr.forEach((item) => {
    if (item[0] === '.') rootCounter += 1;
  });
  pwdArr.forEach((item) => {
    if (item[0] === '.') pwdCounter += 1;
  });
  if (pwdCounter > rootCounter && hide) return true;
  else return false;
}
export class Vim {
  buffer: Buffer;
  root: FolderElement;
  client: Neovim;
  hl_queue: HighlightRule[];
  hl: VimHighlight;
  context: string[];
  namespace: number;
  ac: Action;
  hidden: boolean;
  win: Window;
  getRoot: (pwd: string) => Promise<FolderElement>;
  async render() {
    await this.buffer.setOption('modifiable', true);
    let prefix = ' ';
    this.hl_queue = [];
    this.context = [];
    /*
     * 1. push correct text to context.
     * 2. push right postion in hl_queue.
     * 3. prefix increment at the right time.(into folder)
     * 4. prefix decrement at the right time.(out of folder)
     *
     * so when the point will go into folder
     * and when the point will went out of folder
     *
     * stack push when has after or children
     *
     * */
    var dfs = (point: BaseElement) => {
      prefix = this.calcPrefix(point, prefix);
      if (point instanceof FolderElement && point.firstChild && point.unfold) {
        if (this.hidden) {
          if (point.filename[0] !== '.' || point.key === this.root.key) {
            if (prefix[prefix.length - 2] === '└')
              prefix = prefix.substring(0, prefix.length - 2) + SPACE;
            prefix = prefix + LINE;
            dfs(point.firstChild);
          }
        } else {
          prefix = prefix + LINE;
          dfs(point.firstChild);
        }
      }
      if (point.after) {
        if (!point.after.after) {
          prefix = prefix.substring(0, prefix.length - 2) + TURN;
        }
        dfs(point.after);
      } else {
        prefix = prefix.substring(0, prefix.length - 2);
      }
    };
    dfs(this.root);
    // render text
    this.buffer.setLines(this.context, {
      start: 0,
      end: -1,
      strictIndexing: false,
    });
    // set highlight rules
    this.hl_queue.forEach((hl) => {
      this.buffer.addHighlight({
        hlGroup: hl.hlGroup,
        line: hl.line,
        colStart: hl.colStart,
        colEnd: hl.colEnd,
        srcId: this.namespace,
      });
    });
    this.buffer.setOption('modifiable', false);
    await this.client.setVar('_node_tree_rendered', 1);
  }
  constructor(nvim: Neovim) {
    this.client = nvim;
    this.ac = new Action(nvim);
    this.getRoot = this.rootCache();
    this.context = [];
    this.hl_queue = [];
    this.hl = new VimHighlight();
    this.init();
  }
  async init() {
    const pwd = await this.client.commandOutput('pwd');
    this.root = FileSystem.createRoot(pwd);
    await this.root.generateChildren();
    this.buffer = await createBuffer(this.client);
    this.namespace = await this.hl.init(this.client);
    this.hidden = (await this.client.getVar('node_tree_hide_files')) as boolean;
  }
  async open() {
    const pwd = await this.client.commandOutput('pwd');
    if (
      checkPath(this.root.fullpath, pwd, this.hidden) ||
      this.context.length === 0
    ) {
      this.root = await this.getRoot(pwd);
      await this.render();
    }
  }
  async action(to: string) {
    const [col] = await this.client.window.cursor;
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
        if (this.hidden === true && point.key !== this.root.key) {
          if (point.filename[0] !== '.') stack.push(point.firstChild);
        } else {
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
  /*
   * maintain a cache queue
   * to promise save history
   * */
  rootCache() {
    var cache_queue: FolderElement[] = [];
    /*
     * if dont exist in cache will push in cache array.
     * if exist, will return root folder element of array
     * */
    return async (pwd: string): Promise<FolderElement> => {
      const index = cache_queue.findIndex((item) => item.fullpath === pwd);
      if (index === -1) {
        const r = FileSystem.createRoot(pwd);
        await r.generateChildren();
        cache_queue.push(r);
        return cache_queue[cache_queue.length - 1];
      } else {
        return cache_queue[index];
      }
    };
  }

  calcPrefix(point: BaseElement, prefix: string) {
    const prefixLen = calcCol(prefix);
    //hide dot file mode
    if (this.hidden) {
      if (point.filename[0] !== '.' || point.key === this.root.key) {
        if (!point.after && point.key !== this.root.key) {
          prefix = prefix.substring(0, prefix.length - 2) + TURN;
        }
        this.context.push(`${prefix}${point.attribute.icon} ${point.filename}`);
      } else {
        return prefix;
      }
    } else {
      if (!point.after && point.key !== this.root.key) {
        prefix = prefix.substring(0, prefix.length - 2) + TURN;
      }
      this.context.push(`${prefix}${point.attribute.icon} ${point.filename}`);
    }
    this.hl_queue.push({
      hlGroup: 'NodeTreePrefix',
      line: this.context.length - 1,
      colStart: 0,
      colEnd: prefixLen,
      srcId: this.namespace,
    });
    this.hl_queue.push({
      hlGroup: point.attribute.hlGroup,
      line: this.context.length - 1,
      colStart: prefixLen,
      colEnd: prefixLen + 4,
      srcId: this.namespace,
    });
    return prefix;
  }
}
