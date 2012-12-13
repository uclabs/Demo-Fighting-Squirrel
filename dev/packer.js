/**
 * Packer for Elf
 */
'use strict';

var path = require('path'),
    fs = require('fs'),
    uparser = require('uglify-js').parser,
    uglify = require('uglify-js').uglify,
    cleanCSS = require('clean-css').process,
    _ = require('./lib/lang'),
    util = require('./lib/util'),
    existsSync = fs.existsSync || path.existsSync,
    expand = util.expandPath,
    getDepends = util.getDepends,
    slice = Array.prototype.slice,
    isArray = Array.isArray,
    // 各类型文件的压缩处理函数
    processor = {
        default: function (input) {
            return input;
        },
        uglify: function (input) {
            var ast = uparser.parse(input);
            ast = uglify.ast_mangle(ast);
            ast = uglify.ast_squeeze(ast);
            return uglify.gen_code(ast);
        },
        cleanCSS: function (input) {
            return cleanCSS(input);
        }
    };

function genRandomFilename(ext) {
    return 'pack_' + Math.round(new Date/1000) +
        (ext ? '.' + ext : '');
}

function Packer(config) {
    var cfg = this.config = {
            banner: config.banner || '',
            src: config.src || [],
            // 不压缩但打包的文件
            ignore: config.ignore || [],
            // 不打包的文件
            exclude: config.exclude || [],
            dest: typeof config.dest === 'string' ?
                config.dest : 'release/' + genRandomFilename(config.type),
            type: config.type
        },
        exclude = isArray(cfg.exclude) ? expand(cfg.exclude) : [];

    this.ignoreFiles = isArray(cfg.ignore) ? expand(cfg.ignore) : [];

    // 处理源文件，排除不打包文件
    this.srcFiles = isArray(cfg.src) ? expand(cfg.src, function (file) {
        if (exclude.indexOf(file) === -1) {
            return true;
        }
    }) : [];

    // 获取 cfg.dest 所在目录，若不存在则创建
    this.destDir = path.dirname(cfg.dest);
    if (!existsSync(this.destDir)) {
        fs.mkdirSync(this.destDir);
    }
    this.destFile = path.basename(cfg.dest);

    // 存放经过计算依赖后的全部文件
    this.allFiles = util.calcDepends(this.srcFiles);

    // 根据类型判断压缩处理方法和文件分割符
    this.sep = '';
    switch (cfg.type) {
    case 'js':
        this.process = processor.uglify;
        this.sep = ';';
        break;
    case 'css':
        this.process = processor.cleanCSS;
        break;
    default:
        this.process = processor.default;
    }
}

Packer.prototype.pack = function () {
    var files = this.allFiles,
        i, l = files.length,
        file, data,
        result = [],
        banner = this.config.banner;

    if (l === 0) {
        return;
    }

    banner = typeof banner === 'string' ? banner : '';

    // 压缩并打包
    for (i=0; i<l; i++) {
        file = files[i];
        data = fs.readFileSync(file, 'utf8');
        if (this.ignoreFiles.indexOf(file) === -1) {
            try {
                data = this.process(data);
            } catch (e) {
                console.error('Process ' + file + ' failed at line: ' + e.line + '.');
                console.error('Message: ' + e.message + '.');
                return;
            }
        }
        result.push(data);
    }

    fs.writeFileSync(path.join(this.destDir, this.destFile),
        banner + result.join(this.sep), 'utf8');
};

exports.Packer = Packer;
exports.uglify = processor.uglify;
exports.cleanCSS = processor.cleanCSS;

// Grunt 任务接口
exports.grunt = function (grunt) {
    var pkg = grunt.config('pkg'),
        name = pkg && pkg.name || '',
        // 处理配置中的模板
        config = grunt.utils.recurse(this.data, function (data) {
            return typeof data !== 'string' ? data :
                grunt.template.process(data);
        }),
        // 处理 banner
        banner = grunt.task.directive(config.src[0], function() {
            return null;
        });

    if (banner === null) {
        config.banner = ''
    } else {
        config.banner = banner;
        config.src.shift();
    }

    new Packer(config).pack();
};

// if (require.main === module) {}