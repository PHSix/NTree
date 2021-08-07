"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderNode = exports.FileNode = void 0;
class BaseNode {
    constructor(fname, fpath, k) {
        this.filename = fname;
        this.path = fpath;
        this.key = k;
    }
}
class FileNode extends BaseNode {
    constructor(fname, fpath, k = Symbol()) {
        super(fname, fpath, k);
        this.ext = fname.split('.').pop();
    }
}
exports.FileNode = FileNode;
class FolderNode extends BaseNode {
    constructor(fname, fpath, isunfold = false, cvnodes = [], k = Symbol()) {
        super(fname, fpath, k);
        this.children = cvnodes;
        this.isUnfold = isunfold;
    }
}
exports.FolderNode = FolderNode;
