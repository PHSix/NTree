"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Render = void 0;
const Store_1 = require("./Store");
const Option_1 = require("./Option");
const Fs_1 = require("./Fs");
const Node_1 = require("./Node");
const Icons_1 = require("./Icons");
async function Render() {
    if (!Store_1.Store.root || `${Store_1.Store.root.path}/${Store_1.Store.root.filename}` !== Store_1.Store.pwd) {
        Store_1.Store.root = (await Fs_1.ParseVNode(Store_1.Store.pwd));
    }
    const [h_text, h_higroup, h_gitgroup] = await ParseVDom(Store_1.Store.root);
    await h(h_text, h_higroup, h_gitgroup);
    Store_1.Store.textCache = h_text;
}
exports.Render = Render;
// NOTE: Can not use promise all to render highlight rules and text at the same time.
async function h(ctx, h_higroup, h_gitgroup) {
    await hText(ctx);
    defineHighlight(h_higroup);
    setGitVirtualText(h_gitgroup);
}
async function hText(ctx) {
    await Promise.all([
        Store_1.Store.buffer.setOption('modifiable', true),
        Store_1.Store.buffer.setLines(ctx, {
            start: 0,
            strictIndexing: true,
            end: await Store_1.Store.buffer.length,
        }),
        Store_1.Store.buffer.setOption('modifiable', false),
    ]);
}
function defineHighlight(h_higroup) {
    for (let hi of h_higroup) {
        Store_1.Store.buffer.addHighlight({
            hlGroup: hi.group,
            line: hi.line,
            colStart: hi.start,
            colEnd: hi.end,
            srcId: Option_1.Option.namespace_id,
        });
    }
}
function setGitVirtualText(h_gitgroup) {
    for (let hi of h_gitgroup) {
        let hi_group;
        if (hi.event.match('A')) {
            hi_group = 'NodeTreeGitAdd';
        }
        else {
            hi_group = 'NodeTreeGitMod';
        }
        Store_1.Store.buffer.setVirtualText(Option_1.Option.namespace_id, hi.line, [
            [hi.event, hi_group],
        ]);
    }
}
/*
 * parse VDom
 * @return [string[], HighlightTags]
 * */
async function ParseVDom(vnode) {
    const root_param_length = Store_1.Store.pwd.split('/').length - 1;
    let depth = 0;
    let counter = 0;
    const git_queue = [];
    const h_gitgroup = [];
    const h_higroup = [];
    const h_text = [];
    const handleFile = (vfile) => {
        // TODO: Get git status
        // git_queue.push(getVNodeGitStatus(vfile.path, vfile.filename));
        if (Option_1.Option.hide_file === true && vfile.filename[0] === '.') {
            return;
        }
        const [icon, icon_hi_group] = Icons_1.ParseFileIcon(vfile.filename, vfile.ext);
        counter++;
        if (vfile.path.split('/').length - root_param_length !== depth) {
            depth = vfile.path.split('/').length - root_param_length;
        }
        h_higroup.push({
            line: counter - 1,
            start: depth * 2 + 1,
            end: depth * 2 + 4,
            group: icon_hi_group,
        });
        h_text.push(`${'  '.repeat(depth)} ${icon} ${vfile.filename}`);
    };
    const handleFolder = (vfolder) => {
        // TODO: Get git status
        // git_queue.push(getVNodeGitStatus(vfolder.path, vfolder.filename));
        if (Option_1.Option.hide_file === true && vfolder.filename[0] === '.') {
            return;
        }
        if (vfolder.path.split('/').length - root_param_length !== depth) {
            depth = vfolder.path.split('/').length - root_param_length;
        }
        h_higroup.push({
            line: counter,
            start: 0,
            end: -1,
            group: 'NodeTreeFolder',
        });
        counter++;
        h_text.push(`${'  '.repeat(depth)} ${Icons_1.ParseFolderIcon(vfolder.filename, vfolder.isUnfold)} ${vfolder.filename}`);
    };
    IteratorDFS(vnode, handleFile, handleFolder);
    // BUG: add git status left NodeTree slowly
    await Promise.all(git_queue).then((result) => {
        result.forEach((git, index) => {
            if (git.length !== 0) {
                h_gitgroup.push({ line: index, event: git });
            }
        });
    });
    return [h_text, h_higroup, h_gitgroup];
}
function IteratorDFS(vnode, hfile, hfolder) {
    const vnodeArr = [];
    while (true) {
        if (vnode instanceof Node_1.FolderNode) {
            hfolder(vnode);
            if (vnode.isUnfold === true) {
                vnodeArr.splice(0, 0, ...vnode.children);
            }
        }
        else {
            hfile(vnode);
        }
        if (vnodeArr.length === 0) {
            break;
        }
        vnode = vnodeArr.shift();
    }
    return [];
}
