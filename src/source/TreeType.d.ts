import { Buffer, Neovim, Window } from 'neovim';
import { VNode } from './Node';

export interface InterfaceStore {
  buffer?: Buffer;
  pwd?: string;
  // open file in this window.
  window?: Window;
  nvim?: Neovim;
  root?: VNode;
}

interface KeyMap {
  key: string;
  value: string;
}

export interface InterfaceOption {
  namespace_id?: number;
  hidden_file: boolean;
  keymap: KeyMap[];
}

export interface HiGroup {
  hlGroup: string;
  line: number;
}

