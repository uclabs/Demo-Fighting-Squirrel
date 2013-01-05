#!/usr/bin/env node
'use strict';

var http = require('http'),
    path = require('path'),
    fs = require('fs'),
    express = require('express'),
    commander = require('commander'),
    Watcher = require('./lib/watch'),
    tpl = require('./lib/template'),
    util = require('./lib/util'),
    existsSync = fs.existsSync || path.existsSync,
    tplTools, server;

// 模板工具方法
tplTools = {
    genTag: function (type, url) {
        var tag;
        switch (type) {
        case 'css':
            tag = '<link rel="stylesheet" href="' + url + '">';
            break;
        case 'js':
            tag = '<script src="' + url + '"></script>';
            break;
        default:
            tag = '';
        }
        return tag;
    },
    genTags: function (type, urls) {
        return urls.map(function (url) {
            return this.genTag(type, url);
        }, this).join('\n');
    }
};

// 开发服务器
server = {
    controller: fs.realpathSync('./app.js'),
    server: express(),
    init: function (config) {
        var that = this,
            app = this.server,
            cfg;

        // 初始化服务器配置
        config = config || {};
        cfg = this.config = {
            name: config.name || 'Server',
            staticPrefix: config.staticPrefix || '/public',
            staticDir: config.staticDir || 'public',
            privateDir: 'private',
            tplDir: config.tplDir || false,
            port: config.port || 0,
            testPath: config.testPath || '/test',
            pidFile: config.pidFile,
            debug: config.debug === false ? config.debug : true
        };

        cfg.tplDir = cfg.tplDir || path.join(cfg.staticDir, 'tpl');
        cfg.tplDir = path.resolve(cfg.tplDir);
        util.mkdirp(cfg.tplDir);

        cfg.pidFile = pidFile === false ? false : pidFile ||
            path.join(cfg.privateDir, 'var', cfg.name.toLowerCase() + '.pid');
        cfg.pidFile = path.resolve(cfg.pidFile);
        util.mkdirp(path.dirname(cfg.pidFile));

        // 初始化 express 配置
        app.use(express.bodyParser());
        app.use(app.router);
        app.use(cfg.staticPrefix, express.static(cfg.staticDir));
        app.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));

        // 初始化 controller
        this.reload();

        // 监视 controller 文件改动
        new Watcher(this.controller, function (changed, done) {
            if (changed[that.controller] === 'change') {
                that.reload();
            }
            done();
        });

        return this;
    },
    // 当 controller 发生变化时重载
    reload: function () {
        var method = ['get', 'post', 'put', 'delete'],
            keys = Object.keys,
            app = this.server,
            controller = this.controller,
            cfg = this.config,
            routes = app.routes;
        console.time('Reload');

        function staticMap(file) {
            var url = path.join(cfg.staticPrefix, path.relative(cfg.staticDir, file));
            if (cfg.debug === true) {
                url += '?' + (+new Date);
            }
            return url;
        }

        // 重载模块
        // TODO: 当 app.js 较大时（900+ 行）刷新时会报错，看起来像 app.js 没有读完
        delete require.cache[controller];
        controller = require(controller).call(app, cfg);

        // 更新路由
        keys(routes).forEach(function (key) {
            delete routes[key];
        });

        keys(controller).forEach(function (route) {
            var config = controller[route];
            method.forEach(function (m) {
                if (typeof config[m] === 'function') {
                    app[m].call(app, route, function () {
                        var handler = config[m],
                            req = arguments[0],
                            res = arguments[1],
                            data = handler.apply(config, arguments) || {},
                            jsFiles = data.jsFiles = [],
                            cssFiles = data.cssFiles = [],
                            watch,
                            tplFile;

                        // 若函数内调用了 res.end 则直接返回不做进一步处理
                        if (/\.end\(/.test(handler.toString())) {
                            return;
                        }

                        // 若设定了模板，响应 text/html
                        if (typeof config.template === 'string') {
                            watch = config.watch;
                            if (Array.isArray(watch)) {
                                watch.forEach(function (files) {
                                    util.expandPath(files).forEach(function (file) {
                                        switch (path.extname(file)) {
                                        case '.js':
                                            jsFiles.push(file);
                                            break;
                                        case '.css':
                                            cssFiles.push(file);
                                            break;
                                        }
                                    });
                                });

                                data.jsFiles = util.calcDepends(jsFiles).map(staticMap);
                                data.cssFiles = util.calcDepends(cssFiles).map(staticMap);
                            }

                            tplFile = path.join(cfg.tplDir, config.template);
                            tpl.reload(tplFile);
                            res.setHeader('Content-Type', 'text/html; charset=utf-8');
                            res.end(tpl.tmpl(tplFile, data, tplTools));
                        // 若返回值 data 为字符串，响应 application/javascript
                        } else if (typeof data === 'string') {
                            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
                            res.end(data);
                        // 否则响应 application/json
                        } else {
                            res.setHeader('Content-Type', 'application/json; charset=utf-8');
                            res.end(JSON.stringify(data));
                        }
                    });
                }
            });
        });
        console.timeEnd('Reload');
    },
    run: function (port) {
        var app = http.createServer(this.server),
            cfg = this.config,
            address,
            pidFile = cfg.pidFile;

        port = port || cfg.port;
        address = app.listen(port).address();

        console.log(cfg.name + ' starting up...\nListening on ' +
            address.address + ':' + address.port + '\n' +
            'Hit Ctrl-C to quit.');

        // 输出 pid 文件
        if (pidFile) {
            fs.writeFileSync(pidFile, process.pid);
            process.on('SIGINT', function () {
                if (existsSync(pidFile)) {
                    fs.unlinkSync(pidFile);
                }
                process.kill(process.pid);
            });
        }

        return app;
    }
};

exports.server = server;
exports.grunt = function (grunt, async, port) {
    var config = grunt.config('server'),
        app = server.init(config).run(port),
        address = app.address(),
        qunitConfig;
    if (async !== false) {
        this.async();
    }

    // 若是 testserver 任务，则向 qunit 任务输出 elf 配置项
    if (this.name === 'testserver') {
        qunitConfig = grunt.config('qunit');
        qunitConfig = qunitConfig || {};
        qunitConfig.elf = ['http://' + address.address +
            ':' + address.port + config.testPath];
        grunt.config.set('qunit', qunitConfig);
    }
};

if (require.main === module) {
    var port, pidFile; 
    commander.option('-p, --port <number>', 'server port')
        .option('-P, --pidfile <path>', 'path of pidfile')
        .parse(process.argv);
    port = commander.port && parseFloat(commander.port);
    pidFile = commander.pidfile;

    server.init({
        port: port,
        pidFile: pidFile
    }).run();
}