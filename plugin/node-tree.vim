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
  call system(printf("rm -rf %s/node_modules", s:dirname))
  echom "[NodeTree] You are installing nodejs dependences...."
  let l:shell_opts = {}
  function! l:shell_opts.on_stdout(chan_id, msg,event) abort
    echom a:msg[0]
  endfunction
  function! l:shell_opts.on_exit(chan_id, msg,event) abort
    echom "[NodeTree] You has installed nodejs dependences."
    call s:start()
  endfunction
  call jobstart(["bash", printf("%s/script/deps.sh", s:dirname), s:dirname], l:shell_opts)
endfunction

function! s:node_error_msg_notify()
  echoerr "[NodeTree] You need run NDeps at the first time to install dependences..."
endfunction

function s:start() abort

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

call s:start()
