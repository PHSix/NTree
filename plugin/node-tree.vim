if exists('g:node_tree_loaded') == 1
  finish
endif

let g:node_tree_loaded = 1
let g:node_tree_map = {
      \ "dirUp": "u",
      \ "touch": "cn",
      \ "mkdir": "mk",
      \ "rename": "rn",
      \ "delete": "dd",
      \ "hide": "zh",
      \"edit": ["o", "<CR>"]
      \}
let g:node_tree_hide_files = v:true
" Check system has nodejs ?
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
" Auto install dependencies
if isdirectory(printf("%s/node_modules", s:dirname)) == 0
  echom "[ NodeTree ]: Installing dependencies..."
  call system(s:install_dep_cmd)
  echom "[ NodeTree ]: Has insalled dependencies..."
endif
let s:build_source = printf("cd %s && %s", s:dirname, s:build_source)
" Auto build typescript source to javascript
if isdirectory(printf("%s/out", s:dirname)) == 0
  echom "[ NodeTree ]: Building source..."
  call system(s:build_source)
  echom "[ NodeTree ]: Build complete!"
endif

" Aim to close NodeTree window when the whole screen has only a window.
function! s:node_tree_close()
  if &filetype=="NodeTree" && len(nvim_list_wins()) == 1
    :q
  endif
endfunction

function! NodeTreeMap()
endfunction

function! s:node_tree_map()
  call nvim_buf_set_keymap(0, 'n', 'q', ':q<CR>', {"silent": v:true})
  for [key,value] in items(g:node_tree_map)
    if type(value) == type([])
      for item in value
        call nvim_buf_set_keymap(0, 'n', item, printf(":call NodeTreeAction('%s')<CR>", key), {"silent": v:true})
      endfor
    else
      call nvim_buf_set_keymap(0, 'n', value, printf(":call NodeTreeAction('%s')<CR>", key), {"silent": v:true})
    endif
  endfor
endfunction

augroup NodeTreeAugroup
  autocmd BufEnter * call s:node_tree_close()
  autocmd FileType NodeTree call s:node_tree_map()
augroup END

call remote#host#RegisterPlugin('node', s:dirname, [
      \ {'sync': v:false, 'name': 'NToggle', 'type': 'command', 'opts': {}},
      \ {'sync': v:false, 'name': 'NodeTreeAction', 'type': 'function', 'opts': {}},
      \ ])
