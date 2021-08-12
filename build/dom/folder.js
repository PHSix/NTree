"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderElement = void 0;
const BaseElement_1 = require("./BaseElement");
const icons_1 = require("../icons");
const index_1 = require("../fs/index");
class FolderElement extends BaseElement_1.BaseElement {
    constructor(filename, path, parent = null) {
        super(filename, path, parent);
        this._unfold = false;
        const { icon, name } = getIcon(filename, this._unfold);
        const hlGroup = getHiGroup(name);
        this.attribute = {
            icon,
            hlGroup,
        };
    }
    set unfold(value) {
        this._unfold = value;
        const { icon, name } = getIcon(this.filename, this._unfold);
        const hlGroup = getHiGroup(name);
        this.attribute = {
            icon,
            hlGroup,
        };
    }
    get unfold() {
        return this._unfold;
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
        if (folders.length !== 0) {
            folders.forEach((item) => {
                this.appendChild(item);
            });
        }
        if (files.length !== 0) {
            files.forEach((item) => {
                this.appendChild(item);
            });
        }
        if (this.firstChild === undefined) {
            this.firstChild = this.lastChild = null;
        }
        return;
    }
    applyChildren(first, last) {
        this.firstChild = first;
        this.lastChild = last;
        var point = first;
        while (point) {
            point.parent = this;
            point = point.after;
        }
    }
}
exports.FolderElement = FolderElement;
function getHiGroup(hlGroup) {
    return `NodeTreeIcon${hlGroup}`;
}
/*
 * to get folder element icon
 * */
function getIcon(filename, unfold) {
    if (icons_1.folderIcons[filename]) {
        return icons_1.folderIcons[filename];
    }
    else {
        if (unfold) {
            return icons_1.folderIcons['default_folder_open'];
        }
        return icons_1.folderIcons['default_folder'];
    }
}
