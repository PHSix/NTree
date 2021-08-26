"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseElement = void 0;
class BaseElement {
    constructor(filename, path, parent) {
        this.filename = filename;
        this.path = path;
        this.fullpath = `${path}/${filename}`;
        this.parent = parent;
        this.key = Symbol();
    }
    findNextElement(hide) {
        var point = this.after;
        if (hide) {
            while (point) {
                if (point.filename[0] === ".") {
                    point = point.after;
                }
                else {
                    break;
                }
            }
            return point;
        }
        else {
            return point;
        }
    }
    insertBefore(b) {
        b.before = this.before;
        this.before.after = b;
        this.before = b;
        b.after = this;
    }
    insertAfter(b) {
        b.before = this;
        b.after = this.after;
        this.after.before = b;
        this.after = b;
    }
    removeBefore() {
        if (this.before !== null && this.before.before !== null)
            this.before = this.before.before;
    }
    removeAfter() {
        if (this.after !== null && this.after.after !== null)
            this.after = this.after.after;
    }
}
exports.BaseElement = BaseElement;
