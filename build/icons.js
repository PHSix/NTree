"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const icons = {
    gruntfile: {
        icon: '',
        name: 'Gruntfile',
    },
    gulpfile: {
        icon: '',
        name: 'Gulpfile',
    },
    dropbox: {
        icon: '',
        name: 'Dropbox',
    },
    xls: {
        icon: '',
        name: 'Xls',
    },
    doc: {
        icon: '',
        name: 'Doc',
    },
    ppt: {
        icon: '',
        name: 'Ppt',
    },
    xml: {
        icon: '謹',
        name: 'Xml',
    },
    webpack: {
        icon: 'ﰩ',
        name: 'Webpack',
    },
    '.settings.json': {
        icon: '',
        name: 'SettingsJson',
    },
    cs: {
        icon: '',
        name: 'Cs',
    },
    procfile: {
        icon: '',
        name: 'Procfile',
    },
    svg: {
        icon: 'ﰟ',
        name: 'Svg',
    },
    '.bashprofile': {
        icon: '',
        name: 'BashProfile',
    },
    '.bashrc': {
        icon: '',
        name: 'Bashrc',
    },
    '.babelrc': {
        icon: 'ﬥ',
        name: 'Babelrc',
    },
    '.ds_store': {
        icon: '',
        name: 'DsStore',
    },
    git: {
        icon: '',
        name: 'GitLogo',
    },
    '.gitattributes': {
        icon: '',
        name: 'GitAttributes',
    },
    '.gitconfig': {
        icon: '',
        name: 'GitConfig',
    },
    '.gitignore': {
        icon: '',
        name: 'GitIgnore',
    },
    '.gitmodules': {
        icon: '',
        name: 'GitModules',
    },
    COMMIT_EDITMSG: {
        icon: '',
        name: 'GitCommit',
    },
    COPYING: {
        icon: '',
        name: 'License',
    },
    'COPYING.LESSER': {
        icon: '',
        name: 'License',
    },
    '.gitlab-ci.yml': {
        icon: '',
        name: 'GitlabCI',
    },
    '.gvimrc': {
        icon: '',
        name: 'Gvimrc',
    },
    '.npmignore': {
        icon: '',
        name: 'NPMIgnore',
    },
    '.vimrc': {
        icon: '',
        name: 'Vimrc',
    },
    '.zshrc': {
        icon: '',
        name: 'Zshrc',
    },
    '.zshenv': {
        icon: '',
        name: 'Zshenv',
    },
    '.zprofile': {
        icon: '',
        name: 'Zshprofile',
    },
    Dockerfile: {
        icon: '',
        name: 'Dockerfile',
    },
    Gemfile$: {
        icon: '',
        name: 'Gemfile',
    },
    LICENSE: {
        icon: '',
        name: 'License',
    },
    Vagrantfile$: {
        icon: '',
        name: 'Vagrantfile',
    },
    _gvimrc: {
        icon: '',
        name: 'Gvimrc',
    },
    _vimrc: {
        icon: '',
        name: 'Vimrc',
    },
    ai: {
        icon: '',
        name: 'Ai',
    },
    awk: {
        icon: '',
        name: 'Awk',
    },
    bash: {
        icon: '',
        name: 'Bash',
    },
    bat: {
        icon: '',
        name: 'Bat',
    },
    bmp: {
        icon: '',
        name: 'Bmp',
    },
    c: {
        icon: '',
        name: 'C',
    },
    'c++': {
        icon: '',
        name: 'CPlusPlus',
    },
    cc: {
        icon: '',
        name: 'CPlusPlus',
    },
    clj: {
        icon: '',
        name: 'Clojure',
    },
    cljc: {
        icon: '',
        name: 'ClojureC',
    },
    cljs: {
        icon: '',
        name: 'ClojureJS',
    },
    'CMakeLists.txt': {
        icon: '',
        name: 'CMakeLists',
    },
    cmake: {
        icon: '',
        name: 'CMake',
    },
    coffee: {
        icon: '',
        name: 'Coffee',
    },
    conf: {
        icon: '',
        name: 'Conf',
    },
    'config.ru': {
        icon: '',
        name: 'ConfigRu',
    },
    cp: {
        icon: '',
        name: 'Cp',
    },
    cpp: {
        icon: '',
        name: 'Cpp',
    },
    csh: {
        icon: '',
        name: 'Csh',
    },
    cson: {
        icon: '',
        name: 'Cson',
    },
    css: {
        icon: '',
        name: 'Css',
    },
    cxx: {
        icon: '',
        name: 'Cxx',
    },
    d: {
        icon: '',
        name: 'D',
    },
    dart: {
        icon: '',
        name: 'Dart',
    },
    db: {
        icon: '',
        name: 'Db',
    },
    diff: {
        icon: '',
        name: 'Diff',
    },
    dockerfile: {
        icon: '',
        name: 'Dockerfile',
    },
    dump: {
        icon: '',
        name: 'Dump',
    },
    edn: {
        icon: '',
        name: 'Edn',
    },
    eex: {
        icon: '',
        name: 'Eex',
    },
    ejs: {
        icon: '',
        name: 'Ejs',
    },
    elm: {
        icon: '',
        name: 'Elm',
    },
    erl: {
        icon: '',
        name: 'Erl',
    },
    ex: {
        icon: '',
        name: 'Ex',
    },
    exs: {
        icon: '',
        name: 'Exs',
    },
    'f#': {
        icon: '',
        name: 'Fsharp',
    },
    'favicon.ico': {
        icon: '',
        name: 'Favicon',
    },
    fish: {
        icon: '',
        name: 'Fish',
    },
    fs: {
        icon: '',
        name: 'Fs',
    },
    fsi: {
        icon: '',
        name: 'Fsi',
    },
    fsscript: {
        icon: '',
        name: 'Fsscript',
    },
    fsx: {
        icon: '',
        name: 'Fsx',
    },
    gemspec: {
        icon: '',
        name: 'Gemspec',
    },
    gif: {
        icon: '',
        name: 'Gif',
    },
    go: {
        icon: '',
        name: 'Go',
    },
    h: {
        icon: '',
        name: 'H',
    },
    haml: {
        icon: '',
        name: 'Haml',
    },
    hbs: {
        icon: '',
        name: 'Hbs',
    },
    hh: {
        icon: '',
        name: 'Hh',
    },
    hpp: {
        icon: '',
        name: 'Hpp',
    },
    hrl: {
        icon: '',
        name: 'Hrl',
    },
    hs: {
        icon: '',
        name: 'Hs',
    },
    htm: {
        icon: '',
        name: 'Htm',
    },
    html: {
        icon: '',
        name: 'Html',
    },
    erb: {
        icon: '',
        name: 'Erb',
    },
    hxx: {
        icon: '',
        name: 'Hxx',
    },
    ico: {
        icon: '',
        name: 'Ico',
    },
    ini: {
        icon: '',
        name: 'Ini',
    },
    java: {
        icon: '',
        name: 'Java',
    },
    jl: {
        icon: '',
        name: 'Jl',
    },
    jpeg: {
        icon: '',
        name: 'Jpeg',
    },
    jpg: {
        icon: '',
        name: 'Jpg',
    },
    js: {
        icon: '',
        name: 'Js',
    },
    json: {
        icon: '',
        name: 'Json',
    },
    jsx: {
        icon: '',
        name: 'Jsx',
    },
    ksh: {
        icon: '',
        name: 'Ksh',
    },
    leex: {
        icon: '',
        name: 'Leex',
    },
    less: {
        icon: '',
        name: 'Less',
    },
    lhs: {
        icon: '',
        name: 'Lhs',
    },
    license: {
        icon: '',
        name: 'License',
    },
    lua: {
        icon: '',
        name: 'Lua',
    },
    makefile: {
        icon: '',
        name: 'Makefile',
    },
    markdown: {
        icon: '',
        name: 'Markdown',
    },
    md: {
        icon: '',
        name: 'Md',
    },
    mdx: {
        icon: '',
        name: 'Mdx',
    },
    'mix.lock': {
        icon: '',
        name: 'MixLock',
    },
    mjs: {
        icon: '',
        name: 'Mjs',
    },
    ml: {
        icon: 'λ',
        name: 'Ml',
    },
    mli: {
        icon: 'λ',
        name: 'Mli',
    },
    mustache: {
        icon: '',
        name: 'Mustache',
    },
    nix: {
        icon: '',
        name: 'Nix',
    },
    node_modules: {
        icon: '',
        name: 'NodeModules',
    },
    php: {
        icon: '',
        name: 'Php',
    },
    pl: {
        icon: '',
        name: 'Pl',
    },
    pm: {
        icon: '',
        name: 'Pm',
    },
    png: {
        icon: '',
        name: 'Png',
    },
    pp: {
        icon: '',
        name: 'Pp',
    },
    ps1: {
        icon: '',
        name: 'PromptPs1',
    },
    psb: {
        icon: '',
        name: 'Psb',
    },
    psd: {
        icon: '',
        name: 'Psd',
    },
    py: {
        icon: '',
        name: 'Py',
    },
    pyc: {
        icon: '',
        name: 'Pyc',
    },
    pyd: {
        icon: '',
        name: 'Pyd',
    },
    pyo: {
        icon: '',
        name: 'Pyo',
    },
    r: {
        icon: 'ﳒ',
        name: 'R',
    },
    R: {
        icon: 'ﳒ',
        name: 'R',
    },
    rake: {
        icon: '',
        name: 'Rake',
    },
    rakefile: {
        icon: '',
        name: 'Rakefile',
    },
    rb: {
        icon: '',
        name: 'Rb',
    },
    rlib: {
        icon: '',
        name: 'Rlib',
    },
    rmd: {
        icon: '',
        name: 'Rmd',
    },
    Rmd: {
        icon: '',
        name: 'Rmd',
    },
    rproj: {
        icon: '鉶',
        name: 'Rproj',
    },
    rs: {
        icon: '',
        name: 'Rs',
    },
    rss: {
        icon: '',
        name: 'Rss',
    },
    sass: {
        icon: '',
        name: 'Sass',
    },
    scala: {
        icon: '',
        name: 'Scala',
    },
    scss: {
        icon: '',
        name: 'Scss',
    },
    sh: {
        icon: '',
        name: 'Sh',
    },
    slim: {
        icon: '',
        name: 'Slim',
    },
    sln: {
        icon: '',
        name: 'Sln',
    },
    sql: {
        icon: '',
        name: 'Sql',
    },
    styl: {
        icon: '',
        name: 'Styl',
    },
    suo: {
        icon: '',
        name: 'Suo',
    },
    swift: {
        icon: '',
        name: 'Swift',
    },
    t: {
        icon: '',
        name: 'Tor',
    },
    tex: {
        icon: 'ﭨ',
        name: 'Tex',
    },
    toml: {
        icon: '',
        name: 'Toml',
    },
    ts: {
        icon: '',
        name: 'Ts',
    },
    tsx: {
        icon: '',
        name: 'Tsx',
    },
    twig: {
        icon: '',
        name: 'Twig',
    },
    vim: {
        icon: '',
        name: 'Vim',
    },
    vue: {
        icon: '﵂',
        name: 'Vue',
    },
    webmanifest: {
        icon: '',
        name: 'Webmanifest',
    },
    webp: {
        icon: '',
        name: 'Webp',
    },
    xcplayground: {
        icon: '',
        name: 'XcPlayground',
    },
    xul: {
        icon: '',
        name: 'Xul',
    },
    yaml: {
        icon: '',
        name: 'Yaml',
    },
    yml: {
        icon: '',
        name: 'Yml',
    },
    zsh: {
        icon: '',
        name: 'Zsh',
    },
    terminal: {
        icon: '',
        name: 'Terminal',
    },
    pdf: {
        icon: '',
        name: 'Pdf',
    },
    kt: {
        icon: '𝙆',
        name: 'Kotlin',
    },
    gd: {
        icon: '',
        name: 'GDScript',
    },
    tscn: {
        icon: '',
        name: 'TextScene',
    },
    godot: {
        icon: '',
        name: 'GodotProject',
    },
    tres: {
        icon: '',
        name: 'TextResource',
    },
    glb: {
        icon: '',
        name: 'BinaryGLTF',
    },
    import: {
        icon: '',
        name: 'ImportConfiguration',
    },
    material: {
        icon: '',
        name: 'Material',
    },
    otf: {
        icon: '',
        name: 'OpenTypeFont',
    },
    cfg: {
        icon: '',
        name: 'Configuration',
    },
    pck: {
        icon: '',
        name: 'PackedResource',
    },
    desktop: {
        icon: '',
        name: 'DesktopEntry',
    },
    opus: {
        icon: '',
        name: 'OPUS',
    },
    svelte: {
        icon: '',
        name: 'Svelte',
    },
    default_icon: {
        icon: '',
        name: 'Default',
    },
    default_folder: {
        icon: '',
        name: 'DefaultFolder',
    },
    default_folder_open: {
        icon: '',
        name: 'DefaultFolder',
    },
};
exports.default = icons;
