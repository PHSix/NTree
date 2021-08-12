"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseElement_1 = require("./BaseElement");
const folder_1 = require("./folder");
const f1 = new BaseElement_1.BaseElement('nvim', '/home/ph/.config', null);
const f = new folder_1.FolderElement('nvim', '/home/ph/.config');
console.log(f.fullpath, f.unfold, f.attribute.hlGroup, f.attribute.icon);
task(f);
task(null);
function task(b) {
    if (b instanceof folder_1.FolderElement) {
        console.log('yes', b.attribute.hlGroup);
    }
    else {
        console.log('error');
    }
}
