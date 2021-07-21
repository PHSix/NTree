//
// Tools to help development.
//
import {Neovim} from 'neovim'
import { Store } from './Store'

export async function Log(message){
  await Store.nvim.outWrite(`${message}\n`)
}
