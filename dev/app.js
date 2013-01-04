var path = require('path'),
    fs = require('fs'),
    express = require('express'),
    existsSync = fs.existsSync || path.existsSync;

module.exports = function (config) {
    var staticDir = config.staticDir,
        elfPath = path.join(staticDir, 'lib/elf/**/*.js'),
        commonPath = path.join(staticDir, 'common/**/*.js'),
        clientPath = path.join(staticDir, 'client/**/*.js'),
        cssPath = path.join(staticDir, 'css/**/*.css'),
        mainPath = path.join(staticDir, 'tpl/main.js'),
        app = this;

    return {
        '/': {
            template: 'index.tpl',
            watch: [cssPath, elfPath, commonPath, clientPath],
            get: function () {}
        },
        '/main.js': {
            get: function () {
                return existsSync(mainPath) ?
                    fs.readFileSync(mainPath, 'utf8') : '';
            }
        }
    };
};