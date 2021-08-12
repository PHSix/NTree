# Introduction

NodeTree is a ~~remote plugin~~(Now it dont use neovim provide `remote plugin function`. NodeTree build it by channel and rpc.) of files tree for neovim.

It was wrote by typescript and run on nodejs.

## Why NodeTree?

Although at the moment, there has many files tree plugin for vim/neovim. Like `nvim-tree.lua` which is a light, fast and strong files tree plugin, `chadtree` which is a fast, powerful files tree plugin. I still want to write a files tree plugin for myself. It is customized for myself. It was created from my demands. And I can control it to do something.

NodeTree inspired bv `neovim-remote-plugin`, so it will spend too less startuptime. And Nodejs let it powerful and fast.

# Dependenies

- nodejs
- neovim
- [patch font](https://nerdfonts.com) (Need a patch font to right to display file icon.)

# Inspried

- neovim-remote-plugin
- [node-client](https://github.com/neovim/node-client)
- nodejs
- [chadtree](https://github.com/ms-jpq/chadtree)
- [nvim-tree.lua](https://github.com/kyazdani42/nvim-tree.lua)

# Installtion

> Please check your system has installed [nodejs](https://nodejs.org/). It was the dependency of this plugin.

If you use vim-plug :

```vimL
Plug 'PHSix/node-tree.nvim'
```

If you use packer.nvim :

```lua
-- Assuredly you can loaded NodeTree as start neovim, NodeTree dont spend too match staruptime, but I more accustomed to load lazily.
use {
  "PHSix/node-tree.nvim",
  cmd = "NToggle"
}
```

# Config

> **Your need run `:NDeps` at the first time if you dont install the nodejs dependenies.**

If your dont want to hide dotfile when open NodeTree.

vimL version:

```vimL
let g:node_tree_hide_files = v:false
```

lua version:

```lua
vim.g.node_tree_hide_files = true
```

## Remap keymap

vimL version:

```vimscript
let g:node_tree_map = {
      \ "dirUp": "u",
      \ "touch": "cn",
      \ "mkdir": "mk",
      \ "rename": "rn",
      \ "delete": "dd",
      \ "hide": "zh",
      \ "edit": ["o", "<CR>"],
      \ "quit": 'q',
      \}
```

lua version:

```lua
vim.g.node_tree_map = {
  hide = "zh",
  edit = {"o", "<CR>"},
  dirUp = "u",
  rename = "rn",
  delete = "dd",
  touch = "cn",
  mkdir = "mk"
}

```

support actions.

| action | keymap     | desc                                                       |
| ------ | ---------- | ---------------------------------------------------------- |
| dirUp  | u          | Switch the project to the upper level directory.           |
| rename | rn         | Rename file of folder.                                     |
| touch  | cn         | Touch a file.                                              |
| mkdir  | mk         | Make a directory                                           |
| edit   | [o, enter] | If target is a file, NodeTree will open, folder as toggle. |
| delete | dd         | delete a file                                              |
| hide   | zh         | Toggle hide dotfile or not                                 |

# TODO

- [ ] git status support
- [ ] float window show keymap
- [ ] vsplit and split window to view
