import { Store } from './Store';
import { Option } from './Option';
import { ParseVNode } from './Fs';
import { FileNode, FolderNode, VNode } from './Node';
import { ParseFileIcon, ParseFolderIcon } from './Icons';

interface HighlightTag {
  line: number;
  start: number;
  end: number;
  group: string;
}

export default async function Render() {
  Store.root = (await ParseVNode(Store.pwd)) as FolderNode;
  const [h_text, h_higroup] = ParseVDom(Store.root);
  await h(h_text, h_higroup);
  Store.textCache = h_text;
}

export async function UpdateRender() {
  const [h_text, h_higroup] = ParseVDom(Store.root);
  await h(h_text, h_higroup);
  Store.textCache = h_text;
}

function defineHighlight(h_higroup: HighlightTag[]) {
  for (let hi of h_higroup) {
    Store.buffer.addHighlight({
      hlGroup: hi.group,
      line: hi.line,
      colStart: hi.start,
      colEnd: hi.end,
      srcId: Option.namespace_id,
    });
  }
}

// NOTE: Can not use promise all to render highlight rules and text.
async function h(ctx: string[], h_higroup: HighlightTag[]) {
  await hText(ctx);
  defineHighlight(h_higroup);
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

/*
  * parse VDom
  * @return [string[], HighlightTags]
  * */
function ParseVDom(vnode: VNode): [string[], HighlightTag[]] {
  const root_param_length = Store.pwd.split('/').length - 1;
  let depth = 0;
  let counter = 0;
  const h_higroup: HighlightTag[] = [];
  const h_text: string[] = [];
  const handleFile = (vfile: FileNode) => {
    if (Option.hide_file === true && vfile.filename[0] === '.') {
      return;
    }
    const [icon, icon_hi_group] = ParseFileIcon(vfile.filename,vfile.ext);

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
  const handleFolder = (vfolder: FolderNode) => {
    if (Option.hide_file === true && vfolder.filename[0] === '.') {
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
    h_text.push(
      `${'  '.repeat(depth)} ${ParseFolderIcon(
        vfolder.filename,
        vfolder.isUnfold
      )} ${vfolder.filename}`
    );
  };
  IteratorDFS(vnode, handleFile, handleFolder);
  return [h_text, h_higroup];
}

function IteratorDFS(
  vnode: VNode,
  hfile: (vfile: FileNode) => void,
  hfolder: (vfolder: FolderNode) => void
) {
  const vnodeArr: VNode[] = [];
  while (true) {
    if (vnode instanceof FolderNode) {
      hfolder(vnode);
      if (vnode.isUnfold === true) {
        vnodeArr.splice(0, 0, ...vnode.children);
      }
    } else {
      hfile(vnode);
    }
    if (vnodeArr.length === 0) {
      break;
    }
    vnode = vnodeArr.shift();
  }
  return [];
}
