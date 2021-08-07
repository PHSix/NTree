local check_health = require("node-tree.heath")
local M = {}
local api = vim.api
local loaded = false

local dirname = "/home/ph/.local/share/nvim/site/pack/packer/start/node-tree.nvim"

local notify = function(msg)
  vim.rpcnotify(vim.g.node_tree_channel_id, msg, {})
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

function M.setup()
  if loaded then
    return
  end
  local health = check_health()
  if health["status"] == false then
    return
  end
  vim.cmd [[command! NToggle lua require("node-tree").toggle()]]
end

return M
