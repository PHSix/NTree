"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Actions_1 = require("./source/Actions");
const Highlight_1 = require("./source/Highlight");
const Option_1 = require("./source/Option");
const Store_1 = require("./source/Store");
const Toggle_1 = require("./source/Toggle");
let loaderFlag = false;
function myplugin(plugin) {
    plugin.registerCommand('NToggle', async () => {
        if (!Store_1.Store.cwd) {
            Store_1.Store.cwd = process.cwd();
        }
        if (!Store_1.Store.nvim) {
            Store_1.Store.nvim = plugin.nvim;
        }
        if (loaderFlag === false) {
            Option_1.Option.hide_file = (await plugin.nvim.getVar('node_tree_hide_files'));
            await Highlight_1.CreateHighlight(plugin.nvim);
        }
        Store_1.Store.window = await plugin.nvim.window;
        await Toggle_1.Toggle(plugin.nvim);
    }, { sync: true });
    plugin.registerFunction('NodeTreeAction', async (args) => {
        const [cursorPos, _] = await plugin.nvim.window.cursor;
        switch (args.toString()) {
            case 'edit':
                await Actions_1.EditAction(cursorPos);
                break;
            case 'dirUp':
                Actions_1.DirUpAction(cursorPos);
                break;
            case 'touch':
                Actions_1.TouchAction(cursorPos);
                break;
            case 'mkdir':
                Actions_1.MkdirAction(cursorPos);
                break;
            case 'rename':
                Actions_1.RenameAction(cursorPos);
                break;
            case 'hide':
                Actions_1.HiddenAction();
                break;
            case 'delete':
                Actions_1.RemoveAction(cursorPos);
                break;
            case 'quit':
                plugin.nvim.command('q');
                break;
        }
    }, {
        sync: false,
    });
}
exports.default = myplugin;
