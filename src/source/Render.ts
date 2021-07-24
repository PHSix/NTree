import { Store } from './Store';
import { Option } from './Option';
import { ParseVNode } from './Fs';
import { FileNode, FolderNode, VNode } from './Node';
import { ParseFileIcon, ParseFolderIcon } from './Icons';

interface HighlightTags {
  counter: number;
  lines: number[];
}

export default async function Render() {
  Store.root = (await ParseVNode(Store.pwd)) as FolderNode;
  const [h_text, h_higroup] = ParseVDom(Store.root);
  Store.textCache = h_text;
  h(h_text, h_higroup);
}

export async function UpdateRender() {
  const [h_text, h_higroup] = ParseVDom(Store.root);
  Store.textCache = h_text;
  h(h_text, h_higroup);
}

// NOTE: Can not use promise all to render highlight rules and text.
async function h(ctx: string[], h_higroup: HighlightTags) {
  // await Promise.all<void>([defineHighlight(h_higroup), hText(ctx)]);
  await hText(ctx).then(() => defineHighlight(h_higroup));
}

async function defineHighlight(h_higroup: HighlightTags) {
  const hi_queue: Promise<void>[] = [];
  h_higroup.lines.forEach((line) => {
    hi_queue.push(defineGroup('BufferLineError', line));
  });
  Promise.all(hi_queue);
}

async function defineGroup(hlGroup: string, line: number) {
  await Store.buffer.addHighlight({
    hlGroup,
    line,
    colStart: 0,
    colEnd: -1,
    srcId: Option.namespace_id,
  });
}

async function hText(ctx: string[]) {
  await Promise.all([
    Store.buffer.setOption('modifiable', true),
    Store.buffer.setLines(ctx, {
      start: 0,
      strictIndexing: true,
      end: await Store.buffer.length,
    }),
    Store.buffer.setOption('modifiable', false),
  ]);
}

//
// parse VDom
// @return [string[], HighlightTags]
//
function ParseVDom(vnode: VNode): [string[], HighlightTags] {
  const root_param_length = Store.pwd.split('/').length - 1;
  const h_higroup: HighlightTags = {
    counter: 0,
    lines: [],
  };
  const h_text: string[] = [];
  const handleFile = (vfile: FileNode) => {
    if (Option.hidden_file === true && vfile.filename[0] === '.') {
      return;
    }
    h_higroup.counter++;
    h_text.push(
      `${'  '.repeat(
        vfile.path.split('/').length - root_param_length
      )} ${ParseFileIcon(vfile.ext)} ${vfile.filename}`
    );
  };
  const handleFolder = (vfolder: FolderNode) => {
    if (Option.hidden_file === true && vfolder.filename[0] === '.') {
      return;
    }
    h_higroup.counter++;
    h_higroup.lines.push(h_higroup.counter - 1);
    h_text.push(
      `${'  '.repeat(
        vfolder.path.split('/').length - root_param_length
      )} ${ParseFolderIcon(vfolder.filename, vfolder.isUnfold)} ${
        vfolder.filename
      }`
    );
  };
  DFS(vnode, handleFile, handleFolder);
  return [h_text, h_higroup];
}

function DFS(
  vnode: VNode,
  hfile: (vfile: FileNode) => void,
  hfolder: (vfolder: FolderNode) => void
) {
  if (vnode instanceof FolderNode) {
    hfolder(vnode);
    if (vnode.isUnfold === true) {
      for (let childVNode of vnode.children) {
        DFS(childVNode, hfile, hfolder);
      }
    }
    return;
  } else {
    hfile(vnode);
    return;
  }
}
