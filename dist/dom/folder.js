"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderElement = void 0;
const BaseElement_1 = require("./BaseElement");
const icons_1 = require("../icons");
const index_1 = require("../fs/index");
class FolderElement extends BaseElement_1.BaseElement {
    constructor(filename, path, parent = null) {
        super(filename, path, parent);
        const { icon, name } = getIcon(filename, false);
        const hlGroup = getHiGroup(name);
        this.unfold = false;
        this.attribute = {
            icon,
            hlGroup,
        };
    }
    appendChild(c) {
        if (!this.firstChild) {
            this.firstChild = this.lastChild = c;
        }
        else {
            this.lastChild.after = c;
            c.before = this.lastChild;
            this.lastChild = c;
        }
    }
    async generateChildren() {
        const [folders, files] = await index_1.FileSystem.findChildren(this.fullpath, this);
        this.unfold = true;
        folders.forEach((item) => {
            this.appendChild(item);
        });
        files.forEach((item) => {
            this.appendChild(item);
        });
        return;
    }
}
exports.FolderElement = FolderElement;
function getHiGroup(hlGroup) {
    return `NodeTreeIcons${hlGroup}`;
}
/*
 * to get folder element icon
 * */
function getIcon(filename, unfold) {
    if (icons_1.default[filename]) {
        return icons_1.default[filename];
    }
    else {
        if (unfold) {
            return icons_1.default['default_folder_open'];
        }
        return icons_1.default['default_folder'];
    }
}
