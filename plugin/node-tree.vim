" if g:node_tree_loaded == 1
"   finish
" endif


let g:node_tree_loaded = 1
if executable("node") == 0
  echoerr "Please check your computer has install nodejs..."
  finish
endif

const s:dirname = expand("<sfile>:h:h")

if executable("yarn")==1
  let s:package_tool = "yarn"
elseif executable("cnpm")==1
  let s:package_tool = "cnpm"
elseif executable("npm")==1
  let s:package_tool = "npm"
else
  echoerr "Dont has package manager!"
  finish
endif

if s:package_tool == "yarn"
  let s:install_dep_cmd = s:package_tool
else
  let s:install_dep_cmd = printf("%s install", s:package_tool)
endif

if s:package_tool == "yarn"
  let s:build_source = printf("%s build", s:package_tool)
else
  let s:build_source = printf("%s run build", s:package_tool)
endif
let s:install_dep_cmd = printf("cd %s && %s", s:dirname, s:install_dep_cmd)
if isdirectory(printf("%s/node_modules", s:dirname)) == 0
  echom "[ NodeTree ]: Installing dependencies..."
  call system(s:install_dep_cmd)
  echom "[ NodeTree ]: Has insalled dependencies..."
endif
let s:build_source = printf("cd %s && %s", s:dirname, s:build_source)
if isdirectory(printf("%s/out", s:dirname)) == 0
  echom "[ NodeTree ]: Building source..."
  call system(s:build_source)
  echom "[ NodeTree ]: Build complete!"
endif



call remote#host#RegisterPlugin('node', s:dirname, [
      \ {'sync': v:false, 'name': 'NToggle', 'type': 'command', 'opts': {}},
      \ {'sync': v:false, 'name': 'NodeTreeAction', 'type': 'function', 'opts': {}},
      \ ])
" lua require("node-tree").setup()
