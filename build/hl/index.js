"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VimHighlight = void 0;
class VimHighlight {
    async init(nvim) {
        const namespace_id = await nvim.createNamespace('NodeTreeNameSpace');
        await this.setHlGroup(nvim);
        return namespace_id;
    }
    async setHlGroup(nvim) {
        const hl_queue = [];
        for (let item of groups) {
            hl_queue.push(nvim.command(`highlight NodeTreeIcon${item.hl} guifg=${item.color}`));
        }
        hl_queue.push(nvim.command(`hi NodeTreeNormal guifg=#ffffff`));
        hl_queue.push(nvim.command(`hi NodeTreePrefix guifg=#737373`));
        await Promise.all(hl_queue);
    }
}
exports.VimHighlight = VimHighlight;
const groups = [
    { hl: 'Gruntfile', color: '#e37933' },
    { hl: 'Gulpfile', color: '#cc3e44' },
    { hl: 'Dropbox', color: '#0061FE' },
    { hl: 'Xls', color: '#207245' },
    { hl: 'Doc', color: '#185abd' },
    { hl: 'Xml', color: '#e37933' },
    { hl: 'Ppt', color: '#cb4a32' },
    { hl: 'Webpack', color: '#519aba' },
    { hl: 'SettingsJson', color: '#854CC7' },
    { hl: 'Cs', color: '#596706' },
    { hl: 'Svg', color: '#FFB13B' },
    { hl: 'Procfile', color: '#a074c4' },
    { hl: 'BashProfile', color: '#89e051' },
    { hl: 'Bashrc', color: '#89e051' },
    { hl: 'Babelrc', color: '#cbcb41' },
    { hl: 'DsStore', color: '#41535b' },
    { hl: 'GitLogo', color: '#F14C28' },
    { hl: 'GitAttributes', color: '#41535b' },
    { hl: 'GitConfig', color: '#41535b' },
    { hl: 'GitModules', color: '#41535b' },
    { hl: 'GitIgnore', color: '#41535b' },
    { hl: 'GitCommit', color: '#41535b' },
    { hl: 'License', color: '#cbcb41' },
    { hl: 'License', color: '#cbcb41' },
    { hl: 'GitlabCI', color: '#e24329' },
    { hl: 'Gvimrc', color: '#019833' },
    { hl: 'NPMIgnore', color: '#E8274B' },
    { hl: 'Vimrc', color: '#019833' },
    { hl: 'Zshrc', color: '#89e051' },
    { hl: 'Zshenv', color: '#89e051' },
    { hl: 'Zshprofile', color: '#89e051' },
    { hl: 'Dockerfile', color: '#384d54' },
    { hl: 'Gemfile', color: '#701516' },
    { hl: 'License', color: '#d0bf41' },
    { hl: 'Vagrantfile', color: '#1563FF' },
    { hl: 'Gvimrc', color: '#019833' },
    { hl: 'Vimrc', color: '#019833' },
    { hl: 'Ai', color: '#cbcb41' },
    { hl: 'Awk', color: '#4d5a5e' },
    { hl: 'Bash', color: '#89e051' },
    { hl: 'Bat', color: '#C1F12E' },
    { hl: 'Bmp', color: '#a074c4' },
    { hl: 'C', color: '#599eff' },
    { hl: 'CPlusPlus', color: '#f34b7d' },
    { hl: 'ClojureC', color: '#8dc149' },
    { hl: 'ClojureJS', color: '#519aba' },
    { hl: 'CMakeLists', color: '#6d8086' },
    { hl: 'CMake', color: '#6d8086' },
    { hl: 'CPlusPlus', color: '#f34b7d' },
    { hl: 'Conf', color: '#6d8086' },
    { hl: 'Coffee', color: '#cbcb41' },
    { hl: 'ConfigRu', color: '#701516' },
    { hl: 'Clojure', color: '#8dc149' },
    { hl: 'Cp', color: '#519aba' },
    { hl: 'Csh', color: '#4d5a5e' },
    { hl: 'Cpp', color: '#519aba' },
    { hl: 'Css', color: '#563d7c' },
    { hl: 'Cxx', color: '#519aba' },
    { hl: 'Cson', color: '#cbcb41' },
    { hl: 'D', color: '#427819' },
    { hl: 'Dart', color: '#03589C' },
    { hl: 'Diff', color: '#41535b' },
    { hl: 'Db', color: '#dad8d8' },
    { hl: 'Dump', color: '#dad8d8' },
    { hl: 'Dockerfile', color: '#384d54' },
    { hl: 'Ejs', color: '#cbcb41' },
    { hl: 'Edn', color: '#519aba' },
    { hl: 'Eex', color: '#a074c4' },
    { hl: 'Ex', color: '#a074c4' },
    { hl: 'Erl', color: '#B83998' },
    { hl: 'Elm', color: '#519aba' },
    { hl: 'Exs', color: '#a074c4' },
    { hl: 'Fsharp', color: '#519aba' },
    { hl: 'Favicon', color: '#cbcb41' },
    { hl: 'Fish', color: '#4d5a5e' },
    { hl: 'Fsi', color: '#519aba' },
    { hl: 'Fs', color: '#519aba' },
    { hl: 'Fsscript', color: '#519aba' },
    { hl: 'Gemspec', color: '#701516' },
    { hl: 'Fsx', color: '#519aba' },
    { hl: 'Gif', color: '#a074c4' },
    { hl: 'H', color: '#a074c4' },
    { hl: 'Go', color: '#519aba' },
    { hl: 'Hbs', color: '#f0772b' },
    { hl: 'Haml', color: '#eaeae1' },
    { hl: 'Hpp', color: '#a074c4' },
    { hl: 'Hh', color: '#a074c4' },
    { hl: 'Hrl', color: '#B83998' },
    { hl: 'Htm', color: '#e34c26' },
    { hl: 'Hs', color: '#a074c4' },
    { hl: 'Html', color: '#e34c26' },
    { hl: 'Erb', color: '#701516' },
    { hl: 'Hxx', color: '#a074c4' },
    { hl: 'Ico', color: '#cbcb41' },
    { hl: 'Ini', color: '#6d8086' },
    { hl: 'Java', color: '#cc3e44' },
    { hl: 'Jl', color: '#a270ba' },
    { hl: 'Jpeg', color: '#a074c4' },
    { hl: 'Jpg', color: '#a074c4' },
    { hl: 'Js', color: '#cbcb41' },
    { hl: 'Json', color: '#cbcb41' },
    { hl: 'Jsx', color: '#519aba' },
    { hl: 'Ksh', color: '#4d5a5e' },
    { hl: 'Less', color: '#563d7c' },
    { hl: 'Lhs', color: '#a074c4' },
    { hl: 'License', color: '#cbcb41' },
    { hl: 'Leex', color: '#a074c4' },
    { hl: 'Makefile', color: '#6d8086' },
    { hl: 'Mdx', color: '#519aba' },
    { hl: 'MixLock', color: '#a074c4' },
    { hl: 'Mjs', color: '#f1e05a' },
    { hl: 'Markdown', color: '#519aba' },
    { hl: 'Lua', color: '#51a0cf' },
    { hl: 'Ml', color: '#e37933' },
    { hl: 'Mli', color: '#e37933' },
    { hl: 'Mustache', color: '#e37933' },
    { hl: 'Nix', color: '#7ebae4' },
    { hl: 'Php', color: '#a074c4' },
    { hl: 'NodeModules', color: '#E8274B' },
    { hl: 'Pl', color: '#519aba' },
    { hl: 'Pm', color: '#519aba' },
    { hl: 'Png', color: '#a074c4' },
    { hl: 'Pp', color: '#302B6D' },
    { hl: 'PromptPs1', color: '#4d5a5e' },
    { hl: 'Psb', color: '#519aba' },
    { hl: 'Psd', color: '#519aba' },
    { hl: 'Py', color: '#3572A5' },
    { hl: 'Pyc', color: '#519aba' },
    { hl: 'Pyo', color: '#519aba' },
    { hl: 'Pyd', color: '#519aba' },
    { hl: 'R', color: '#358a5b' },
    { hl: 'R', color: '#358a5b' },
    { hl: 'Rake', color: '#701516' },
    { hl: 'Rb', color: '#701516' },
    { hl: 'Rlib', color: '#dea584' },
    { hl: 'Rmd', color: '#519aba' },
    { hl: 'Rmd', color: '#519aba' },
    { hl: 'Rakefile', color: '#701516' },
    { hl: 'Rproj', color: '#358a5b' },
    { hl: 'Rs', color: '#dea584' },
    { hl: 'Rss', color: '#FB9D3B' },
    { hl: 'Sass', color: '#f55385' },
    { hl: 'Scala', color: '#cc3e44' },
    { hl: 'Scss', color: '#f55385' },
    { hl: 'Sh', color: '#4d5a5e' },
    { hl: 'Slim', color: '#e34c26' },
    { hl: 'Sln', color: '#854CC7' },
    { hl: 'Sql', color: '#dad8d8' },
    { hl: 'Styl', color: '#8dc149' },
    { hl: 'Swift', color: '#e37933' },
    { hl: 'Suo', color: '#854CC7' },
    { hl: 'Tor', color: '#519aba' },
    { hl: 'Tex', color: '#3D6117' },
    { hl: 'Toml', color: '#6d8086' },
    { hl: 'Ts', color: '#519aba' },
    { hl: 'Tsx', color: '#519aba' },
    { hl: 'Twig', color: '#8dc149' },
    { hl: 'Vue', color: '#8dc149' },
    { hl: 'Vim', color: '#019833' },
    { hl: 'Webmanifest', color: '#f1e05a' },
    { hl: 'Webp', color: '#a074c4' },
    { hl: 'XcPlayground', color: '#e37933' },
    { hl: 'Xul', color: '#e37933' },
    { hl: 'Yaml', color: '#6d8086' },
    { hl: 'Zsh', color: '#89e051' },
    { hl: 'Yml', color: '#6d8086' },
    { hl: 'Terminal', color: '#31B53E' },
    { hl: 'Pdf', color: '#b30b00' },
    { hl: 'Kotlin', color: '#F88A02' },
    { hl: 'GDScript', color: '#6d8086' },
    { hl: 'TextScene', color: '#a074c4' },
    { hl: 'GodotProject', color: '#6d8086' },
    { hl: 'TextResource', color: '#cbcb41' },
    { hl: 'BinaryGLTF', color: '#FFB13B' },
    { hl: 'ImportConfiguration', color: '#ECECEC' },
    { hl: 'Material', color: '#B83998' },
    { hl: 'OpenTypeFont', color: '#ECECEC' },
    { hl: 'DesktopEntry', color: '#563d7c' },
    { hl: 'PackedResource', color: '#6d8086' },
    { hl: 'Configuration', color: '#ECECEC' },
    { hl: 'OPUS', color: '#F88A02' },
    { hl: 'Svelte', color: '#ff3e00' },
    { hl: 'Md', color: '#519aba' },
    { hl: 'Default', color: '#6d8086' },
    { hl: 'DefaultFolder', color: '#487eb0' },
];
