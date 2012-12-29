/**
 * Log
 *
 * @import ./Config.js
 */
elf.define('FS::Log', ['FS::Config'], function (config) {
    'use strict';
    
    // 格式 log(class, method, ...agrs)
    var log = window.log = config.log ?
        function (name, method) {
            var slice = Array.prototype.slice,
                args = slice.call(arguments, 2);
            if (typeof method === 'undefined') {
                method = name;
                name = 'unknow';
            }

            var logs = ['[' + name + ']', method];
            if (args.length > 0) {
                logs = logs.concat('(', args, ')');
            }
            console.log.apply(console, logs);
        } : function () {};
    return log;
});