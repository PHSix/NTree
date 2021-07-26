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
    table.insert(res, string.sub(s, start_index, last_index))
    start_index = last_index + 1
  end
  return res
end

local dirname = "/home/ph/.local/share/nvim/site/pack/packer/start/node-tree.nvim"

function M.setup()
  vim.fn["remote#host#RegisterPlugin"](
    "node",
    dirname,
    {
      -- vim.api.nvim_eval "{'sync': v:false, 'name': 'NToggle', 'type': 'command', 'opts': {}}",
      {sync = false, name = "NToggle", type = "command", opts = {[true] = 6}},
      {sync = true, name = "NodeTreeAction", type = "function", opts = {[true] = 6}},
      {sync = false, name = "NodeTreeRegister", type = "function", opts = {[true] = 6}},
      {sync = false, name = "TestCommand", type = "command", opts = {[true] = 6}}
    }
  )
  -- local async
  -- 
  -- async =
  --   vim.loop.new_async(
  --   vim.schedule_wrap(
  --     function()
  --       vim.fn.NodeTreeRegister()
  --       async:close()
  --     end
  --   )
  -- )
  -- async:send()
  -- local co =
  --   coroutine.create(
  --   function()
  --     vim.fn.NodeTreeRegister()
  --   end
  -- )
  -- coroutine.resume(co)
end
function _G.node_tree_set_hightlight(groups)
  print(groups);
end


return M
