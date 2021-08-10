if exists('g:node_tree_loaded') == 1
  finish
endif

let g:node_tree_loaded = 1

if executable("node") == 0
  echoerr "[NodeTree] Please check your computer has install nodejs..."
  finish
endif

let s:dirname = expand("<sfile>:h:h")

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
