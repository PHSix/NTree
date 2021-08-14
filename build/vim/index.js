"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vim = void 0;
const folder_1 = require("../dom/folder");
const index_1 = require("../fs/index");
const buffer_1 = require("../window/buffer");
const hl_1 = require("../hl");
const action_1 = require("../action");
const LINE = '│ ';
const TURN = '└ ';
const SPACE = '  ';
function calcCol(prefix) {
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
function checkPath(root, pwd, hide) {
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
        if (item[0] === '.')
            rootCounter += 1;
    });
    pwdArr.forEach((item) => {
        if (item[0] === '.')
            pwdCounter += 1;
    });
    if (pwdCounter > rootCounter && hide)
        return true;
    else
        return false;
}
class Vim {
    constructor(nvim) {
        this.client = nvim;
        this.ac = new action_1.Action(nvim);
        this.getRoot = this.rootCache();
        this.context = [];
        this.hl_queue = [];
        this.hl = new hl_1.VimHighlight();
        this.init();
    }
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
        var dfs = (point) => {
            prefix = this.calcPrefix(point, prefix);
            if (point instanceof folder_1.FolderElement && point.firstChild && point.unfold) {
                if (this.hidden) {
                    if (point.filename[0] !== '.' || point.key === this.root.key) {
                        if (prefix[prefix.length - 2] === '└')
                            prefix = prefix.substring(0, prefix.length - 2) + SPACE;
                        prefix = prefix + LINE;
                        dfs(point.firstChild);
                    }
                }
                else {
                    prefix = prefix + LINE;
                    dfs(point.firstChild);
                }
            }
            if (point.after) {
                if (!point.after.after) {
                    prefix = prefix.substring(0, prefix.length - 2) + TURN;
                }
                dfs(point.after);
            }
            else {
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
        const queue = [];
        this.hl_queue.forEach((hl) => {
            queue.push(this.buffer.addHighlight({
                hlGroup: hl.hlGroup,
                line: hl.line,
                colStart: hl.colStart,
                colEnd: hl.colEnd,
                srcId: this.namespace,
            }));
        });
        await Promise.all(queue);
        await this.buffer.setOption('modifiable', false);
        await this.client.setVar('_node_tree_rendered', 1);
    }
    async init() {
        const pwd = await this.client.commandOutput('pwd');
        this.root = index_1.FileSystem.createRoot(pwd);
        await this.root.generateChildren();
        this.buffer = await buffer_1.createBuffer(this.client);
        this.namespace = await this.hl.init(this.client);
        this.hidden = (await this.client.getVar('node_tree_hide_files'));
    }
    async open() {
        const pwd = await this.client.commandOutput('pwd');
        if (checkPath(this.root.fullpath, pwd, this.hidden) ||
            this.context.length === 0) {
            this.root = await this.getRoot(pwd);
            await this.render();
        }
    }
    async action(to) {
        const [col] = await this.client.window.cursor;
        const element = this.findElement(col);
        await this.ac.handle(element, to, this);
        await this.render();
    }
    findElement(pos) {
        var point;
        var stack = [this.root];
        var counter = 0;
        while (true) {
            point = stack.pop();
            if (point.after) {
                stack.push(point.after);
            }
            if (point instanceof folder_1.FolderElement &&
                point.unfold === true &&
                point.firstChild) {
                if (this.hidden === true && point.key !== this.root.key) {
                    if (point.filename[0] !== '.')
                        stack.push(point.firstChild);
                }
                else {
                    stack.push(point.firstChild);
                }
            }
            if (this.hidden === true && point.key !== this.root.key) {
                if (point.filename[0] !== '.')
                    counter++;
            }
            else {
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
        var cache_queue = [];
        /*
         * if dont exist in cache will push in cache array.
         * if exist, will return root folder element of array
         * */
        return async (pwd) => {
            const index = cache_queue.findIndex((item) => item.fullpath === pwd);
            if (index === -1) {
                const r = index_1.FileSystem.createRoot(pwd);
                await r.generateChildren();
                cache_queue.push(r);
                return cache_queue[cache_queue.length - 1];
            }
            else {
                return cache_queue[index];
            }
        };
    }
    calcPrefix(point, prefix) {
        const prefixLen = calcCol(prefix);
        //hide dot file mode
        if (this.hidden) {
            if (point.filename[0] !== '.' || point.key === this.root.key) {
                if (!point.after && point.key !== this.root.key) {
                    prefix = prefix.substring(0, prefix.length - 2) + TURN;
                }
                this.context.push(`${prefix}${point.attribute.icon} ${point.filename}`);
            }
            else {
                return prefix;
            }
        }
        else {
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
exports.Vim = Vim;
