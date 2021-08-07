return function()
  if vim.fn.executable("node") ~= 1 then
    vim.cmd [[echoerr "[NodeTree] You have not install node.js!"]]
    return {
      status = false
    }
  end
  local exec_tool
  local dependences
  local build
  if vim.fn.executable("npm") == 1 then
    exec_tool = "npm"
    dependences = "npm install"
    build = "npm run build"
  end
  if vim.fn.executable("cnpm") == 1 then
    exec_tool = "cnpm"
    dependences = "cnpm install"
    build = "cnpm run build"
  end
  if vim.fn.executable("yarn") == 1 then
    exec_tool = "yarn"
    dependences = "yarn"
    build = "yarn build"
  end
  if exec_tool == nil then
    vim.cmd [[echoerr "[NodeTree] You have not install a package manager for node.js!"]]
    return {
      status = false
    }
  end
  return {
    status = true,
    dependences = dependences,
    build = build
  }
end
