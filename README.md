# Introduction

NodeTree is a remote plugin of files tree for neovim.

It was wrote in typescript and run on nodejs.

#Inspried

- neovim-remote-plugin
- [node-client](https://github.com/neovim/node-client)
- nodejs
- [chadtree](https://github.com/ms-jpq/chadtree)
- [nvim-tree.lua](https://github.com/kyazdani42/nvim-tree.lua)

# Installtion

> Please check your system has installed [nodejs](https://nodejs.org/). It was the dependency of this plugin.

# Config

If your dont want to hide dotfile when open NodeTree.

vimL version:

```vimL
let g:node_tree_hide_files = v:false
```

Remap keymap:
lua version:

```lua
vim.g.node_tree_hide_files = true
```

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

| action | keymap    | desc                                                       |
| ------ | --------- | ---------------------------------------------------------- |
| dirUp  | u         | Switch the project to the upper level directory.           |
| rename | rn        | Rename file of folder.                                     |
| touch  | cn        | Touch a file.                                              |
| mkdir  | mk        | Make a directory                                           |
| edit   | [o, <cr>] | If target is a file, NodeTree will open, folder as toggle. |
| delete | dd        | delete a file                                              |
| hide   | zh        | Toggle hide dotfile or not                                 |
