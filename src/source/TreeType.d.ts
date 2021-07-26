import { Buffer, Neovim, Window } from 'neovim';
import { FolderNode } from './Node';

export interface InterfaceStore {
  buffer?: Buffer;
  pwd?: string;
  window?: Window;
  nvim?: Neovim;
  root?: FolderNode;
  textCache?: string[];
  cwd?: string;
}

interface KeyMap {
  [key: string]:string;
}

export interface InterfaceOption {
  namespace_id?: number;
  hide_file: boolean;
}

export interface HiGroup {
  hlGroup: string;
  line: number;
}

export interface Icon {
  value: string;
  color: string;
}
