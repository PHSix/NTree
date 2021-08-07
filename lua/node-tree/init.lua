local check_health = require("node-tree.heath")
local M = {}
local api = vim.api
local loaded = false

local job_id
local dirname
local job_opts = {}
job_opts.on_exit = function(args)
  local code = unpack(args)
  local msg = "[NodeTree] NodeTree EXITED " .. code
  vim.api.nvim_err_writeln(msg)
  job_id = nil
end
job_opts.on_stdout = function(args)
  local msg = unpack(args)
  api.nvim_out_write(msg .. "\n")
end

job_opts.on_stderr = function(args)
  local msg = unpack(args)
  api.nvim_out_write(msg .. "\n")
end

local start_job = function()
  if not dirname then
    return
  end
  job_opts = dirname
  job_id = api.nvim_call_function("jobstart", {{"node", dirname .. "/build/index.js"}, job_opts})
end

local notify = function(msg)
  vim.rpcnotify(job_id, msg, {})
end

local existWin = function()
  for _, value in pairs(api.nvim_list_wins) do
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

function M.setup(arg)
  if loaded then
    return
  end
  dirname = arg
  local health = check_health()
  if health["status"] then
    return
  end
  start_job()
  vim.cmd [[command! NToggle lua require("node-tree").toggle()]]
end

return M
