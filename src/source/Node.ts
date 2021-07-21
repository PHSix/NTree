class BaseNode {
  filename: string;
  path: string;
  key: symbol;
  constructor(fname: string, fpath: string, k: symbol) {
    this.filename = fname;
    this.path = fpath;
    this.key = k;
  }
}

export class FileNode extends BaseNode {
  ext: string;
  // color: string;
  constructor(fname: string, fpath: string, k: symbol = Symbol()) {
    super(fname, fpath, k);
    this.ext = fname.split('.').pop();
  }
}
export class FolderNode extends BaseNode {
  isUnfold: boolean;
  children: VNode[];
  constructor(
    fname: string,
    fpath: string,
    isunfold: boolean = false,
    cvnodes: VNode[] = [],
    k: symbol = Symbol()
  ) {
    super(fname, fpath, k);
    this.children = cvnodes;
    this.isUnfold = isunfold;
  }
}

export type VNode = FileNode | FolderNode;
