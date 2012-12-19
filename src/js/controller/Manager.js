/**
 * Manager
 *
 * @import ../../../lib/elf/mod/async.js
 */
elf.define('FS::Controller::Manager', ['async'], function (async) {
    var that = this,
        keys = Object.keys,
        slice = Array.prototype.slice,
        manager = {
            splash: {},
            mainMenu: {},
            resultMenu: {}
        };

    keys(manager).forEach(function (name) {
        ['show', 'hide'].forEach(function(method) {
            manager[name][method] = function () {
                that.fire(name, method);
            };
        });
    });

    manager.init = function() {
        splash.hide();
    };

    return manager;
});