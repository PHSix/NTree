local check_health = require("node-tree.heath")
local M = {}
local api = vim.api
local loaded = false

local notify = function(msg, args)
  if vim.g.node_tree_channel_id ~= nil then
    vim.rpcnotify(vim.g.node_tree_channel_id, msg, args or {})
  else
    vim.api.nvim_err_writeln [[[NodeTree] Start nodetree failed, check dependences has installed.(To run :NDeps)]]
  end
end

local existWin = function()
  for _, value in pairs(api.nvim_list_wins()) do
    local buf = api.nvim_win_get_buf(value)
    if api.nvim_buf_get_option(buf, "filetype") == "NodeTree" then
      return {status = true, win = value}
    end
    return {status = false}
  end
end

M.toggle = function()
  local res = existWin()
  if res.status == true then
    vim.api.nvim_win_close(res.win, false)
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
  vim.cmd [[autocmd WinEnter * lua require("node-tree")._exit_if_only()]]
  vim.cmd [[autocmd WinEnter * lua require("node-tree")._resize_window()]]
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

function M._resize_window()
  for _, v in pairs(vim.api.nvim_list_wins()) do
    if vim.api.nvim_buf_get_option(vim.api.nvim_win_get_buf(v), "filetype") == "NodeTree" then
      vim.api.nvim_win_set_width(v, 30)
    end
  end
end

function M._exit_if_only()
  if
    #vim.api.nvim_list_wins() == 1 and
      vim.api.nvim_buf_get_option(vim.api.nvim_win_get_buf(0), "filetype") == "NodeTree"
   then
    vim.cmd [[q]]
  end
end
return M
