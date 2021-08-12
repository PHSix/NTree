"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vim = void 0;
const folder_1 = require("../dom/folder");
const index_1 = require("../fs/index");
const buffer_1 = require("../window/buffer");
const hl_1 = require("../hl");
const action_1 = require("../action");
/*
 * */
class Vim {
    constructor(nvim) {
        this.nvim = nvim;
        this.ac = new action_1.Action(nvim);
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
            if (this.hidden) {
                if (point.filename[0] !== '.') {
                    this.context.push(`${prefix}${point.attribute.icon} ${point.filename}`);
                    this.hl_queue.push({
                        hlGroup: point.attribute.hlGroup,
                        line: this.context.length - 1,
                        colStart: prefix.length,
                        colEnd: prefix.length + 4,
                        srcId: this.namespace,
                    });
                }
            }
            else {
                this.context.push(`${prefix}${point.attribute.icon} ${point.filename}`);
                this.hl_queue.push({
                    hlGroup: point.attribute.hlGroup,
                    line: this.context.length - 1,
                    colStart: prefix.length,
                    colEnd: prefix.length + 4,
                    srcId: this.namespace,
                });
            }
            if (point instanceof folder_1.FolderElement && point.firstChild && point.unfold) {
                if (this.hidden) {
                    if (point.filename[0] !== '.') {
                        prefix = prefix + '  ';
                        dfs(point.firstChild);
                    }
                }
                else {
                    prefix = prefix + '  ';
                    dfs(point.firstChild);
                }
            }
            if (point.after) {
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
        for (let hl of this.hl_queue) {
            queue.push(this.buffer.addHighlight({
                hlGroup: hl.hlGroup,
                line: hl.line,
                colStart: hl.colStart,
                colEnd: hl.colEnd,
                srcId: this.namespace,
            }));
        }
        await Promise.all(queue);
        await this.buffer.setOption('modifiable', false);
        await this.nvim.setVar('_node_tree_rendered', 1);
    }
    async init() {
        const pwd = await this.nvim.commandOutput('pwd');
        this.root = index_1.FileSystem.createRoot(pwd);
        await this.root.generateChildren();
        this.buffer = await buffer_1.createBuffer(this.nvim);
        this.hl = new hl_1.VimHighlight();
        this.namespace = await this.hl.init(this.nvim);
        this.hidden = (await this.nvim.getVar('node_tree_hide_files'));
        this.context = [];
        this.hl_queue = [];
    }
    async open() {
        const pwd = await this.nvim.commandOutput('pwd');
        // TODO: Lazy render
        if (this.root.fullpath !== pwd || this.context.length === 0) {
            this.root = index_1.FileSystem.createRoot(pwd);
            await this.root.generateChildren();
            await this.render();
        }
    }
    async action(to) {
        const [col] = await this.nvim.window.cursor;
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
}
exports.Vim = Vim;
