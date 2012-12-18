/**
 * Manager
 *
 * @import ../Dispatcher.js
 */
elf.define('FS::Controller::Manager', ['FS::Dispatcher'], function (dispatcher) {
    var keys = Object.keys,
        slice = Array.prototype.slice,
        downlink = dispatcher.downlink,
        manager = {
            splash: {},
            mainMenu: {},
            resuleMenu: {}
        };

    function action(name) {
        var args = slice.call(arguments, 1);
        return function () {
            downlink.fire(name, args);
        };
    }

    keys(manager).forEach(function (name) {
        ['show', 'hide'].forEach(function(method) {
            manager[name][method] = action(name, method);
        });
    });

    return manager;
});