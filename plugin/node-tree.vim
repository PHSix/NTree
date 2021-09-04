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
    " let s:install_dep_cmd = printf("%s install", s:package_tool)
    let s:install_dep_cmd = [s:package_tool, "install"]
  elseif executable("yarn")==1
    let s:package_tool = "yarn"
    let s:install_dep_cmd = ["s:package_tool"]
  elseif executable("npm")==1
    let s:package_tool = "npm"
    let s:install_dep_cmd = [s:package_tool, "install"]
  else
    echoerr "[NodeTree] You dont has nodejs package manager!(you maybe need to install a cli tool like npm.)"
    return
  endif
  call system(printf("rm -rf %s/node_modules", s:dirname))
  let s:install_dep_cmd = printf("cd %s && %s", s:dirname, s:install_dep_cmd)
  echom "[NodeTree] Your are installing nodejs dependences...."
  " call system(s:install_dep_cmd)
  let l:shell_opts = {}
  function! l:shell_opts.on_stdout(chan_id, msg,event) abort
    echom a:msg
  endfunction
  function! l:shell_opts.on_stderr(chan_id, msg,event) abort
    echom "[NodeTree] Your has installed nodejs dependences."
    call s:next()
  endfunction
  call jobstart(["yarn"], l:shell_opts)
endfunction

function! s:node_error_msg_notify()
  echoerr "[NodeTree] You need run NDeps at the first time to install dependences..."
endfunction

function s:next() abort

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
  lua require('node-tree').setup()
endfunction

if empty(glob(printf('%s/node_modules', s:dirname))) > 0
  command! NDeps call s:node_install_deps()

  command! NToggle call s:node_error_msg_notify()
  finish
endif

call s:next()
