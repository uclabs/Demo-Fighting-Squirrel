/**
 * Manager
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/async.js
 * @import ../model/mixin/EventMixin.js
 * @import ../model/mixin/MessageMixin.js
 */
elf.define('FS::Controller::Manager', [
    'lang',
    'async',
    'FS::Model::EventMixin',
    'FS::Model::MessageMixin'
], function (_, async, eventMixin, messageMixin) {
    'use strict';

    var manager = _.extend({}, eventMixin, messageMixin),
        views = ['splash', 'mainMenu', 'resultMenu', 'gameMenu', 'exitMenu'];

    views.forEach(function (name) {
        ['show', 'hide'].forEach(function(method) {
            if (!manager[name]) {
                manager[name] = {};
            }
            manager[name][method] = function () {
                manager.sendClient(name, [method]);
            };
        });
    });

    manager.listenClient('config', function(opts) {
        log('manager', 'config', opts);
        manager.sendMessage('director', ['config', opts]);
    });

    manager.listenClient('game', function(action) {
        switch(action) {
            case 'start':
                log('manager', 'sendMessage', 'director.start');
                manager.sendMessage('director', ['start']);
                break;

            case 'exit':
                manager.exitMenu.show();
                break;

            case 'stop':
                log('manager', 'sendMessage', 'director.stop');
                manager.sendMessage('director', ['stop']);
                manager.mainMenu.show();
                break;

            case 'restart':
                log('manager', 'sendMessage', 'director.restart');
                manager.sendMessage('director', ['restart']);
                break;
        }
    });

    manager.listenClient('director', function(state) {
        switch(state) {
            case 'ready':
                log('manager', 'sendMessage', 'director.show');
                manager.mainMenu.hide();
                manager.gameMenu.show();
                manager.sendMessage('director', ['show']);
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