/**
 * Depend Module
 */
'use strict';

var path = require('path'),
    fs = require('fs'),
    crypto = require('crypto'),
    vm = require('vm'),
    _ = require('./lang'),
    exists = fs.existsSync || path.existsSync;

// 计算 MD5 值
function getMD5(str) {
    return typeof str === 'string' ? 
        crypto.createHash('md5').update(str).digest('hex') :
        null;
}

// 获取文件依赖（@import 方式依赖）
function getDependFiles(file, content) {
    if (typeof content !== 'string') {
        content = fs.readFileSync(file, 'utf8');
    }

    var data = content.split(/\n/),
        i = 0,
        l = data.length,
        line, match,
        importPattern = /@import\s+(\S+)/,
        endPattern = /\*\//,
        depends = [];

    for (; i<l; i++) {
        line = data[i];
        match = importPattern.exec(line);
        if ((match || []).length > 1) {
            depends.push(path.resolve(path.dirname(file), match[1]));
        }
        if (endPattern.test(line)) {
            break;
        }
    }

    // 探测隐式依赖
    var jQeuryPattern = /[^\w](jQuery|Zepto|$)(\.|\()/,
        elfPattern = /[^\w]elf(\.|\()/;

    return depends;
}

// 获取模块信息
function getModuleInfo(file, content, context) {
    if (typeof content === 'function') {
        context = content;
    }
    if (typeof content !== 'string') {
        content = fs.readFileSync(file, 'utf8');
    }
    if (typeof context !== 'function') {
        return;
    }

    var start = '(' + context.toString() + '(this));try{',
        end = '}catch(e){};this.result';

    return vm.runInThisContext(start + content + end);
}

// 获取模块依赖（通过 elf.define 或 elf.require 依赖）
function getDependModules(file, content) {
    return getModuleInfo(file, content, function (context) {
        var elf = context.elf = {};
        context.define = elf.define = function (name, depends, block) {
            var deps = context.result;
            deps = Array.isArray(deps) ? deps : [];
            context.result = deps.concat(Array.isArray(depends) ? depends : []);
        },
        context.require = elf.require = function (depends, block) {
            var deps = context.result;
            deps = Array.isArray(deps) ? deps : [];
            context.result = deps.concat(depends);
        };
    });
}

function Depend(files) {
    this.cache = {};     // fileInfo 缓存
    this.moduleMap = {}; // 模块名与路径映射关系
    this.init(files);
}

Depend.prototype = {
    constructor: Depend,

    init: function (files) {
        var that = this,
            cache = this.cache;

        if (typeof files === 'string') {
            files = [files];
        }
        files = Array.isArray(files) ? files : [];

        // 遍历文件，初始化文件信息
        (function traverse(files) {
            var file = files.shift();
                fileInfo = {},
                filename = fileInfo.filename = fs.realpathSync(file),
                id = fileInfo.id = getMD5(filename),
                basename = path.basename(filename).split('.'),
                type = fileInfo.type = basename[basename.length - 1],
                content = fileInfo.content = fs.readFileSync(filename, 'utf8'),
                depends = that.getDepends(fileInfo);
            if (!depends) {
                files.push(fileInfo);
                return traverse(files);
            }
            fileInfo.depends = depends;
            cache[id] = fileInfo;
        }(files));
    },

    getModuleInfo: function (file, content) {
        return getModuleInfo(file, content, function (context) {
            if (context.elf) {
                return;
            }
            var elf = context.elf = {};
            context.result = [];
            context.define = elf.define = function (name, depends, block) {
                context.result.push({
                    name: 'elf',
                    depends: []
                }).push({
                    name: name,
                    depends: Array.isArray(depends) ? depends : []
                });
            },
            context.require = elf.require = function (depends, block) {
                context.result.push({
                    name: '',
                    depends: depends
                });
            };
        });
    },

    // 获取文件依赖列表
    getDepends: function (fileInfo) {
        var file = fileInfo.filename,
            content = fileInfo.content,
            dependFile, moduleInfo, depends, deps,
            cache = this.cache,
            i, l,
            name;

        dependFile = fileInfo.dependFile;
        moduleInfo = fileInfo.moduleInfo;
        depends = fileInfo.depends;

        if (!depends) {
            if (!dependFile) {
                dependFile = fileInfo.dependFile = getDependFiles(file, content);
            }

            if (!moduleInfo) {
                moduleInfo = fileInfo.moduleInfo = getModuleInfo(file, content);
            }

            depends = [];
            // 处理 moduleInfo
            for (i=0, l=moduleInfo.length; i<l; i++) {
                name = moduleInfo[i].name;
                deps = moduleInfo[i].depends;
                moduleMap[name] = file;




                filename = name && moduleMap[name];
                if (!filename) {
                    return false;
                }
                id = getMD5(filename);
                if (depends.indexOf(id) < 0) {
                    depends.push(id);
                }
            }
        }
    }
};

module.exports = {
    getMD5: getMD5,
    getDependFiles: getDependFiles,
    getDependModules: getDependModules,
    Depend: Depend
};