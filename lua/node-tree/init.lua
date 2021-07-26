local M = {}
local runtimePath = vim.o.runtimepath

local function split_string(s, char)
  local start_index = 1
  local last_index = 1
  local res = {}
  while true do
    last_index = string.find(s, char, start_index)
    if not last_index then
      table.insert(res, string.sub(s, start_index, string.len(s)))
      break
    end
    table.insert(res, string.sub(s, start_index, last_index - 1))
    start_index = last_index + 1
  end
  return res
end

local dirname
for _, path in pairs(split_string(runtimePath, ",")) do
  if string.match(path, "node.tree.nvim") then
    dirname = path
  end
end

function M.setup()
  local package_tool = "yarn"
  if vim.fn.executable("node") == 0 then
    vim.cmd [[echoerr "Please check your computer has install nodejs..."]]
    return
  end
  if vim.fn.executable("yarn") then
  elseif vim.fn.executable("cnpm") then
    package_tool = "cnpm"
  elseif vim.fn.executable("npm") then
    package_tool = "npm"
  end
  local install_dep_cmd
  if package_tool == "yarn" then
    install_dep_cmd = package_tool
  else
    install_dep_cmd = string.format("%s install")
  end

  local build_source
  if package_tool == "yarn" then
    build_source = "yarn add"
  else
    build_source = string.format("%s run build")
  end

  if io.open(dirname .. "/node_modules", "r") == nil then
    vim.cmd [[echom "NodeTree: Installing dependencies..."]]
    local cmd = string.format("cd %s && %s", dirname, install_dep_cmd)
    vim.fn.system(cmd)
  end
  if io.open(dirname .. "/out", "r") == nil then
    vim.cmd [[echom "NodeTree: build source ..."]]
    vim.fn.system(build_source)
    vim.cmd [[echom "NodeTree: complete."]]
  end
  vim.fn["remote#host#RegisterPlugin"](
    "node",
    dirname,
    {
      -- vim.api.nvim_eval "{'sync': v:false, 'name': 'NToggle', 'type': 'command', 'opts': {}}",
      {sync = false, name = "NToggle", type = "command", opts = {[true] = 6}},
      {sync = true, name = "NodeTreeAction", type = "function", opts = {[true] = 6}}
    }
  )
end

return M
