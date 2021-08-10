if exists('g:node_tree_loaded') == 1
  finish
endif

let g:node_tree_hide_files = v:true
let g:node_tree_loaded = 1

if executable("node") == 0
  echoerr "[NodeTree] Please check your computer has install nodejs..."
  finish
endif

let s:dirname = expand("<sfile>:h:h")

function! s:node_install_deps() 
  if executable("cnpm")==1
    let s:package_tool = "cnpm"
    let s:install_dep_cmd = printf("%s install", s:package_tool)
  elseif executable("yarn")==1
    let s:package_tool = "yarn"
    let s:install_dep_cmd = s:package_tool
  elseif executable("npm")==1
    let s:package_tool = "npm"
    let s:install_dep_cmd = printf("%s install", s:package_tool)
  else
    echoerr "[NodeTree] You dont has nodejs package manager!(you maybe need to install a cli tool like npm.)"
    return
  endif
  let s:install_dep_cmd = printf("cd %s && %s", s:dirname, s:install_dep_cmd)
  echom "[NodeTree] Your are installing nodejs dependences...."
  call system(s:install_dep_cmd)
  echom "[NodeTree] Your has installed nodejs dependences."
endfunction

command! NDeps call s:node_install_deps()

if empty(glob(printf('%s/node_modules', s:dirname))) > 0
  finish
endif


let s:job_opts = {}
let s:std_err = []

call jobstart(['node', printf("%s/build/index.js", s:dirname)], s:job_opts)

function! s:job_opts.on_stderr(chan_id, data, event) dict
  call extend(s:std_err, a:data)
endfunction

function! s:job_opts.on_exit(chan_id, code, event) dict
  let g:node_tree_channel_id = 0
  if a:code != 0
    for msg in s:std_err
      echoerr msg
    endfor
  endif
endfunction
call luaeval('require("node-tree").registerDirname(...)', [s:dirname])
lua require('node-tree').setup()
