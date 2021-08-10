local check_health = require("node-tree.heath")
local M = {}
local api = vim.api
local loaded = false

local dirname

local notify = function(msg, args)
  vim.rpcnotify(vim.g.node_tree_channel_id, msg, args or {})
  -- vim.rpcnotify(vim.g.translator_node_channel_id, to, args)
end

local existWin = function()
  for _, value in pairs(api.nvim_list_wins()) do
    local buf = api.nvim_win_get_buf(value)
    if api.nvim_buf_get_option(buf, "filetype") == "NodeTree" then
      return true
    end
  end
end

M.toggle = function()
  if (existWin()) then
    notify("close")
  else
    notify("open")
  end
end

M.action = function(ac)
  if (vim.g._node_tree_rendered == nil or vim.g._node_tree_rendered == 1) then
    notify("action", {ac})
  end
end

function M.setup()
  if loaded then
    return
  end
  local health = check_health()
  if health["status"] == false then
    return
  end
  vim.cmd [[augroup nodetree]]
  vim.cmd [[autocmd FileType NodeTree lua require("node-tree").registerKeymap()]]
  vim.cmd [[augroup END]]
  vim.cmd [[command! NToggle lua require("node-tree").toggle()]]
end

function M.registerKeymap()
  local default_opts = {silent = true}
  api.nvim_buf_set_keymap(0, "n", "q", ":q<CR>", default_opts)
  api.nvim_buf_set_keymap(0, "n", "o", ":lua require('node-tree').action('operate')<CR>", default_opts)
  api.nvim_buf_set_keymap(0, "n", "u", ":lua require('node-tree').action('dirup')<CR>", default_opts)
  api.nvim_buf_set_keymap(0, "n", "a", ":lua require('node-tree').action('append')<CR>", default_opts)
  api.nvim_buf_set_keymap(0, "n", "rn", ":lua require('node-tree').action('rename')<CR>", default_opts)
  api.nvim_buf_set_keymap(0, "n", "cn", ":lua require('node-tree').action('touch')<CR>", default_opts)
  api.nvim_buf_set_keymap(0, "n", "mk", ":lua require('node-tree').action('mkdir')<CR>", default_opts)
  api.nvim_buf_set_keymap(0, "n", "zh", ":lua require('node-tree').action('hide')<CR>", default_opts)
  api.nvim_buf_set_keymap(0, "n", "dd", ":lua require('node-tree').action('remove')<CR>", default_opts)
end

function M.registerDirname(dir)
	dirname = unpack(dir)
end

return M
