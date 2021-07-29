import { Store } from './Store';
import { Option } from './Option';
import { ParseVNode } from './Fs';
import { FileNode, FolderNode, VNode } from './Node';
import { ParseFileIcon, ParseFolderIcon } from './Icons';
import { getVNodeGitStatus } from './Git';

interface HighlightTag {
  line: number;
  start: number;
  end: number;
  group: string;
}

interface GitTag {
  line: number;
  event: string;
}

export async function Render() {
  if (!Store.root) {
    Store.root = (await ParseVNode(Store.pwd)) as FolderNode;
  }
  const [h_text, h_higroup, h_gitgroup] = await ParseVDom(Store.root);
  await h(h_text, h_higroup, h_gitgroup);
  Store.textCache = h_text;
}

// NOTE: Can not use promise all to render highlight rules and text.
async function h(
  ctx: string[],
  h_higroup: HighlightTag[],
  h_gitgroup: GitTag[]
) {
  await hText(ctx);
  defineHighlight(h_higroup);
  setGitVirtualText(h_gitgroup);
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

function setGitVirtualText(h_gitgroup: GitTag[]) {
  for (let hi of h_gitgroup) {
    let hi_group:string;
    if (hi.event.match('A')) {
      hi_group = 'NodeTreeGitAdd';
    } else {
      hi_group = 'NodeTreeGitMod';
    }
    Store.buffer.setVirtualText(Option.namespace_id, hi.line, [
      [hi.event, hi_group],
    ]);
  }
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
async function ParseVDom(
  vnode: VNode
): Promise<[string[], HighlightTag[], GitTag[]]> {
  const root_param_length = Store.pwd.split('/').length - 1;
  let depth = 0;
  let counter = 0;
  const git_queue: Promise<string>[] = [];
  const h_gitgroup: GitTag[] = [];
  const h_higroup: HighlightTag[] = [];
  const h_text: string[] = [];
  const handleFile = (vfile: FileNode) => {
    // TODO: Get git status
    git_queue.push(getVNodeGitStatus(vfile.path, vfile.filename));

    if (Option.hide_file === true && vfile.filename[0] === '.') {
      return;
    }
    const [icon, icon_hi_group] = ParseFileIcon(vfile.filename, vfile.ext);

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
    // TODO: Get git status
    git_queue.push(getVNodeGitStatus(vfolder.path, vfolder.filename));

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
  await Promise.all<string>(git_queue).then((result) => {
    result.forEach((git, index) => {
      if (git.length !== 0) {
        h_gitgroup.push({ line: index, event: git });
      }
    });
  });
  return [h_text, h_higroup, h_gitgroup];
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
