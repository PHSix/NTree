export interface BaseAttribute {
  icon: string;
  git?: string;
  hlGroup: string;
}
export class BaseElement {
  attribute: BaseAttribute;
  key: symbol;
  filename: string;
  path: string;
  fullpath: string;
  after: BaseElement;
  before: BaseElement;
  parent: BaseElement;
  insertBefore(b: BaseElement) {
    b.before = this.before;
    this.before.after = b;
    this.before = b;
    b.after = this;
  }
  insertAfter(b: BaseElement) {
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
  constructor(filename: string, path: string, parent: BaseElement) {
    this.filename = filename;
    this.path = path;
    this.fullpath = `${path}/${filename}`;
    this.parent = parent;
    this.key = Symbol();
  }
}
