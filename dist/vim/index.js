Object.defineProperty(exports, "__esModule", { value: true });
exports.Vim = void 0;
const folder_1 = require("../dom/folder");
const index_1 = require("../fs/index");
const TRUN = '└';
const LINE = '|';
/*
 * There has 4 tasks in this function.
 * 1. rendered text.
 * 2. read all highlight rules and await in a promise.all queue.
 * 3.
 * */
class Vim {
    constructor(nvim) {
        this.nvim = nvim;
    }
    render() {
        var point;
        var renderText;
        var stack = [this.root];
        const hl_queue = [];
        let prefix = ' ';
        while (true) {
            point = stack.pop();
            if (point.key !== this.root.key && !point.after) {
                prefix = `${prefix.substring(0, prefix.length - 3)}${TRUN} `;
                renderText.push(`${prefix}${point.attribute.icon}${point.filename}`);
                // prefix = prefix.substring(0, prefix.length - 3);
            }
            else {
                renderText.push(`${prefix}${point.attribute.icon}${point.filename}`);
                stack.push(point.after);
            }
            hl_queue.push(this.buffer.addHighlight({
                hlGroup: point.attribute.hlGroup,
                colStart: prefix.length,
                colEnd: prefix.length + 2,
            }));
            if (point instanceof folder_1.FolderElement &&
                point.unfold === true &&
                !point.firstChild) {
                prefix = `${prefix}${LINE} `;
                stack.push(point.firstChild);
            }
            if (stack.length === 0) {
                break;
            }
        }
        // render text
        this.buffer.setLines(renderText, {
            start: 0,
            end: -1,
            strictIndexing: true,
        });
    }
    async init() {
        const pwd = await this.nvim.commandOutput('pwd');
        this.root = index_1.FileSystem.createRoot(pwd);
    }
}
exports.Vim = Vim;
