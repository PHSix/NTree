"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileElement = void 0;
const BaseElement_1 = require("./BaseElement");
const icons_1 = require("../icons");
class FileElement extends BaseElement_1.BaseElement {
    constructor(filename, path, parent) {
        super(filename, path, parent);
        const ext = parseEXT(filename);
        const { icon, name } = getIcon(filename, ext);
        const hlGroup = getHiGroup(name);
        this.ext = ext || '';
        this.attribute = {
            hlGroup,
            icon,
        };
    }
}
exports.FileElement = FileElement;
function getHiGroup(hlGroup) {
    return `NodeTreeIcon${hlGroup}`;
}
function parseEXT(filename) {
    return filename.split('.').pop();
}
function getIcon(filename, ext) {
    if (icons_1.default[filename]) {
        return icons_1.default[filename];
    }
    else if (icons_1.default[ext]) {
        return icons_1.default[ext];
    }
    else {
        return icons_1.default['default_icon'];
    }
}
