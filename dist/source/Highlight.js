"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHighlight = exports.ParseHiName = exports.IconLength = void 0;
const Option_1 = require("./Option");
const Icons_1 = require("./Icons");
exports.IconLength = 2;
function ParseHiName(hi_group) {
    return `NodeIcon${hi_group}`;
}
exports.ParseHiName = ParseHiName;
async function CreateHighlight(nvim) {
    Option_1.Option.namespace_id = await nvim.createNamespace('NodeTreeHighlights');
    const hi_queue = [];
    const hi_Icon = (hi_group, hi_color) => {
        return nvim.command(`highlight ${ParseHiName(hi_group)} guifg=${hi_color}`);
    };
    for (let item in Icons_1.IconStore) {
        hi_queue.push(hi_Icon(Icons_1.IconStore[item].name, Icons_1.IconStore[item].color));
    }
    await Promise.all([
        nvim.command('highlight NodeTreeFolder guifg=#c7ecee'),
        nvim.command('highlight NodeTreeGitAdd guifg=#3ae374'),
        nvim.command('highlight NodeTreeGitMod guifg=#82ccdd'),
        ...hi_queue,
    ]);
}
exports.CreateHighlight = CreateHighlight;
