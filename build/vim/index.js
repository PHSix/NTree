"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vim = void 0;
const folder_1 = require("../dom/folder");
const index_1 = require("../fs/index");
const buffer_1 = require("../window/buffer");
const hl_1 = require("../hl");
const action_1 = require("../action");
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
class Vim {
    constructor(nvim) {
        this.nvim = nvim;
        this.ac = new action_1.Action(nvim);
    }
    async render() {
        var point;
        var stack = [this.root];
        await this.buffer.setOption('modifiable', true);
        let prefix = ' ';
        this.hl_queue = [];
        this.context = [];
        while (true) {
            point = stack.pop();
            if (point.after)
                stack.push(point.after);
            if (this.hidden === true && point.key !== this.root.key) {
                if (point.filename[0] !== '.') {
                    this.context.push(`${prefix}${point.attribute.icon} ${point.filename}`);
                    this.hl_queue.push({
                        hlGroup: point.attribute.hlGroup,
                        line: this.context.length - 1,
                        colStart: prefix.length,
                        colEnd: prefix.length + 4,
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
                });
            }
            if (point instanceof folder_1.FolderElement &&
                point.unfold === true &&
                point.firstChild) {
                if (this.hidden === true && point.key !== this.root.key) {
                    if (point.filename[0] !== '.') {
                        prefix = `${prefix}  `;
                        stack.push(point.firstChild);
                    }
                }
                else {
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
    }
    async open() {
        const pwd = await this.nvim.commandOutput('pwd');
        if (this.root.path !== pwd) {
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
                // hide file
                if (this.hidden === true && point.key !== this.root.key) {
                    if (point.filename[0] !== '.')
                        stack.push(point.firstChild);
                }
                else {
                    // dont hide file
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
