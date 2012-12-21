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
                manager.fire(name, [method]);
            };
        });
    });

    manager.bind('config', function(opts) {
        log('manager', 'config', opts);
        manager.postMessage('director', ['config', opts]);
    });

    manager.bind('game', function(action) {
        switch(action) {
            case 'start':
                log('manager', 'postMessage', 'director.start');
                manager.postMessage('director', ['start']);
                break;

            case 'exit':
                manager.exitMenu.show();
                break;

            case 'stop':
                log('manager', 'postMessage', 'director.stop');
                manager.postMessage('director', ['stop']);
                manager.mainMenu.show();
                break;

            case 'restart':
                log('manager', 'postMessage', 'director.restart');
                manager.postMessage('director', ['restart']);
                break;
        }
    });

    manager.bind('director', function(state) {
        switch(state) {
            case 'ready':
                log('manager', 'postMessage', 'director.show');
                manager.mainMenu.hide();
                manager.gameMenu.show();
                manager.postMessage('director', ['show']);
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