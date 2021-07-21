const dirname = expand("<sfile>:p:h:h")
call remote#host#RegisterPlugin('node', dirname, [
      \ {'sync': v:false, 'name': 'NToggle', 'type': 'command', 'opts': {}},
      \ {'sync': v:false, 'name': 'NodeTreeAction', 'type': 'function', 'opts': {}},
      \ {'sync': v:false, 'name': 'TestCommand', 'type': 'command', 'opts': {}},
      \ ])
" \ {'sync': v:false, 'name': 'TestCommand', 'type': 'command', 'opts': {}},
" \ {'sync': v:false, 'name': 'LightTreeAction', 'type': 'function', 'opts': {}},

