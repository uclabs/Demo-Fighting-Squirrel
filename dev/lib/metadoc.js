var path = require('path'),
    fs = require('fs'),
    existsSync = fs.existsSync || path.existsSync,
    Showdown = require('./showdown'),
    converter = new Showdown.converter(),
    tpl = require('./template'),
    util = require('./util'),
    mdFilter = /(\S| )+\.(md|markdown|mdown|mkdn|mkd)$/,
    themeRoot = 'private/themes',
    templates;

// 整理 Array，删除其中的 undefined
function arrangeArray (array) {
    var item, i, l;
    if (!Array.isArray(array) || array.length === 0) {
        return [];
    }
    l = array.length;
    i = l - 1;

    while (i >= 0) {
        item = array[i];
        if (typeof item === 'undefined') {
            array.splice(i, 1);
        }
        i--;
    }
    return array;
}

// 轮询文件夹获取内部符合指定筛选条件的文件
function traverse (root, files, filter) {
    if (!Array.isArray(files)) {
        files = [];
    }

    var stat = fs.lstatSync(root),
        dirFiles, realPath;

    if (stat.isDirectory()) {
        dirFiles = fs.readdirSync(root);
        dirFiles.forEach(function (file, i) {
            return traverse(path.join(root, file), files, filter);
        }, this);
    } else {
        realPath = fs.realpathSync(root);
        if (!filter || (filter && filter.test(realPath))) {
            files.push(realPath);
        }
    }

    return files;
}

// 获取文件夹信息，如果设置了轮询，返回的文件夹列表为空数组
function getDirectoryInfo (directory, iterate, filter) {
    var stat = fs.lstatSync(directory),
        data = {},
        dirFiles;

    data.directorys = [];
    data.files = [];

    if (stat.isDirectory()) {
        if (iterate) {
            data.files = traverse(directory, data.files, filter);
        } else {
            dirFiles = fs.readdirSync(directory);
            dirFiles.forEach(function (file, i) {
                var filePath = path.join(directory, file),
                    stat = fs.lstatSync(filePath);
                if (stat.isDirectory()) {
                    data.directorys.push(file);
                } else {
                    realPath = fs.realpathSync(filePath);
                    if (!filter || (filter && filter.test(realPath))) {
                        data.files.push(realPath);
                    }
                }
            });
        }
    } else {
        console.error(directory + ' is Not Directory.');
    }

    return data;
};


// 读取 Markdown 文件，并根据 H1 解析为段
function getSection (filepath) {
    var fileData = fs.readFileSync(filepath, 'utf8').split('\n'),
        line, match, lastLine,
        sections = [], sectionName,
        sectionData = [], sectionsData = [],
        setextStyleHeadingPattern = /^#\s+(.*)/,
        atxStyleHeadingPattern = /^(={3,})(\s*)$/,
        endWithWhitespaceattern = /(\s*)$/,
        startWithWhitespaceattern = /^(\s*)/,
        endWithSharpPattern = /(#+)$/;

    while (fileData.length > 0) {
        line = fileData.shift();
        if (atxStyleHeadingPattern.test(line)) {
            if (lastLine && lastLine.length > 0) {
                if (sectionName) {
                    sectionData.pop();
                    sectionsData.push({
                        id: sectionName,
                        data: sectionData.join('\n')
                    })
                    sectionData = [];
                }
                sectionName = lastLine.replace(startWithWhitespaceattern, '');
                sectionName = sectionName.replace(endWithWhitespaceattern, '');
                sections.push(sectionName);
                lastLine = '';
            } else {
                lastLine = line;
            }
        } else {
            match = setextStyleHeadingPattern.exec(line);
            if ((match || []).length > 1) {
                if (sectionName) {
                    sectionsData.push({
                        id: sectionName,
                        data: sectionData.join('\n')
                    });
                    sectionData = [];
                }
                sectionName = match[1];
                if (endWithWhitespaceattern.test(sectionName)) {
                    sectionName = sectionName.replace(endWithWhitespaceattern, '');
                } else {
                    sectionName = sectionName.replace(endWithSharpPattern, '');
                }
                sections.push(sectionName);
                lastLine = '';
            } else {
                lastLine = line;
            }
        }

        if (sectionName) {
            sectionData.push(lastLine);
        }
    }
    if (sectionName) {
        sectionsData.push({
            id: sectionName,
            data: sectionData.join('\n')
        });
        sectionData = [];
    }

    return [sections, sectionsData];
}

function prettifyHtml (text) {
    // beautify Code
    text = text.replace(/<pre([^>\n]*)>/g, '<pre$1 class="prettyprint linenums">');

    // beautify Table
    text = text.replace(/<table([^>\n]*)>/g, '<table$1 class="table table-striped table-bordered">');
    
    return text;
}

function Metadoc (config) {
    this.config = {
        fromPath: config.fromPath,
        toPath: config.toPath,
        metaFile: config.metaFile || 'meta.json',
        theme: config.theme || 'bootstrap'
    };
    this.rootId = 'index';
}

Metadoc.prototype.process = function () {
    var that = this,
        cfg = this.config,
        root = {}, systems = [];

    this.themePath = path.join(themeRoot, cfg.theme);
    if (!existsSync(this.themePath)) {
        console.error('No Theme Founded.');
        return;
    }

    this.fromPath = cfg.fromPath;
    if (!existsSync(this.fromPath)) {
        console.error('fromPath not Founded.');
        return;
    }

    this.toPath = cfg.toPath;
    if (!existsSync(this.toPath)) {
        fs.mkdirSync(this.toPath);
    }

    root = this.getData(this.fromPath, false);
    root.items = [];
    root.id = this.rootId;
    root.name = root.name || root.id;
    root.path = this.rootId;
    root.body = '';
    // 如果根目录存在名称，则在头部最前显示
    if (root.name) {
        systems.push({
            id: this.rootId,
            name: root.name
        });
    }

    root.children.forEach(function (c, i) {
        var directory, system;
        if (c === this.rootId) {
            console.error('System named \'index\' was Found');
        }
        directory = path.join(that.fromPath, c);
        system = that.getSystem(c, directory);
        root.items.push(system);
        systems.push(system);
    });

    this.genHtml(root, systems);
    root.items.forEach(function (s, i) {
        that.writeFile(that.toPath, s);
    });

    root.html = root.body.length > 0 ? root.html : (root.items[0] || {}).html;
    root.items = [];
    this.writeFile(that.toPath, root);
    if (existsSync(path.join(this.themePath, 'assets'))) {
        util.copyDir(path.join(this.themePath, 'assets'), path.join(this.toPath, 'assets'), true);
    }
};


// 获取模版
Metadoc.prototype.getTemplates = function () {
    var that = this;
    this.tplList = ['header', 'page', 'nav', 'breadcrumb', 'main', 'section', 'footer'];
    if (this.templates) {
        return this.templates;
    }
    this.templates = {};
    this.tplList.forEach(function (t, i) {
        var filepath = path.join(that.themePath, t + '.html');
        if (existsSync(filepath)) {
            that.templates[t] = fs.readFileSync(filepath, 'utf8');
        }
    });
    return this.templates;
};

// 写入文件，如果存在 item 则会循环写入
Metadoc.prototype.writeFile = function(directory, data) {
    var that = this;
    if (!existsSync(directory)) {
        fs.mkdirSync(directory);
    }
    if (data.html && data.html.length > 0 && data.path) {
        fs.writeFileSync(path.join(directory, data.path + '.html'), data.html, 'utf8');
    }

    if(data.items) {
        data.items.forEach(function (it, i) {
            that.writeFile(directory, it);
        });
    }
};

// 获取 meta 文件的信息
Metadoc.prototype.getMetaInfo = function (rootDirectory) {
    var metaPath = path.join(rootDirectory, this.config.metaFile),
        metaInfo;
    if (existsSync(metaPath)) {
        try {
            metaInfo = require(fs.realpathSync(metaPath));
        } catch (e) {
            console.error('Failed When Parse Metafile:' + metaPath);
        }
    }
    return metaInfo;
};

// 根据模版，将内容生成为 Html
Metadoc.prototype.genHtml = function (data, systems) {
    var that = this,
        html = '',
        templates = this.getTemplates(),
        header, headerHtml = '',
        page, pageHtml = '',
        nav, navHtml = '',
        breadcrumb, breadcrumbHtml = '',
        main, mainHtml = '',
        footer, footerHtml = '',
        systemId, innerContent = [];

    if (!templates) {
        console.error('No Template Founded.');
        return;
    }

    header = templates.header;
    page = templates.page;
    nav = templates.nav;
    breadcrumb = templates.breadcrumb;
    main = templates.main;
    footer = templates.footer;

    data.descriptionsData.forEach(function (d, i) {
        var descriptionsHtml = prettifyHtml(converter.makeHtml(d));
        innerContent.push(descriptionsHtml);
    });
    data.sections.forEach(function (s, i) {
        if (data.sectionsData[s]) {
            var sectionContent = prettifyHtml(converter.makeHtml(data.sectionsData[s])),
                section = templates.section,
                sectionHtml = tpl.tmpl(section, {id: s, content: sectionContent});
            innerContent.push(sectionHtml);
        }
    });

    if (data.isModule) {
        systemId = data.systemId;
        breadcrumbHtml = tpl.tmpl(breadcrumb, {
            system: {
                link: data.systemId + '.html',
                name: data.systemName
            },
            module: {name: data.name}
        });
        data.path = systemId + '-' + data.id;
    } else {
        systemId = data.id;
        breadcrumbHtml = tpl.tmpl(breadcrumb, {});
        data.path = systemId;
    }

    if (innerContent.length > 0 || (data.items || []).length === 0) {
        navHtml = tpl.tmpl(nav, {systems: systems, id: systemId});
        pageHtml += navHtml;
        pageHtml += breadcrumbHtml;
        mainHtml = tpl.tmpl(main, {
            sections: data.sections,
            sidebarOn: data.sidebarOn,
            content: innerContent.join('\n')
        });
        pageHtml += mainHtml;
    }

    data.body = pageHtml;
    (data.items || []).forEach(function (item, i) {
        var itemBody = that.genHtml(item, systems);
        if (i===0 && data.body.length === 0) {
            data.body = itemBody;
        }
    });
    html = tpl.tmpl(page, {body: data.body, header: header, footer:footer});
    data.html = html;
    return pageHtml;
};

// 获取系统
Metadoc.prototype.getSystem = function (id, root) {
    var that = this,
        system = this.getData(root, false);

    system.id = id;
    system.name = system.name || id;
    system.directory = root;
    system.items = [];

    system.children.forEach(function (c, i) {
        var directory = path.join(root, c),
            module = that.getModule(c, directory, system);
        system.items.push(module);
    });

    return system;
};

// 获取 Module
Metadoc.prototype.getModule = function (id, root, system) {
    var module = this.getData(root, true);

    module.id = id;
    module.isModule = true;
    module.directory = root;
    module.name = module.name || id;
    module.systemId = system.id;
    module.systemName = system.name;
    
    return module;
};

// 获取数据
Metadoc.prototype.getData = function (rootDirectory, iterate, mdFilter) {
    var metaInfo = this.getMetaInfo(rootDirectory) || {},
        metaName = metaInfo.name,
        metaDescription = metaInfo.description || [],
        metaOrder = metaInfo.order || [],
        metaChildren = metaInfo.childrenOrder || [],
        sidebarOn = metaInfo.sidebarOn,
        showOnNav = metaInfo.showOnNav,
        description = new Array(metaDescription.length),
        tmpDescription = [], descriptionsData = [],
        files = [],
        sections = new Array(metaOrder.length),
        sectionsData = {},
        children = new Array(metaChildren.length),
        data;


    if (sidebarOn !== true && sidebarOn !== false) {
        if (children.length === 0) {
            sidebarOn = true;
        } else {
            sidebarOn = false;
        }
    }

    metaDescription.forEach(function (d, i) {
        var tmpPath = path.join(rootDirectory, d);
        if (existsSync(tmpPath)) {
            tmpDescription.push(fs.realpathSync(tmpPath));
        }
    });

    directoryInfo = getDirectoryInfo(rootDirectory, iterate, mdFilter);
    directoryInfo.files.forEach(function (f, i) {
        var index = tmpDescription.indexOf(f);
        if (index >= 0) {
            description[index] = f;
        } else {
            files.push(f);
        }
    });
    arrangeArray(description);

    description.forEach(function (d, i) {
        var descriptionData = fs.readFileSync(d, 'utf8');
        if (descriptionData) {
            descriptionsData.push(descriptionData);
        }
    });

    files.forEach(function (f, i) {
        var result = getSection(f),
            secs = result[0],
            secsData = result[1];

        secs.forEach(function (s, i) {
            var index = metaOrder.indexOf(s);
            if (sections.indexOf(s) >= 0) {
                console.error('Repeat Section Name:' + s + ' Founded in file:' + f);
                return;
            } else {
                if (index >= 0) {
                sections[index] = s;
                } else {
                    sections.push(s);
                }
            }
        });
        
        secsData.forEach(function (sd, i) {
            if (sd && sd.id) {
                sectionsData[sd.id] = sd.data;
            }
        });
    });

    arrangeArray(sections);

    directoryInfo.directorys.forEach(function (d, i) {
        var index = metaChildren.indexOf(d);
        if (index >= 0) {
            children[index] = d;
        } else {
            children.push(d);
        }
    });
    arrangeArray(children);

    data = {
        name: metaName,
        children: children,
        sidebarOn: sidebarOn,
        sections: sections,
        sectionsData: sectionsData,
        descriptionsData: descriptionsData,
        showOnNav: showOnNav
    };
    return data;
};

module.exports = Metadoc;
