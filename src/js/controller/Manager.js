/**
 * Manager
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/async.js
 * @import Messager.js
 * @import ../model/mixin/EventMixin.js
 */
elf.define('FS::Controller::Manager', [
    'lang',
    'async',
    'FS::Controller::Messager',
    'FS::Model::EventMixin'
], function (_, async, messager, eventMixin) {
    'use strict';

    var manager = {},
        views = ['splash', 'mainMenu', 'resultMenu', 'gameMenu', 'exitMenu'];

    // 把事件 mixin
    _.extend(manager, eventMixin);

    views.forEach(function (name) {
        ['show', 'hide'].forEach(function(method) {
            if (!manager[name]) {
                manager[name] = {};
            }
            manager[name][method] = function () {
                manager.fire(name, [method]);
            };
        });
    });

    manager.bind('mode', function(mode) {
        log('manager', 'mode', mode);
        messager.fire('director', ['config', {mode: mode}]);
    });

    manager.bind('game', function(action) {
        switch(action) {
            case 'start':
                log('manager', 'fire', 'director|start');
                messager.fire('director', ['start']);
                break;

            case 'exit':
                manager.exitMenu.show();
                break;

            case 'stop':
                log('manager', 'fire', 'director|stop');
                messager.fire('director', ['stop']);
                manager.mainMenu.show();
                break;

            case 'restart':
                log('manager', 'fire', 'director|restart');
                messager.fire('director', ['restart']);
                break;
        }
    });

    manager.bind('director', function(state) {
        switch(state) {
            case 'ready':
                manager.mainMenu.hide();
                manager.gameMenu.show();
                messager.fire('director', ['show']);
                break;
        }
    });

    function init() {
        log('manager', 'init');
        manager.splash.hide();
        manager.mainMenu.show();
    };

    return {
        init: init
    };
});