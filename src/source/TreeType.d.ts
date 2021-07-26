import { Buffer, Neovim, Window } from 'neovim';
import { FolderNode } from './Node';

export interface InterfaceStore {
  buffer?: Buffer;
  pwd?: string;
  // open file in this window.
  window?: Window;
  nvim?: Neovim;
  root?: FolderNode;
  textCache?: string[];
}

interface KeyMap {
  key: string;
  value: string;
}

export interface InterfaceOption {
  namespace_id?: number;
  hidden_file: boolean;
  keymaps: KeyMap[];
  defaultKeyMaps: KeyMap[];
}

export interface HiGroup {
  hlGroup: string;
  line: number;
}

export interface Icon {
  value: string;
  color: string;
}
